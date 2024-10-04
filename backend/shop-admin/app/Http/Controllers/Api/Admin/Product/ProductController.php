<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use App\Models\ProductVariationImage;
use App\Models\ProductVariationValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(
            [
                'variations.attributeValue',
                'variations.group',
                'variations.variationValues',
                'variations.variationImages'
            ]
        )->paginate(10);

        return  ProductResource::collection($products);
    }




    public function store(ProductRequest $request)
    {
        DB::beginTransaction();

        try {

            $slug = $this->generateSeoFriendlySlug($request->name);
            $product = Product::create([
                'name' => $request->name,
                'slug' => $slug,
                'price' => $request->price,
                'description' => $request->description,
                'content' => $request->content,
                'input_day' => $request->input_day,
                'category_id' => $request->category_id,
                'is_collection' => $request->has('is_collection') ? 1 : 0, // Kiểm tra checkbox
                'is_hot' => $request->has('is_hot') ? 1 : 0,               // Kiểm tra checkbox
                'is_new' => $request->has('is_new') ? 1 : 0,               // Kiểm tra checkbox
            ]);
            

            // Kiểm tra xem có biến thể không nhé ae
            $hasVariations = $request->has('variations') && !empty($request->variations);

            // Giải mã JSON của biến thể thành mảng
            $variations = json_decode($request->input('variations'), true);

            // Nếu không có biến thể, lưu thông tin số lượng và ảnh cho sản phẩm
            if (!$hasVariations || !is_array($variations)) {
                // Cập nhật tồn kho
                $product->update(['stock' => $request->stock]);

                // Lưu ảnh sản phẩm
                $this->saveImages($product, $request);
            }

            // Nếu có biến thể, kiểm tra và lưu ảnh và thông tin biến thể
            if ($hasVariations && is_array($variations)) {
                $totalProductStock = 0; // Tổng số lượng tồn kho cho sản phẩm

                foreach ($variations as $attributeValueId => $sizes) {
                    // Kiểm tra tính hợp lệ của thuộc tính với nhóm trước khi tạo biến thể
                    if (!$this->isValidAttributeForGroup($request->group_id, $attributeValueId)) {
                        throw new \Exception("Thuộc tính không hợp lệ cho nhóm đã chọn.");
                    }

                    // Tạo biến thể chính (ví dụ như màu sắc)
                    $productVariation = ProductVariation::create([
                        'product_id' => $product->id,
                        'group_id' => $request->group_id,
                        'attribute_value_id' => $attributeValueId,
                    ]);

                    // Lưu ảnh cho biến thể
                    $this->saveImages($productVariation, $request, true, $attributeValueId);

                    // Tính toán tổng tồn kho cho từng biến thể
                    $totalVariationStock = 0;

                    // Lưu các size (kích thước) của từng biến thể
                    foreach ($sizes as $sizeId => $details) {
                        if (!empty($details['stock']) && isset($details['discount'])) {
                            $sku = $this->generateVariationSku();
                            $calculatedPrice = $product->price - ($product->price * ($details['discount'] / 100));

                            ProductVariationValue::create([
                                'product_variation_id' => $productVariation->id,
                                'attribute_value_id' => $sizeId,
                                'sku' => $sku,
                                'stock' => $details['stock'],
                                'price' => $calculatedPrice,
                                'discount' => $details['discount'] ?? null,
                            ]);

                            // Cộng dồn số lượng stock của các biến thể size
                            $totalVariationStock += $details['stock'];
                        }
                    }

                    // Cập nhật tổng số lượng stock của biến thể vào bảng product_variations
                    $productVariation->update(['stock' => $totalVariationStock]);

                    // Cộng dồn số lượng stock của biến thể vào tổng stock sản phẩm
                    $totalProductStock += $totalVariationStock;
                }

                // Cập nhật tổng số lượng stock của sản phẩm vào bảng products
                $product->update(['stock' => $totalProductStock]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product: ' . $e->getMessage(),
            ], 500);
        }
    }



    private function isValidAttributeForGroup($groupId, $attributeValueId)
    {
        // Kiểm tra xem giá trị thuộc tính (attribute_value_id) có thuộc về thuộc tính (attribute_id) trong nhóm (group_id) không
        $attributeGroup = DB::table('attribute_groups')
            ->join('attributes', 'attribute_groups.attribute_id', '=', 'attributes.id')
            ->join('attribute_values', 'attributes.id', '=', 'attribute_values.attribute_id')
            ->where('attribute_groups.group_id', $groupId)  // Kiểm tra thuộc nhóm nào
            ->where('attribute_values.id', $attributeValueId)  // Kiểm tra giá trị thuộc tính có tồn tại không
            ->first();

        // Nếu không tìm thấy bản ghi nào, thuộc tính không hợp lệ
        return $attributeGroup ? true : false;
    }





    private function saveImages($model, $request, $isVariation = false, $attributeValueId = null)
    {
        if ($isVariation) {
            $modelType = 'product_variation_id';

            // Kiểm tra và lưu ảnh đại diện (thumbnail) cho biến thể
            if ($attributeValueId) {
                $thumbnailInput = "thumbnail_image_$attributeValueId";
            }

            if ($request->hasFile($thumbnailInput)) {
                // Kiểm tra xem xem có ảnh thumbnail đã có trong biến thể chưa nhé ae
                $existingThumbnail = ProductVariationImage::where($modelType, $model->id)
                    ->where('image_type', 'thumbnail')
                    ->first();

                if ($existingThumbnail) {
                    throw new \Exception('thuộc tính này chỉ cần 1 ảnh đại diện. Không thể thêm thêm ảnh ảnh đại diện.');
                }

                // Lưu ảnh mới nếu chưa có
                $thumbnailPath = $request->file($thumbnailInput)->store("uploads/avata/{$model->product_id}/{$model->id}", 'public');

                ProductVariationImage::create([
                    $modelType => $model->id,
                    'image_path' => $thumbnailPath,
                    'image_type' => 'thumbnail',
                ]);
            }

            // Kiểm tra và lưu ảnh variant (màu sắc)
            if ($request->hasFile("color_image_$attributeValueId")) {
                // Kiểm tra xem biến thể đã có variant chưa
                $existingVariant = ProductVariationImage::where($modelType, $model->id)
                    ->where('image_type', 'variant')
                    ->first();

                if ($existingVariant) {
                    // Báo lỗi nếu đã tồn tại variant
                    throw new \Exception('Biến thể này đã có ảnh variant. Không thể thêm thêm ảnh variant.');
                }

                // Lưu ảnh mới nếu chưa có
                $colorImagePath = $request->file("color_image_$attributeValueId")
                    ->store("uploads/color_images/{$model->product_id}/{$model->id}", 'public');

                ProductVariationImage::create([
                    $modelType => $model->id,
                    'image_path' => $colorImagePath,
                    'image_type' => 'variant',
                ]);
            }

            // Lưu album hình ảnh cho biến thể (không giới hạn số lượng)
            if ($attributeValueId) {
                $albumInput = "album_images_$attributeValueId";
            }

            if ($request->hasFile($albumInput)) {
                foreach ($request->file($albumInput) as $albumImage) {
                    $albumPath = $albumImage->store("uploads/album/{$model->product_id}/{$model->id}", 'public');
                    ProductVariationImage::create([
                        $modelType => $model->id,
                        'image_path' => $albumPath,
                        'image_type' => 'album',
                    ]);
                }
            }
        } else {
            // Lưu ảnh cho sản phẩm vào bảng product_images
            $modelType = 'product_id';

            // Kiểm tra và lưu ảnh đại diện (thumbnail) cho sản phẩm
            $thumbnailInput = 'thumbnail_image';
            if ($request->hasFile($thumbnailInput)) {
                // Kiểm tra xem sản phẩm đã có thumbnail chưa
                $existingThumbnail = ProductImage::where($modelType, $model->id)
                    ->where('image_type', 'thumbnail')
                    ->first();

                if ($existingThumbnail) {
                    // Báo lỗi nếu đã tồn tại thumbnail
                    throw new \Exception('Sản phẩm này đã có ảnh thumbnail. Không thể thêm thêm ảnh thumbnail.');
                }

                // Lưu ảnh mới
                $thumbnailPath = $request->file($thumbnailInput)->store('uploads/products/thumbnails', 'public');

                ProductImage::create([
                    $modelType => $model->id,
                    'image_path' => $thumbnailPath,
                    'image_type' => 'thumbnail',
                ]);
            }

            // Lưu album hình ảnh cho sản phẩm (không giới hạn số lượng)
            $albumInput = 'album_images';
            if ($request->hasFile($albumInput)) {
                foreach ($request->file($albumInput) as $albumImage) {
                    $albumPath = $albumImage->store('uploads/products/albums', 'public');
                    ProductImage::create([
                        $modelType => $model->id,
                        'image_path' => $albumPath,
                        'image_type' => 'album',
                    ]);
                }
            }
        }
    }




    public function show(string $id)
    {
        $product = Product::with([
            'variations.attributeValue',
            'variations.group',
            'variations.variationValues',
            'variations.variationImages',
            'images'
        ])->findOrFail($id);

        return new ProductResource($product); // Trả về dữ liệu theo cấu trúc Resource
    }


    /**
     * Update the specified resource in storage.
     */
    // public function update(ProductRequest $request, $id)
    // {
    //     DB::beginTransaction();

    //     try {
    //         $product = Product::findOrFail($id);

    //         // Tạo slug từ tên sản phẩm mới (nếu tên thay đổi)
    //         $slug = $this->generateSeoFriendlySlug($request->name);

    //         $product->update([
    //             'name' => $request->name,
    //             'slug' => $slug,
    //             'price' => $request->price,
    //             'description' => $request->description,  // Mô tả sản phẩm
    //             'content' => $request->content,          // Nội dung sản phẩm
    //             'input_day' => $request->input_day,      // Ngày nhập
    //             'category_id' => $request->category_id,  // Danh mục sản phẩm
    //             'is_collection' => $request->has('is_collection') ? 1 : 0,  // Kiểm tra checkbox
    //             'is_hot' => $request->has('is_hot') ? 1 : 0,                // Kiểm tra checkbox
    //             'is_new' => $request->has('is_new') ? 1 : 0,                // Kiểm tra checkbox
    //         ]);
            

    //         // Kiểm tra xem có biến thể không
    //         $hasVariations = $request->has('variations') && !empty($request->variations);

    //         // Giải mã JSON của biến thể thành mảng
    //         $variations = json_decode($request->input('variations'), true);

    //         // Xử lý xóa ảnh cũ nếu có
    //         if ($request->has('delete_images')) {
    //             $this->deleteSelectedImages($request->input('delete_images'), false); // false vì đây là sản phẩm
    //         }

    //         // Nếu không có biến thể, chỉ cần cập nhật số lượng và hình ảnh
    //         if (!$hasVariations || !is_array($variations)) {
    //             $product->update(['stock' => $request->stock]);
    //             $this->saveImages($product, $request);
    //         }

    //         // Nếu có biến thể, xử lý cập nhật biến thể
    //         if ($hasVariations && is_array($variations)) {
    //             $totalProductStock = 0;

    //             // Lấy danh sách tất cả attribute_value_id từ các biến thể
    //             $attributeValueIds = array_keys($variations);

    //             // Kiểm tra tính hợp lệ của tất cả các attribute_value_id với group_id
    //             if (!$this->isValidAttributeForGroup_Update($request->group_id, $attributeValueIds)) {
    //                 throw new \Exception("Có giá trị thuộc tính không hợp lệ trong nhóm đã chọn.");
    //             }

    //             foreach ($variations as $attributeValueId => $sizes) {
    //                 // Kiểm tra xem biến thể đã tồn tại chưa
    //                 $productVariation = ProductVariation::where('product_id', $product->id)
    //                     ->where('attribute_value_id', $attributeValueId)
    //                     ->first();

    //                 if (!$productVariation) {
    //                     $productVariation = ProductVariation::create([
    //                         'product_id' => $product->id,
    //                         'group_id' => $request->group_id,
    //                         'attribute_value_id' => $attributeValueId,
    //                     ]);
    //                 } else {
    //                     $productVariation->update([
    //                         'group_id' => $request->group_id,
    //                     ]);
    //                 }

    //                 // Xóa ảnh cũ của biến thể nếu có
    //                 if ($request->has('delete_images')) {
    //                     $this->deleteSelectedImages($request->input('delete_images'), true); // true vì đây là biến thể
    //                 }

    //                 // Thêm ảnh mới cho biến thể
    //                 $this->saveImages($productVariation, $request, true, $attributeValueId);

    //                 // Xử lý cập nhật các size (kích thước) của biến thể
    //                 $totalVariationStock = 0;
    //                 foreach ($sizes as $sizeId => $details) {
    //                     // Kiểm tra tính hợp lệ của từng giá trị thuộc tính size trước khi cập nhật
    //                     if (!$this->isValidAttributeForGroup_Update($request->group_id, [$sizeId])) {
    //                         throw new \Exception("Giá trị thuộc tính kích thước không hợp lệ trong nhóm đã chọn.");
    //                     }

    //                     if (!empty($details['stock']) && isset($details['discount'])) {
    //                         $sku = $this->generateVariationSku();
    //                         $calculatedPrice = $product->price - ($product->price * ($details['discount'] / 100));

    //                         // Tìm hoặc tạo mới biến thể kích thước
    //                         $productVariationValue = ProductVariationValue::where('product_variation_id', $productVariation->id)
    //                             ->where('attribute_value_id', $sizeId)
    //                             ->first();

    //                         if ($productVariationValue) {
    //                             // Cập nhật giá trị biến thể hiện có
    //                             $productVariationValue->update([
    //                                 'sku' => $sku,
    //                                 'stock' => $details['stock'],
    //                                 'price' => $calculatedPrice,
    //                                 'discount' => $details['discount'] ?? null,
    //                             ]);
    //                         } else {
    //                             // Tạo mới giá trị biến thể
    //                             ProductVariationValue::create([
    //                                 'product_variation_id' => $productVariation->id,
    //                                 'attribute_value_id' => $sizeId,
    //                                 'sku' => $sku,
    //                                 'stock' => $details['stock'],
    //                                 'price' => $calculatedPrice,
    //                                 'discount' => $details['discount'] ?? null,
    //                             ]);
    //                         }

    //                         $totalVariationStock += $details['stock'];
    //                     }
    //                 }

    //                 // Cập nhật tổng tồn kho của biến thể
    //                 $productVariation->update(['stock' => $totalVariationStock]);

    //                 // Cộng dồn tồn kho của biến thể vào tổng tồn kho của sản phẩm
    //                 $totalProductStock += $totalVariationStock;
    //             }

    //             // Cập nhật tổng tồn kho của sản phẩm
    //             $product->update(['stock' => $totalProductStock]);
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Product updated successfully',
    //             'data' => $product
    //         ], 200);
    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to update product: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }


    public function update(UpdateProductRequest $request, $id)
{
    DB::beginTransaction();

    try {
        $product = Product::findOrFail($id);

        // Không tạo lại slug, chỉ cập nhật slug nếu có trong request
        $product->update([
            'name' => $request->name,
            'slug' => $request->slug ?? $product->slug,  // Giữ nguyên slug nếu không có slug mới trong request
            'price' => $request->price,
            'description' => $request->description,  // Mô tả sản phẩm
            'content' => $request->content,          // Nội dung sản phẩm
            'input_day' => $request->input_day,      // Ngày nhập
            'category_id' => $request->category_id,  // Danh mục sản phẩm
            'is_collection' => $request->has('is_collection') ? 1 : 0,  // Kiểm tra checkbox
            'is_hot' => $request->has('is_hot') ? 1 : 0,                // Kiểm tra checkbox
            'is_new' => $request->has('is_new') ? 1 : 0,                // Kiểm tra checkbox
        ]);

        // Kiểm tra xem có biến thể không
        $hasVariations = $request->has('variations') && !empty($request->variations);

        // Giải mã JSON của biến thể thành mảng
        $variations = json_decode($request->input('variations'), true);

        // Xử lý xóa ảnh cũ nếu có
        if ($request->has('delete_images')) {
            $this->deleteSelectedImages($request->input('delete_images'), false); // false vì đây là sản phẩm
        }

        // Nếu không có biến thể, chỉ cần cập nhật số lượng và hình ảnh
        if (!$hasVariations || !is_array($variations)) {
            $product->update(['stock' => $request->stock]);
            $this->saveImages($product, $request);
        }

        // Nếu có biến thể, xử lý cập nhật biến thể
        if ($hasVariations && is_array($variations)) {
            $totalProductStock = 0;

            // Lấy danh sách tất cả attribute_value_id từ các biến thể
            $attributeValueIds = array_keys($variations);

            // Kiểm tra tính hợp lệ của tất cả các attribute_value_id với group_id
            if (!$this->isValidAttributeForGroup_Update($request->group_id, $attributeValueIds)) {
                throw new \Exception("Có giá trị thuộc tính không hợp lệ trong nhóm đã chọn.");
            }

            foreach ($variations as $attributeValueId => $sizes) {
                // Kiểm tra xem biến thể đã tồn tại chưa
                $productVariation = ProductVariation::where('product_id', $product->id)
                    ->where('attribute_value_id', $attributeValueId)
                    ->first();

                if (!$productVariation) {
                    $productVariation = ProductVariation::create([
                        'product_id' => $product->id,
                        'group_id' => $request->group_id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                } else {
                    $productVariation->update([
                        'group_id' => $request->group_id,
                    ]);
                }

                // Xóa ảnh cũ của biến thể nếu có
                if ($request->has('delete_images')) {
                    $this->deleteSelectedImages($request->input('delete_images'), true); // true vì đây là biến thể
                }

                // Thêm ảnh mới cho biến thể
                $this->saveImages($productVariation, $request, true, $attributeValueId);

                // Xử lý cập nhật các size (kích thước) của biến thể
                $totalVariationStock = 0;
                foreach ($sizes as $sizeId => $details) {
                    // Kiểm tra tính hợp lệ của từng giá trị thuộc tính size trước khi cập nhật
                    if (!$this->isValidAttributeForGroup_Update($request->group_id, [$sizeId])) {
                        throw new \Exception("Giá trị thuộc tính kích thước không hợp lệ trong nhóm đã chọn.");
                    }

                    if (!empty($details['stock']) && isset($details['discount'])) {
                        // Không tạo lại SKU, chỉ tạo mới nếu SKU không tồn tại
                        $productVariationValue = ProductVariationValue::where('product_variation_id', $productVariation->id)
                            ->where('attribute_value_id', $sizeId)
                            ->first();

                        if ($productVariationValue) {
                            // Cập nhật giá trị biến thể hiện có
                            $productVariationValue->update([
                                'stock' => $details['stock'],
                                'price' => $product->price - ($product->price * ($details['discount'] / 100)),
                                'discount' => $details['discount'] ?? null,
                            ]);
                        } else {
                            // Tạo mới giá trị biến thể
                            ProductVariationValue::create([
                                'product_variation_id' => $productVariation->id,
                                'attribute_value_id' => $sizeId,
                                'sku' => $this->generateVariationSku(),  // Tạo SKU mới nếu không tồn tại
                                'stock' => $details['stock'],
                                'price' => $product->price - ($product->price * ($details['discount'] / 100)),
                                'discount' => $details['discount'] ?? null,
                            ]);
                        }

                        $totalVariationStock += $details['stock'];
                    }
                }

                // Cập nhật tổng tồn kho của biến thể
                $productVariation->update(['stock' => $totalVariationStock]);

                // Cộng dồn tồn kho của biến thể vào tổng tồn kho của sản phẩm
                $totalProductStock += $totalVariationStock;
            }

            // Cập nhật tổng tồn kho của sản phẩm
            $product->update(['stock' => $totalProductStock]);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ], 200);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json([
            'success' => false,
            'message' => 'Failed to update product: ' . $e->getMessage(),
        ], 500);
    }
}

    private function isValidAttributeForGroup_Update($groupId, $attributeValueIds)
    {

        $validAttributes = DB::table('attribute_groups')
            ->where('group_id', $groupId)
            ->pluck('attribute_id')  // Lấy danh sách attribute_id thuộc group_id
            ->toArray();  // Chuyển sang mảng để dễ kiểm tra

        if (empty($validAttributes)) {
            // Nếu không có thuộc tính nào được tìm thấy cho group_id
            return false;
        }

        // Lấy tất cả các giá trị thuộc tính hợp lệ từ bảng attribute_values dựa trên attribute_id đã lấy từ attribute_groups
        $validAttributeValues = DB::table('attribute_values')
            ->whereIn('attribute_id', $validAttributes)
            ->pluck('id')  // Lấy danh sách attribute_value_id hợp lệ
            ->toArray();

        // Kiểm tra tất cả các attribute_value_id mà người dùng cung cấp xem có nằm trong danh sách hợp lệ không
        foreach ($attributeValueIds as $attributeValueId) {
            if (!in_array($attributeValueId, $validAttributeValues)) {
                // Nếu bất kỳ giá trị thuộc tính nào không hợp lệ
                return false;
            }
        }

        return true;
    }


    private function deleteSelectedImages($imageIds, $isVariation = false)
    {
        if ($isVariation) {
            // Xóa ảnh biến thể từ bảng product_variation_images
            $images = ProductVariationImage::whereIn('id', $imageIds)->get();

            foreach ($images as $image) {
                // Xóa file ảnh vật lý
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);

                    // Kiểm tra và xóa thư mục nếu rỗng sau khi xóa ảnh
                    $directoryPath = dirname($image->image_path); // Lấy đường dẫn thư mục chứa ảnh
                    $this->deleteDirectoryIfEmpty($directoryPath); // Xóa thư mục nếu rỗng
                }

                // Xóa khỏi cơ sở dữ liệu
                $image->delete();
            }
        } else {
            // Xóa ảnh sản phẩm từ bảng product_images
            $images = ProductImage::whereIn('id', $imageIds)->get();

            foreach ($images as $image) {
                // Xóa file ảnh vật lý
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);

                    // Kiểm tra và xóa thư mục nếu rỗng sau khi xóa ảnh
                    $directoryPath = dirname($image->image_path); // Lấy đường dẫn thư mục chứa ảnh
                    $this->deleteDirectoryIfEmpty($directoryPath); // Xóa thư mục nếu rỗng
                }

                // Xóa khỏi cơ sở dữ liệu
                $image->delete();
            }
        }
    }

    private function deleteDirectoryIfEmpty($directoryPath)
    {
        // Kiểm tra nếu thư mục không chứa file nào
        if (Storage::disk('public')->exists($directoryPath)) {
            $files = Storage::disk('public')->allFiles($directoryPath); // Lấy tất cả các file trong thư mục
            if (empty($files)) {
                // Xóa thư mục nếu rỗng
                Storage::disk('public')->deleteDirectory($directoryPath);
            }
        }
    }


 


    private function generateSeoFriendlySlug($productName)
    {
        $slug = Str::slug($productName);
        $randomString = Str::random(8);
        $slug = "{$slug}-{$randomString}";

        $originalSlug = $slug;
        $count = 2;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    private function generateVariationSku()
    {
        $randomNumbers = str_pad(mt_rand(1, 999999999999), 12, '0', STR_PAD_LEFT);
        $randomString = Str::upper(Str::random(8));
        $variationSku = "{$randomNumbers}_{$randomString}";

        $originalSku = $variationSku;
        $count = 2;

        // Kiểm tra trong bảng product_variation_sizes thay vì product_variations
        while (ProductVariationValue::where('sku', $variationSku)->exists()) {
            $variationSku = "{$originalSku}-{$count}";
            $count++;
        }

        return $variationSku;
    }


   

    public function destroy(string $id)
{
    DB::beginTransaction();

    try {
        $product = Product::withTrashed()->findOrFail($id);
        $variations = ProductVariation::where('product_id', $product->id)->get();


        foreach ($variations as $variation) {
            // Lấy danh sách hình ảnh của biến thể
            $variationImages = ProductVariationImage::where('product_variation_id', $variation->id)->get();

   
            foreach ($variationImages as $variationImage) {
                if (Storage::disk('public')->exists($variationImage->image_path)) {
                    Storage::disk('public')->delete($variationImage->image_path);
                }

                $directoryPath = dirname($variationImage->image_path);
                $this->deleteDirectoryIfEmpty($directoryPath);

                $variationImage->delete();
            }

            // Xóa tất cả các giá trị biến thể
            ProductVariationValue::where('product_variation_id', $variation->id)->delete();

            // Xóa biến thể
            $variation->forceDelete();  // Xóa vĩnh viễn biến thể
        }

        $productImages = ProductImage::where('product_id', $product->id)->get();
        foreach ($productImages as $productImage) {
            if (Storage::disk('public')->exists($productImage->image_path)) {
                Storage::disk('public')->delete($productImage->image_path);
            }

            $directoryPath = dirname($productImage->image_path);
            $this->deleteDirectoryIfEmpty($directoryPath);
            $productImage->delete();
        }
        $product->forceDelete();  

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công'
        ], 200);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete product: ' . $e->getMessage(),
        ], 500);
    }
}

}
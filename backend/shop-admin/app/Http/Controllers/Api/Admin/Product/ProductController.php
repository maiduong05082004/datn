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
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Cloudinary\Api\Upload\UploadApi;

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

        return ProductResource::collection($products);
    }






    public function store(ProductRequest $request)
    {
        DB::beginTransaction();

        try {
            // Tạo slug cho sản phẩm
            $slug = $this->generateSeoFriendlySlug($request->name);
            $product = Product::create([
                'name' => $request->name,
                'slug' => $slug,
                'price' => $request->price,
                'description' => $request->description,
                'content' => $request->content,
                'input_day' => $request->input_day,
                'category_id' => $request->category_id,
                'is_collection' => $request->is_collection ? 1 : 0,
                'is_hot' => $request->is_hot ? 1 : 0,
                'is_new' => $request->is_new ? 1 : 0,
            ]);


            $hasVariations = $request->has('variations') && !empty($request->variations);
            $variations = json_decode($request->input('variations'), true);
            if (!$hasVariations || !is_array($variations)) {
                // Cập nhật tồn kho
                $product->update(['stock' => $request->stock]);

                // Lưu ảnh sản phẩm
                $this->saveImages($product, $request);
            }


            if ($hasVariations && is_array($variations)) {
                $totalProductStock = 0;

                foreach ($variations as $attributeValueId => $sizes) {

                    if (!$this->isValidAttributeForGroup($request->group_id, $attributeValueId)) {
                        throw new \Exception("Thuộc tính không hợp lệ cho nhóm đã chọn.");
                    }


                    $productVariation = ProductVariation::create([
                        'product_id' => $product->id,
                        'group_id' => $request->group_id,
                        'attribute_value_id' => $attributeValueId,
                    ]);


                    $this->saveImages($productVariation, $request, true, $attributeValueId);


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

                            $totalVariationStock += $details['stock'];
                        }
                    }
                    $productVariation->update(['stock' => $totalVariationStock]);
                    $totalProductStock += $totalVariationStock;
                }
                $product->update(['stock' => $totalProductStock]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => new ProductResource($product),
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product: ' . $e->getMessage(),
            ], 500);
        }
    }




    private function saveImages($model, $request, $isVariation = false, $attributeValueId = null)
    {
        if ($isVariation) {
            $modelType = 'product_variation_id';

            // Xử lý ảnh variant (màu sắc)
            $colorImageInput = "color_image_$attributeValueId";
            if ($request->hasFile($colorImageInput)) {
                // Upload lên Cloudinary
                $imageFile = $request->file($colorImageInput);
                $cloudinaryResponse = Cloudinary::upload($imageFile->getRealPath(), [
                    'folder' => "products/{$model->product_id}/variations/{$model->id}",
                    'public_id' => 'variant_image_' . $attributeValueId
                ]);
                $colorImagePath = $cloudinaryResponse->getSecurePath();
            } elseif (isset($request[$colorImageInput])) {
                $colorImagePath = $request[$colorImageInput];
            }

            if (isset($colorImagePath)) {
                $existingVariant = ProductVariationImage::where($modelType, $model->id)
                    ->where('image_type', 'variant')
                    ->first();

                if ($existingVariant) {
                    throw new \Exception('Biến thể này đã có ảnh variant. Không thể thêm thêm ảnh variant.');
                }

                ProductVariationImage::create([
                    $modelType => $model->id,
                    'image_path' => $colorImagePath,
                    'image_type' => 'variant',
                ]);
            }

            // Lưu album hình ảnh cho biến thể
            $albumInput = "album_images_$attributeValueId";
            if ($request->hasFile($albumInput)) {
                foreach ($request->file($albumInput) as $albumImage) {
                    // Upload từng ảnh lên Cloudinary
                    $cloudinaryResponse = Cloudinary::upload($albumImage->getRealPath(), [
                        'folder' => "products/{$model->product_id}/variations/{$model->id}",
                        'public_id' => 'album_image_' . uniqid()
                    ]);
                    $albumPath = $cloudinaryResponse->getSecurePath();

                    ProductVariationImage::create([
                        $modelType => $model->id,
                        'image_path' => $albumPath,
                        'image_type' => 'album',
                    ]);
                }
            } elseif (isset($request[$albumInput]) && is_array($request[$albumInput])) {
                foreach ($request[$albumInput] as $albumImage) {
                    ProductVariationImage::create([
                        $modelType => $model->id,
                        'image_path' => $albumImage,
                        'image_type' => 'album',
                    ]);
                }
            }
        } else {
            $modelType = 'product_id';

            // Lưu album hình ảnh cho sản phẩm
            $albumInput = 'album_images';
            if ($request->hasFile($albumInput)) {
                foreach ($request->file($albumInput) as $albumImage) {
                    // Upload từng ảnh lên Cloudinary
                    $cloudinaryResponse = Cloudinary::upload($albumImage->getRealPath(), [
                        'folder' => "products/{$model->id}/albums",
                        'public_id' => 'album_image_' . uniqid()
                    ]);
                    $albumPath = $cloudinaryResponse->getSecurePath();

                    ProductImage::create([
                        $modelType => $model->id,
                        'image_path' => $albumPath,
                        'image_type' => 'album',
                    ]);
                }
            } elseif (isset($request[$albumInput]) && is_array($request[$albumInput])) {
                foreach ($request[$albumInput] as $albumImage) {
                    ProductImage::create([
                        $modelType => $model->id,
                        'image_path' => $albumImage,
                        'image_type' => 'album',
                    ]);
                }
            }
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





    public function update(UpdateProductRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);

            $product->update([
                'name' => $request->name,
                'slug' => $request->slug ?? $product->slug,
                'price' => $request->price,
                'description' => $request->description,
                'content' => $request->content,
                'input_day' => $request->input_day,
                'category_id' => $request->category_id,
                'is_collection' => $request->is_collection ? 1 : 0,
                'is_hot' => $request->is_hot ? 1 : 0,
                'is_new' => $request->is_new ? 1 : 0,
            ]);

            // Xử lý xóa ảnh nếu có yêu cầu
            if ($request->has('delete_images')) {
                $this->deleteSelectedImages($request->input('delete_images'), false); // false vì đây là ảnh sản phẩm
            }

            // Cập nhật hình ảnh sản phẩm
            $this->saveImagesUpdate($product, $request); // Gọi hàm cập nhật hình ảnh

            // Giải mã JSON phần `variations` để chuyển từ chuỗi JSON thành mảng
            $variations = json_decode($request->input('variations'), true);

            // Xử lý cập nhật các biến thể
            if (is_array($variations)) {
                $totalProductStock = 0;

                foreach ($variations as $attributeValueId => $sizes) {
                    // Tạo hoặc cập nhật biến thể
                    $productVariation = ProductVariation::updateOrCreate(
                        ['product_id' => $product->id, 'attribute_value_id' => $attributeValueId],
                        ['group_id' => $request->group_id]
                    );

                    // Xử lý xóa ảnh của biến thể nếu có yêu cầu
                    if ($request->has('delete_images_variation')) {
                        $this->deleteSelectedImages($request->input('delete_images_variation'), true); // true vì đây là biến thể
                    }

                    // Cập nhật hình ảnh biến thể
                    $this->saveImagesUpdate($productVariation, $request, true, $attributeValueId);

                    // Cập nhật size và tồn kho
                    $totalVariationStock = 0;
                    foreach ($sizes as $sizeId => $details) {
                        if (!empty($details['stock']) && isset($details['discount'])) {
                            ProductVariationValue::updateOrCreate(
                                ['product_variation_id' => $productVariation->id, 'attribute_value_id' => $sizeId],
                                [
                                    'sku' => $this->generateVariationSku(),
                                    'stock' => $details['stock'],
                                    'price' => $product->price - ($product->price * ($details['discount'] / 100)),
                                    'discount' => $details['discount'] ?? null
                                ]
                            );

                            $totalVariationStock += $details['stock'];
                        }
                    }

                    $productVariation->update(['stock' => $totalVariationStock]);
                    $totalProductStock += $totalVariationStock;
                }

                // Cập nhật tổng tồn kho sản phẩm
                $product->update(['stock' => $totalProductStock]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => new ProductResource($product),
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product: ' . $e->getMessage(),
            ], 500);
        }
    }






    private function saveImagesUpdate($model, $request, $isVariation = false, $attributeValueId = null)
    {
        $modelType = $isVariation ? 'product_variation_id' : 'product_id';
        $albumInput = $isVariation ? "album_images_$attributeValueId" : 'album_images';
        $colorImageInput = $isVariation ? "color_image_$attributeValueId" : null;

        // Xử lý ảnh màu cho biến thể
        if ($isVariation && $colorImageInput && $request->hasFile($colorImageInput)) {
            $this->processFileImage($model, $request->file($colorImageInput), 'variant', $modelType, $isVariation);
        }

        // Xử lý album ảnh
        if ($request->hasFile($albumInput)) {
            foreach ($request->file($albumInput) as $file) {
                $this->processFileImage($model, $file, 'album', $modelType, $isVariation);
            }
        } elseif ($request->has($albumInput) && is_array($request->input($albumInput))) {
            foreach ($request->input($albumInput) as $url) {
                $this->processSingleImage($model, $albumInput, $url, 'album', $modelType);
            }
        }
    }

    // Hàm xử lý ảnh từ file và upload lên Cloudinary
    private function processFileImage($model, $file, $type, $modelType, $isVariation)
    {
        try {
            Log::info("Uploading new $type image for {$modelType} ID {$model->id}");

            $folder = $isVariation ? "products/{$model->product_id}/variations/{$model->id}" : "products/{$model->id}/albums";
            $cloudinaryResponse = Cloudinary::upload($file->getRealPath(), [
                'folder' => $folder,
                'public_id' => "{$type}_image_" . uniqid()
            ]);
            $imagePath = $cloudinaryResponse->getSecurePath();

            $this->saveImageRecord($model, $imagePath, $type, $modelType);
        } catch (\Exception $e) {
            Log::error("Failed to upload $type image for {$modelType} ID {$model->id}: " . $e->getMessage());
        }
    }

    // Hàm xử lý ảnh từ URL hoặc đường dẫn cục bộ
    private function processSingleImage($model, $inputName, $imagePath, $type, $modelType)
    {
        try {
            Log::info("Processing $type image for {$modelType} ID {$model->id} with path: $imagePath");

            if (!empty($imagePath)) {
                $this->saveImageRecord($model, $imagePath, $type, $modelType);
            } else {
                Log::warning("No valid $type image provided for {$modelType} ID {$model->id}.");
            }
        } catch (\Exception $e) {
            Log::error("Failed to process $type image for {$modelType} ID {$model->id}: " . $e->getMessage());
        }
    }

    private function saveImageRecord($model, $imagePath, $type, $modelType)
    {
        // Kiểm tra xem ảnh đã tồn tại trong cơ sở dữ liệu chưa dựa trên `modelType`, `model->id` và `image_path`
        $existingImage = ProductVariationImage::where($modelType, $model->id)
            ->where('image_type', $type)
            ->where('image_path', $imagePath)
            ->exists();

        if (!$existingImage) {
            ProductVariationImage::create([
                $modelType => $model->id,
                'image_path' => $imagePath,
                'image_type' => $type,
            ]);
            Log::info("Saved $type image for {$modelType} ID {$model->id}.");
        } else {
            Log::info("Skipped saving duplicate $type image for {$modelType} ID {$model->id}.");
        }
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
                $variationImages = ProductVariationImage::where('product_variation_id', $variation->id)->get();


                foreach ($variationImages as $variationImage) {
                    if (Storage::disk('public')->exists($variationImage->image_path)) {
                        Storage::disk('public')->delete($variationImage->image_path);
                    }

                    $directoryPath = dirname($variationImage->image_path);
                    $this->deleteDirectoryIfEmpty($directoryPath);

                    $variationImage->delete();
                }
                ProductVariationValue::where('product_variation_id', $variation->id)->delete();
                $variation->forceDelete();
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






    // public function deleteImageByPath($type, $encodedPath)
    // {
    //     DB::beginTransaction();

    //     try {
    //         // Giải mã đường dẫn ảnh từ base64
    //         $imagePath = base64_decode($encodedPath);
    //         Log::info("Đang xóa ảnh với đường dẫn: " . $imagePath);

    //         // Loại bỏ phần tên miền và phần mở rộng
    //         $publicId = preg_replace('/^.+\/upload\/(v[0-9]+\/)?/', '', $imagePath);
    //         $publicId = pathinfo($publicId, PATHINFO_DIRNAME) . '/' . pathinfo($publicId, PATHINFO_FILENAME);

    //         // Xóa ảnh trên Cloudinary bằng UploadApi
    //         $response = (new UploadApi())->destroy($publicId);
    //         Log::info("Kết quả xóa ảnh trên Cloudinary: " . json_encode($response));

    //         if ($response['result'] !== 'ok') {
    //             throw new \Exception("Không thể xóa ảnh trên Cloudinary với public_id: " . $publicId);
    //         }

    //         // Xóa bản ghi trong database nếu xóa trên Cloudinary thành công
    //         if ($type === 'product') {
    //             $productImage = ProductImage::where('image_path', $imagePath)->first();

    //             if (!$productImage) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'Ảnh sản phẩm không tồn tại.'
    //                 ], 404);
    //             }

    //             $productImage->delete();
    //         } elseif ($type === 'variation') {
    //             $variationImage = ProductVariationImage::where('image_path', $imagePath)->first();

    //             if (!$variationImage) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'Ảnh biến thể không tồn tại.'
    //                 ], 404);
    //             }

    //             $variationImage->delete();
    //         } else {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Loại ảnh không hợp lệ.'
    //             ], 400);
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Xóa ảnh thành công.'
    //         ], 200);

    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         Log::error("Lỗi khi xóa ảnh: " . $e->getMessage());
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Lỗi khi xóa ảnh: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }





    public function deleteImageByPath($type, $encodedPath)
    {
        DB::beginTransaction();

        try {
            // Giải mã đường dẫn ảnh từ base64
            $imagePath = base64_decode($encodedPath);
            Log::info("Đang xóa ảnh với đường dẫn: " . $imagePath);

            // Khởi tạo publicId là null
            $publicId = null;

            // Xác định publicId dựa trên loại ảnh
            if ($type === 'product') {
                // Lấy public_id cho ảnh sản phẩm không biến thể (album_image)
                // Loại bỏ phần tên miền, phiên bản và phần mở rộng
                $publicId = preg_replace('/^.+\/upload\/v[0-9]+\/(.+)\.[a-z]+$/', '$1', $imagePath);
                Log::info("Loại ảnh: product, Public ID: " . $publicId);
            } elseif ($type === 'variation') {
                // Lấy public_id cho ảnh sản phẩm có biến thể (variant_image)
                // Loại bỏ phần tên miền, phiên bản và phần mở rộng
                $publicId = preg_replace('/^.+\/upload\/v[0-9]+\/(.+)\.[a-z]+$/', '$1', $imagePath);
                Log::info("Loại ảnh: variation, Public ID: " . $publicId);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Loại ảnh không hợp lệ.'
                ], 400);
            }

            // Kiểm tra lại publicId xem có hợp lệ không trước khi gọi xóa
            if (!$publicId) {
                throw new \Exception("Không thể lấy public_id từ đường dẫn ảnh.");
            }

            // Xóa ảnh trên Cloudinary bằng UploadApi
            $response = (new UploadApi())->destroy($publicId);
            Log::info("Kết quả xóa ảnh trên Cloudinary: " . json_encode($response));

            if ($response['result'] !== 'ok') {
                throw new \Exception("Không thể xóa ảnh trên Cloudinary với public_id: " . $publicId);
            }

            // Xóa bản ghi trong database nếu xóa trên Cloudinary thành công
            if ($type === 'product') {
                $productImage = ProductImage::where('image_path', $imagePath)->first();

                if (!$productImage) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ảnh sản phẩm không tồn tại.'
                    ], 404);
                }

                Log::info("Xóa ảnh sản phẩm từ database.");
                $productImage->delete();
            } elseif ($type === 'variation') {
                $variationImage = ProductVariationImage::where('image_path', $imagePath)->first();

                if (!$variationImage) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ảnh biến thể không tồn tại.'
                    ], 404);
                }

                Log::info("Xóa ảnh biến thể từ database.");
                $variationImage->delete();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Xóa ảnh thành công.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("Lỗi khi xóa ảnh: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa ảnh: ' . $e->getMessage()
            ], 500);
        }
    }
}

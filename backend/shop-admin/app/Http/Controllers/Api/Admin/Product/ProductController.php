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
                'is_collection' => $request->has('is_collection') ? 1 : 0, 
                'is_hot' => $request->has('is_hot') ? 1 : 0,               
                'is_new' => $request->has('is_new') ? 1 : 0,              
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
                $colorImagePath = $request->file($colorImageInput)->store("uploads/color_images/{$model->product_id}/{$model->id}", 'public');
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
                    $albumPath = $albumImage->store("uploads/album/{$model->product_id}/{$model->id}", 'public');
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
                    $albumPath = $albumImage->store('uploads/products/albums', 'public');
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
            'is_collection' => $request->has('is_collection') ? 1 : 0,  
            'is_hot' => $request->has('is_hot') ? 1 : 0,              
            'is_new' => $request->has('is_new') ? 1 : 0,               
        ]);

        
        if ($request->has('delete_images')) {
            $this->deleteSelectedImages($request->input('delete_images'), false); 
        }

        
        $hasVariations = $request->has('variations') && !empty($request->variations);
        $variations = json_decode($request->input('variations'), true);

        // Xử lý cập nhật sản phẩm nếu không có biến thể
        if (!$hasVariations || !is_array($variations)) {
            $product->update(['stock' => $request->stock]);
            $this->saveImages($product, $request); // Lưu ảnh sản phẩm
        }

        // Xử lý cập nhật sản phẩm và biến thể nếu có
        if ($hasVariations && is_array($variations)) {
            $totalProductStock = 0;

            // Lấy danh sách tất cả attribute_value_id từ các biến thể
            $attributeValueIds = array_keys($variations);

            // Kiểm tra tính hợp lệ của tất cả các attribute_value_id với group_id
            if (!$this->isValidAttributeForGroup_Update($request->group_id, $attributeValueIds)) {
                throw new \Exception("Có giá trị thuộc tính không hợp lệ trong nhóm đã chọn.");
            }

            // Lặp qua từng biến thể và cập nhật
            foreach ($variations as $attributeValueId => $sizes) {
                // Tìm hoặc tạo biến thể chính (ví dụ: màu sắc)
                $productVariation = ProductVariation::updateOrCreate(
                    ['product_id' => $product->id, 'attribute_value_id' => $attributeValueId],
                    ['group_id' => $request->group_id]
                );

                // Xử lý việc xóa ảnh cũ của biến thể (nếu có yêu cầu)
                if ($request->has('delete_images')) {
                    $this->deleteSelectedImages($request->input('delete_images'), true); // true vì đây là biến thể
                }

                // Lưu ảnh mới cho biến thể (nếu có)
                $this->saveImages($productVariation, $request, true, $attributeValueId);

                // Xử lý cập nhật các size (kích thước) của biến thể
                $totalVariationStock = 0;
                foreach ($sizes as $sizeId => $details) {
                    if (!empty($details['stock']) && isset($details['discount'])) {
                        // Tìm hoặc tạo giá trị biến thể (size)
                        $productVariationValue = ProductVariationValue::updateOrCreate(
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


    private function isValidAttributeForGroup_Update($groupId, $attributeValueIds)
    {

        $validAttributes = DB::table('attribute_groups')
            ->where('group_id', $groupId)
            ->pluck('attribute_id')  
            ->toArray();  

        if (empty($validAttributes)) {
            return false;
        }

      
        $validAttributeValues = DB::table('attribute_values')
            ->whereIn('attribute_id', $validAttributes)
            ->pluck('id')  
            ->toArray();

     
        foreach ($attributeValueIds as $attributeValueId) {
            if (!in_array($attributeValueId, $validAttributeValues)) {
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

}

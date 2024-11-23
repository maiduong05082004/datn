<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VariationResource extends JsonResource
{
    public function toArray($request)
    {
        // Lấy ảnh variant từ danh sách các ảnh của biến thể
        $variantImage = $this->variationImages->where('image_type', 'variant')->first();
        // Lấy danh sách ảnh album từ biến thể
        $albumImages = $this->variationImages->where('image_type', 'album')->pluck('image_path');

        return [
            'id' => $this->id,
            'stock' => $this->stock,
            'attribute_value_image_variant' => [
                'id' => $this->attributeValue->id,
                'value' => $this->attributeValue->value,
                'image_path' => $variantImage ? $variantImage->image_path : null,
            ],
            'variation_values' => VariationValueResource::collection($this->variationValues), // Dữ liệu về variation values
            'variation_album_images' => $albumImages, // Danh sách các ảnh album của biến thể
        ];
    }
}

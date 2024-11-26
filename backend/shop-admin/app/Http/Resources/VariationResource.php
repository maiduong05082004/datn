<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VariationResource extends JsonResource
{
    public function toArray($request)
    {
        // Lấy ảnh từ cột `image_path` của attribute_value
        $attributeImagePath = $this->attributeValue ? $this->attributeValue->image_path : null;

        // Lấy danh sách ảnh album từ biến thể
        $albumImages = $this->variationImages->where('image_type', 'album')->pluck('image_path');

        return [
            'id' => $this->id,
            'stock' => $this->stock,
            'attribute_value_image_variant' => [
                'id' => $this->attributeValue->id,
                'value' => $this->attributeValue->value,
                'image_path' => $attributeImagePath, // Lấy ảnh từ attribute_values
            ],
            'variation_values' => VariationValueResource::collection($this->variationValues), // Dữ liệu về variation values
            'variation_album_images' => $albumImages, // Danh sách các ảnh album của biến thể
        ];
    }
}

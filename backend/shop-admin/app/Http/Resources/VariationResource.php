<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VariationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'stock' => $this->stock,
            'attribute_value' => new AttributeValueResource($this->attributeValue), // Trả về giá trị của thuộc tính
            'variation_values' => VariationValueResource::collection($this->variationValues), // Dữ liệu về variation values
            'variation_images' => VariationImageResource::collection($this->variationImages), // Hình ảnh của biến thể
        ];
    }
}

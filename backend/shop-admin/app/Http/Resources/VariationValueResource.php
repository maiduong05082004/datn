<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VariationValueResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'attribute_value_id' => $this->attribute_value_id, // Trả về attribute_value_id
            'value' => $this->attributeValue->value, // Lấy 'value' từ mối quan hệ attributeValue
            'sku' => $this->sku,
            'stock' => $this->stock,
            'price' => $this->price,
            'discount' => $this->discount,
        ];
    }
}

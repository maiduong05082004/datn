<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttributeGroupResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'group_id' => $this->id,
            'group_name' => $this->name,
            'attributes' => $this->whenLoaded('attributeGroups', function () {
                return $this->attributeGroups->map(function ($attributeGroup) {
                    return [
                        'id' => $attributeGroup->attribute->id,
                        'name' => $attributeGroup->attribute->name,
                        'attribute_type' => $attributeGroup->attribute->attribute_type,
                    ];
                });
            }),
        ];
    }
}

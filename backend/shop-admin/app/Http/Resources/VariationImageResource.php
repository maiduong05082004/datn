<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VariationImageResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'image_path' => $this->image_path,
            'image_type' => $this->image_type,
        ];
    }
}

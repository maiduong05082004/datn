<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        // Lấy biến thể đầu tiên nếu có
        $firstVariation = $this->variations->first();

        // Lấy group từ biến thể đầu tiên, kiểm tra xem có biến thể không trước khi lấy group
        $group = $firstVariation ? $firstVariation->group : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->price,
            'stock' => $this->stock,
            'description' => $this->description,
            'content' => $this->content,
            'category_id' => $this->category_id,
            'category_name' => $this->category?$this->category->name:null,
            'is_collection' => $this->is_collection,
            'product_cost' => $this->cost,
            'is_hot' => $this->is_hot,
            'is_new' => $this->is_new,
            'group' => $group ? new GroupResource($group) : null,
            'variations' => $this->variations->isNotEmpty() ? VariationResource::collection($this->variations) : [],
            'images' => $this->images->where('image_type', 'album')->pluck('image_path'),
            
        ];
    }
}

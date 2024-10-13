<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')->with('childrenRecursive')->get();
        return response()->json($categories);
    }
    public function showCategoryProducts($id)
    {
        if (empty($id) || !is_numeric($id)) {
            return response()->json(['error' => 'Invalid category ID'], 400);
        }
        $category = Category::findOrFail($id);
        $categoryIds = $this->getAllChildrenIds($category);
        if (!empty($id) && is_numeric($id)) {
            $categoryIds[] = $id;
        }

        $products = Product::whereIn('category_id', $categoryIds)->paginate(20);

        $productIds = $products->pluck('id');

        $attributes = Attribute::whereHas('attributeValues.productVariations', function ($query) use ($productIds) {
            $query->whereIn('product_id', $productIds);
        })
            ->with('attributeValues')
            ->distinct()
            ->get();

        $attributeOptions = [];
        foreach ($attributes as $attribute) {
            $attributeName = $attribute->name;

            foreach ($attribute->attributeValues as $attributeValue) {
                if (!isset($attributeOptions[$attributeName])) {
                    $attributeOptions[$attributeName] = [];
                }
                if (!in_array($attributeValue->value, $attributeOptions[$attributeName])) {
                    $attributeOptions[$attributeName][] = $attributeValue->value;
                }
            }
        }

        return response()->json([
            'products' => ProductResource::collection($products),
            'attributes' => $attributeOptions,
        ]);
    }


    public function getFilterOptionsByCategory($categoryId, Request $request)
{
    if (empty($categoryId) || !is_numeric($categoryId)) {
        return response()->json(['error' => 'Invalid category ID'], 400);
    }

    $category = Category::findOrFail($categoryId);
    $categoryIds = $this->getAllChildrenIds($category);
    if (!empty($categoryId) && is_numeric($categoryId)) {
        $categoryIds[] = $categoryId;
    }

    $productsQuery = Product::whereIn('category_id', $categoryIds);

    if ($request->has('colors') || $request->has('sizes')) {
        $productsQuery->whereHas('variations.variationValues.attributeValue', function ($query) use ($request) {
            if ($request->has('colors')) {
                $colors = explode(',', $request->input('colors'));
                $query->whereIn('value', $colors)
                    ->whereHas('attribute', function ($q) {
                        $q->where('name', 'Màu Sắc');
                    });
            }

            if ($request->has('sizes')) {
                $sizes = explode(',', $request->input('sizes'));
                $query->whereIn('value', $sizes)
                    ->whereHas('attribute', function ($q) {
                        $q->where('name', 'Kích Thước'); 
                    });
            }
        });
    }
    if ($request->has('price')) {
        $price = $request->input('price');
        
        switch ($price) {
            case 'under_1m':
                $productsQuery->where('price', '<', 1000000);
                break;
            case '1m_to_2m':
                $productsQuery->whereBetween('price', [1000000, 2000000]);
                break;
            case '2m_to_3m':
                $productsQuery->whereBetween('price', [2000000, 3000000]);
                break;
            case '3m_to_4m':
                $productsQuery->whereBetween('price', [3000000, 4000000]);
                break;
            case 'above_4m':
                $productsQuery->where('price', '>', 4000000);
                break;
        }
    }
    $products = $productsQuery->paginate(20);

    if ($products->isEmpty()) {
        return response()->json(['message' => 'Nhóm sản phẩm chưa cập nhật sản phẩm.'], 404);
    }

    return response()->json([
        'products' => ProductResource::collection($products),
    ]);
}

    
    

    private function getAllChildrenIds($category)
    {
        $ids = [];
        foreach ($category->children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $this->getAllChildrenIds($child));
        }
        return $ids;
    }
}

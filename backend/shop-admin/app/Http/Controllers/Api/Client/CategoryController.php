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
        $category = Category::with('childrenRecursive')->findOrFail($id);
        $categoryIds = $this->getAllChildrenIds($category);
        $categoryIds[] = $id;

        $products = Product::with([
            'variations.attributeValue',
            'variations.variationValues.attributeValue'
        ])->whereIn('category_id', $categoryIds)->get();

        if ($products->isNotEmpty()) {
            $productVariationIds = $products->pluck('variations.*.id')->flatten()->unique();

            $usedAttributeIds = AttributeValue::whereHas('productVariationValues', function ($query) use ($productVariationIds) {
                $query->whereIn('product_variation_id', $productVariationIds);
            })->orWhereHas('productVariations', function ($query) use ($productVariationIds) {
                $query->whereIn('id', $productVariationIds);
            })->pluck('attribute_id')->unique();

            $attributes = Attribute::whereIn('id', $usedAttributeIds)->with('attributeValues')->get();
        } else {
            $attributes = $this->getAttributesFromHighestAncestor($category);
        }

        $attributeOptions = $this->prepareAttributeOptions($attributes);

        return response()->json([
            'products' => ProductResource::collection($products),
            
        ]);
    }
    
    public function getCategoryAttributes($id)
    {
        $category = Category::findOrFail($id);
        $attributes = $this->getAttributesFromHighestAncestor($category);

        $attributeOptions = $this->prepareAttributeOptions($attributes);

        return response()->json([
            'attributes' => $attributeOptions
        ]);
    }
    public function getCategoryChildren($id)
    {
        $category = Category::with('childrenRecursive')->findOrFail($id);
        $filteredCategory = $this->filterCategory($category);
    
        return response()->json([
            'categories' => $filteredCategory
        ]);
    }
    
    private function getAttributesFromHighestAncestor($category)
    {
        $highestAncestor = $this->findHighestAncestorWithAttributes($category);

        if ($highestAncestor && $highestAncestor->attribute_ids) {
            $attributeIds = explode(',', $highestAncestor->attribute_ids);
            return Attribute::whereIn('id', $attributeIds)->with('attributeValues')->get();
        }

        return collect();
    }

    private function findHighestAncestorWithAttributes($category)
    {
        if ($category->attribute_ids) {
            return $category;
        }

        $parent = Category::find($category->parent_id);
        if ($parent) {
            return $this->findHighestAncestorWithAttributes($parent);
        }

        return null;
    }

    private function prepareAttributeOptions($attributes)
    {
        $attributeOptions = [];

        foreach ($attributes as $attribute) {
            $attributeName = $attribute->name;
            $attributeOptions[$attributeName] = [];

            foreach ($attribute->attributeValues as $attributeValue) {
                $attributeOptions[$attributeName][] = $attributeValue->value;
            }
        }

        return $attributeOptions;
    }

    public function getAllColors()
    {
        $colors = AttributeValue::whereHas('attribute', function ($query) {
            $query->where('name', 'Màu Sắc');
        })->pluck('value');
    
        return response()->json([
            'colors' => $colors
        ]);
    }
    private function addAttributeValueToOptions(&$attributeOptions, $attributeValue)
    {
        if (!$attributeValue) return;

        $attributeName = $attributeValue->attribute->name;
        if (!isset($attributeOptions[$attributeName])) {
            $attributeOptions[$attributeName] = [];
        }
        if (!in_array($attributeValue->value, $attributeOptions[$attributeName])) {
            $attributeOptions[$attributeName][] = $attributeValue->value;
        }
    }

    private function filterCategory($category)
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'parent_id' => $category->parent_id,
            'children' => $category->children->map(function ($child) {
                return $this->filterCategory($child);
            }),
        ];
    }
    public function getFilterOptionsByCategory($categoryId, Request $request)
    {
        if ($request->filled('category_ids')) {
            $categoryIds = $request->input('category_ids');
        } else {
            $category = Category::with('children')->findOrFail($categoryId);
            $categoryIds = $this->getAllChildrenIds($category);
            $categoryIds[] = $categoryId;
        }

        $productsQuery = Product::whereIn('category_id', $categoryIds)
            ->with(['variations.variationValues.attributeValue']);

        // Lọc theo màu sắc
        if ($request->filled('colors')) {
            $colors = $request->input('colors');
            $productsQuery->whereHas('variations.attributeValue', function ($query) use ($colors) {
                $query->whereIn('value', $colors);
            });
        }

        // Lọc theo kích thước
        if ($request->filled('sizes')) {
            $sizes = $request->input('sizes');
            $productsQuery->whereHas('variations.variationValues.attributeValue', function ($query) use ($sizes) {
                $query->whereIn('value', $sizes);
            });
        }

        if ($request->filled('price_range')) {
            $priceRange = $request->input('price_range');
        
            // Kiểm tra nếu `price_range` là mảng và có nhiều hơn 1 giá trị
            if (is_array($priceRange) && count($priceRange) > 1) {
                return response()->json([
                    'error' => 'Chỉ được phép chọn một khoảng giá.'
                ], 400);
            }
        
            // Nếu `price_range` là mảng, lấy giá trị đầu tiên
            if (is_array($priceRange)) {
                $priceRange = $priceRange[0];
            }
        
            // Áp dụng bộ lọc giá dựa trên `price_range`
            $productsQuery->where(function ($query) use ($priceRange) {
                switch ($priceRange) {
                    case 'under_1m':
                        $query->where('price', '<', 1000000);
                        break;
                    case '1m_to_2m':
                        $query->whereBetween('price', [1000000, 2000000]);
                        break;
                    case '2m_to_3m':
                        $query->whereBetween('price', [2000000, 3000000]);
                        break;
                    case '3m_to_4m':
                        $query->whereBetween('price', [3000000, 4000000]);
                        break;
                    case 'above_4m':
                        $query->where('price', '>', 4000000);
                        break;
                    default:
                        return response()->json([
                            'error' => 'Khoảng giá không hợp lệ.'
                        ], 400);
                }
            });
        
        }

        $products = $productsQuery->paginate(20);

        if ($products->isEmpty()) {
            return response()->json([], 200);
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

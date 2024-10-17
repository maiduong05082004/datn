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
    
        $productVariationIds = $products->pluck('variations.*.id')->flatten()->unique();
    
        $usedAttributeIds = AttributeValue::whereHas('productVariationValues', function ($query) use ($productVariationIds) {
            $query->whereIn('product_variation_id', $productVariationIds);
        })->orWhereHas('productVariations', function ($query) use ($productVariationIds) {
            $query->whereIn('id', $productVariationIds);
        })->pluck('attribute_id')->unique();
    
        $attributes = Attribute::whereIn('id', $usedAttributeIds)->with('attributeValues')->get();
    
        $attributeOptions = [];
    
        foreach ($attributes as $attribute) {
            $attributeName = $attribute->name;
            $attributeOptions[$attributeName] = [];
    
            foreach ($attribute->attributeValues as $attributeValue) {
                $attributeOptions[$attributeName][] = $attributeValue->value;
            }
        }
    
        $filteredCategory = $this->filterCategory($category);
    
        return response()->json([
            'products' => ProductResource::collection($products),
            'attributes' => $attributeOptions,
            'categories' => $filteredCategory
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
        if (empty($categoryId) || !is_numeric($categoryId)) {
            return response()->json(['error' => 'Invalid category ID'], 400);
        }

        $category = Category::findOrFail($categoryId);
        $categoryIds = $this->getAllChildrenIds($category);
        if (!empty($categoryId) && is_numeric($categoryId)) {
            $categoryIds[] = $categoryId;
        }

        $productsQuery = Product::whereIn('category_id', $categoryIds)
            ->with(['variations.variationValues.attributeValue']);

        // Lọc theo màu sắc
        if ($request->has('colors')) {
            $colors = explode(',', $request->input('colors'));
            $productsQuery->whereHas('variations.attributeValue', function ($query) use ($colors) {
                $query->whereIn('value', $colors);
            });
        }

        // Lọc theo kích thước
        if ($request->has('sizes')) {
            $sizes = explode(',', $request->input('sizes'));
            $productsQuery->whereHas('variations.variationValues', function ($query) use ($sizes) {
                $query->whereHas('attributeValue', function ($q) use ($sizes) {
                    $q->whereIn('value', $sizes);
                });
            });
        }

        // Lọc theo giá cả
        if ($request->has('price_range')) {
            $priceRanges = explode(',', $request->input('price_range'));

            $productsQuery->where(function ($query) use ($priceRanges) {
                foreach ($priceRanges as $priceRange) {
                    switch ($priceRange) {
                        case 'under_1m':
                            $query->orWhere(function ($subQuery) {
                                $subQuery->where('price', '<', 1000000)
                                    ->orWhereHas('variations.variationValues', function ($variationQuery) {
                                        $variationQuery->where('price', '<', 1000000);
                                    });
                            });
                            break;
                        case '1m_to_2m':
                            $query->orWhere(function ($subQuery) {
                                $subQuery->whereBetween('price', [1000000, 2000000])
                                    ->orWhereHas('variations.variationValues', function ($variationQuery) {
                                        $variationQuery->whereBetween('price', [1000000, 2000000]);
                                    });
                            });
                            break;
                        case '2m_to_3m':
                            $query->orWhere(function ($subQuery) {
                                $subQuery->whereBetween('price', [2000000, 3000000])
                                    ->orWhereHas('variations.variationValues', function ($variationQuery) {
                                        $variationQuery->whereBetween('price', [2000000, 3000000]);
                                    });
                            });
                            break;
                        case '3m_to_4m':
                            $query->orWhere(function ($subQuery) {
                                $subQuery->whereBetween('price', [3000000, 4000000])
                                    ->orWhereHas('variations.variationValues', function ($variationQuery) {
                                        $variationQuery->whereBetween('price', [3000000, 4000000]);
                                    });
                            });
                            break;
                        case 'above_4m':
                            $query->orWhere(function ($subQuery) {
                                $subQuery->where('price', '>', 4000000)
                                    ->orWhereHas('variations.variationValues', function ($variationQuery) {
                                        $variationQuery->where('price', '>', 4000000);
                                    });
                            });
                            break;
                    }
                }
            });
        }

        $products = $productsQuery->paginate(20);

        if ($products->isEmpty()) {
            return response()->json(['message' => 'Không có sản phẩm nào phù hợp với bộ lọc.'], 404);
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

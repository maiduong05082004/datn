<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Http\Resources\ProductResource;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;
use Illuminate\Http\Request;


class HomeController extends Controller
{
    public function index()
    {
        $parentCategories = Category::whereNull('parent_id')->with('childrenRecursive')->get();
        $productsByCategory = [];

        foreach ($parentCategories as $parentCategory) {
            $childCategoryIds = $this->getCategoryAndChildrenIds($parentCategory);


            $newProducts = Product::whereIn('category_id', $childCategoryIds)
                ->where('is_new', 1)
                ->orderBy('id', 'desc')
                ->take(4)
                ->get();


            $banner = Banner::where('category_id', $parentCategory->id)->first();


            $productsByCategory[] = [
                'category_id' => $parentCategory->id,
                'name' => $parentCategory->name,
                'image_path' => $banner ? $banner->image_path : null,
                'products' => ProductResource::collection($newProducts)
            ];
        }


        $hotProducts = Product::where('is_hot', 1)
            ->orderBy('id', 'desc')
            ->take(10)
            ->get();

        $collectionProducts = Product::where('is_collection', 1)
            ->orderBy('id', 'desc')
            ->get();

        $banners = Banner::orderBy('id', 'desc')
            ->take(8)
            ->get();

        return response()->json([
            'products_new_category' => $productsByCategory,
            'hot_products' => ProductResource::collection($hotProducts),
            'collection_products' => ProductResource::collection($collectionProducts),
            'banners' => BannerResource::collection($banners)
        ]);
    }










    public function showCategoryBanner($id)
    {
        if (empty($id) || !is_numeric($id)) {
            return response()->json(['error' => 'Invalid category ID'], 400);
        }
        $category = Category::findOrFail($id);
        $categoryIds = $this->getAllChildrenIds($category);
        if (!empty($id) && is_numeric($id)) {
            $categoryIds[] = $id;
        }
        $products = Product::whereIn('category_id', $categoryIds)
            ->paginate(6);
        return response()->json(['products' => ProductResource::collection($products)], 200);
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



    public function search(Request $request)
    {
        // Lấy các tham số từ request
        $keyword = $request->input('keyword', '');
        $categoryIds = $request->input('category_id', []);
        $priceRange = $request->input('price_range', '');
        $colors = $request->input('colors', []);
        $attributes = Attribute::with('attributeValues')->get();

        // Khởi tạo query
        $productsQuery = Product::query();

        // Lọc theo từ khóa (keyword)
        if (!empty($keyword)) {
            $productsQuery->where('name', 'like', '%' . $keyword . '%');
        }

        // Lọc theo danh mục (category_id)
        if (!empty($categoryIds)) {
            if (!is_array($categoryIds)) {
                $categoryIds = explode(',', $categoryIds); // Chuyển chuỗi thành mảng nếu cần
            }
            $categories = Category::whereIn('id', $categoryIds)->get();

            $allCategoryIds = [];
            foreach ($categories as $category) {
                $allCategoryIds = array_merge($allCategoryIds, $this->getCategoryAndChildrenIds($category));
            }

            $productsQuery->whereIn('category_id', $allCategoryIds);
        }

        // Lọc theo khoảng giá (price_range)
        if (!empty($priceRange)) {
            switch ($priceRange) {
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
        if (!empty($colors)) {
            if (!is_array($colors)) {
                $colors = explode(',', $colors); // Nếu đầu vào là chuỗi, chuyển thành mảng
            }

            $productsQuery->whereHas('variations', function ($query) use ($colors) {
                $query->whereHas('attributeValue', function ($subQuery) use ($colors) {
                    $subQuery->whereIn('value', $colors);
                });
            });
        }

        // Lấy danh sách các sản phẩm đã lọc
        $products = $productsQuery->paginate(20);

        // Lấy danh sách màu sắc có sẵn
        $colorsWithImages = AttributeValue::whereHas('attribute', function ($query) {
            $query->where('name', 'Màu Sắc');
        })
            ->with(['productVariations.variationImages' => function ($query) {
                $query->where('image_type', 'variant');
            }])
            ->get();

        $formattedColors = $colorsWithImages->map(function ($color) {
            return [
                'id' => $color->id,
                'name' => $color->value,
                'image' => $color->productVariations->flatMap(function ($variation) {
                    return $variation->variationImages->pluck('image_path');
                })->first()
            ];
        });

        // Lấy danh sách danh mục
        $categories = Category::with('childrenRecursive')->get();
        $filteredCategories = $categories->map(function ($category) {
            return $this->filterCategory($category);
        });

        // Lấy danh sách các thuộc tính sản phẩm (attributes)
        $attributeOptions = $attributes->filter(function ($attribute) {
            return $attribute->id !== 9; // Loại trừ các thuộc tính không cần thiết
        })->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'value' => $attribute->attributeValues->pluck('value')->toArray()
            ];
        });

        // Trả về kết quả
        return response()->json([
            'products' => ProductResource::collection($products),
            'colors' => $formattedColors,
            'categories' => $filteredCategories,
            'attributes' => $attributeOptions
        ], 200);
    }

    private function getCategoryAndChildrenIds($category)
    {
        $categoryIds = collect([$category->id]);
        foreach ($category->childrenRecursive as $childCategory) {
            $categoryIds = $categoryIds->merge($this->getCategoryAndChildrenIds($childCategory));
        }

        return $categoryIds->all();
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
}

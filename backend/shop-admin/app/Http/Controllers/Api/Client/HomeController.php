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
use DB;
use Illuminate\Http\Request;


class HomeController extends Controller
{

    public function bannerMain()
    {
        $bannerMain = Banner::where('type', Banner::TYPE_MAIN)
            ->where('status', 1)
            ->orderBy('id', 'desc')
            ->take(3)
            ->pluck('image_path');

        // Trả về kết quả
        return response()->json([
            'banner_main' => $bannerMain, // Banner

        ]);
    }

    public function productNew()
    {
        $parentCategories = Category::whereNull('parent_id')->with('childrenRecursive')->get();
        $productsByCategory = [];

        foreach ($parentCategories as $parentCategory) {
            $childCategoryIds = $this->getCategoryAndChildrenIds($parentCategory);

            $newProducts = Product::whereIn('category_id', $childCategoryIds)
                ->orderBy('id', 'desc') // Lấy theo ID giảm dần
                ->take(4)
                ->get();

            $banner = Banner::where('type', Banner::TYPE_CATEGORY)
                ->where('category_id', $parentCategory->id)
                ->where('status', 1)
                ->orderBy('id', 'desc')
                ->first();

            $imagePath = $banner ? $banner->image_path : null;

            // Thêm dữ liệu vào mảng kết quả
            $productsByCategory[] = [
                'category_id' => $parentCategory->id,
                'name' => $parentCategory->name,
                'image_path' => $imagePath,
                'products' => ProductResource::collection($newProducts) // Chuyển đổi thành resource
            ];
        }

        // Trả về kết quả
        return response()->json([
            'data' => $productsByCategory,

        ]);
    }




    public function productNewHot()
    {
        $categories = Category::whereNull('parent_id')
            ->with('childrenRecursive')
            ->get();
        $hotProducts = Product::select('products.*', DB::raw('SUM(bill_details.quantity) as total_quantity'))
            ->join('bill_details', 'products.id', '=', 'bill_details.product_id')
            ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
            ->whereIn('bills.status_bill', ['delivered'])
            ->groupBy('products.id')
            ->orderByRaw('total_quantity DESC')
            ->get();

        $productsGroupedByCategory = $hotProducts->groupBy(function ($product) {
            $category = Category::where('id', $product->category_id)
                ->with('parent')
                ->first();
            // Duyệt qua cấp cha để lấy danh mục gốc
            while ($category && $category->parent_id) {
                $category = $category->parent;
            }
            // Trả về ID danh mục cha gốc
            return $category ? $category->id : null;
        });
        $result = $categories->map(function ($category) use ($productsGroupedByCategory) {
            // Lấy sản phẩm thuộc danh mục cha này (hoặc để trống nếu không có)
            $products = $productsGroupedByCategory->get($category->id, collect());
            return [
                'category_id' => $category->id,
                'name' => $category->name,
                'products' => ProductResource::collection($products),
            ];
        });
        // Trả về kết quả
        return response()->json([
            'data' => $result->values(),
        ]);
    }


    public function bannerCustom()
    {
        $banners = Banner::where('type', Banner::TYPE_CUSTOM)
            ->orderBy('id', 'desc')
            ->where('status', 1)
            ->take(8)
            ->pluck('image_path');

        // Trả về kết quả
        return response()->json([
            'banner_custom' => $banners,
        ]);
    }

    // public function showCategoryBanner($id)
    // {
    //     if (empty($id) || !is_numeric($id)) {
    //         return response()->json(['error' => 'Invalid category ID'], 400);
    //     }
    //     $category = Category::findOrFail($id);
    //     $categoryIds = $this->getAllChildrenIds($category);
    //     if (!empty($id) && is_numeric($id)) {
    //         $categoryIds[] = $id;
    //     }
    //     $products = Product::whereIn('category_id', $categoryIds)
    //         ->paginate(6);
    //     return response()->json(['products' => ProductResource::collection($products)], 200);
    // }
    // private function getAllChildrenIds($category)
    // {
    //     $ids = [];
    //     foreach ($category->children as $child) {
    //         $ids[] = $child->id;
    //         $ids = array_merge($ids, $this->getAllChildrenIds($child));
    //     }
    //     return $ids;
    // }



    public function search(Request $request)
    {
        $keyword = $request->input('keyword', '');
        $categoryIds = $request->input('category_id', []);
        $priceRange = $request->input('price_range', '');
        $colors = $request->input('colors', []);
        $attributes = Attribute::with('attributeValues')->get();
        
        $productsQuery = Product::query();

        // Lọc theo từ khóa
        if (!empty($keyword)) {
            $productsQuery->where('name', 'like', '%' . $keyword . '%');
        }

        // Lọc theo danh mục
        if (!empty($categoryIds)) {
            if (!is_array($categoryIds)) {
                $categoryIds = explode(',', $categoryIds);
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
                $colors = explode(',', $colors);
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

        // Lấy danh sách các thuộc tính sản phẩm
        $attributeOptions = $attributes->filter(function ($attribute) {
            return $attribute->id !== 9;
        })->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'value' => $attribute->attributeValues->pluck('value')->toArray()
            ];
        });


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

<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;
use Illuminate\Http\Request;


class HomeController extends Controller
{

    public function bannerMain()
    {
        $bannerMain = Banner::where('type', Banner::TYPE_MAIN)
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
        $productsNewHot = Category::whereNull('parent_id')
            ->get()
            ->map(function ($category) {
                $categoryIds = collect([$category->id]);
                $categoryIds = $categoryIds->merge($category->childrenRecursive->pluck('id'));

                // Lấy sản phẩm bán chạy
                $hotProducts = Product::select('products.*')
                    ->join('bill_details', 'products.id', '=', 'bill_details.product_id')
                    ->join('bills', 'bill_details.bill_id', '=', 'bills.id')
                    ->whereIn('bills.status_bill', ['delivered']) // Chỉ lấy đơn hàng đã giao
                    ->whereIn('products.category_id', $categoryIds) // Lọc theo danh mục
                    ->groupBy('products.id', 'products.name', 'products.price', 'products.category_id', 'products.stock', 'products.is_hot', 'products.is_new', 'products.is_collection', 'products.created_at', 'products.updated_at')
                    ->orderByRaw('SUM(bill_details.quantity) DESC') // Sắp xếp theo số lượng bán
                    ->take(12)
                    ->get();

                return [
                    'category_id' => $category->id,
                    'name' => $category->name,
                    'products' => ProductResource::collection($hotProducts), // Chuyển sản phẩm sang resource
                ];
            });

        // Trả về kết quả
        return response()->json([
            'data' => $productsNewHot,

        ]);
    }

    public function bannerCustom()
    {
        $banners = Banner::where('type', Banner::TYPE_CUSTOM)
            ->orderBy('id', 'desc')
            ->take(8)
            ->pluck('image_path');

        // Trả về kết quả
        return response()->json([
            'banner_custom' => $banners,
        ]);
    }




    private function getCategoryAndChildrenIds($category)
    {
        $categoryIds = collect([$category->id]);
        foreach ($category->childrenRecursive as $childCategory) {
            $categoryIds = $categoryIds->merge($this->getCategoryAndChildrenIds($childCategory));
        }

        return $categoryIds->all();
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
        $keyword = $request->input('keyword');
        $categoryId = $request->input('category_id');

        $productsQuery = Product::query();

        if ($keyword) {
            $productsQuery->where('name', 'like', '%' . $keyword . '%');
        }


        if ($categoryId) {

            $category = Category::find($categoryId);
            if ($category) {
                $categoryIds = $this->getCategoryAndChildrenIds($category);
                $productsQuery->whereIn('category_id', $categoryIds);
            }
        }


        $products = $productsQuery->get();


        return response()->json([
            'products' => ProductResource::collection($products),
        ]);
    }
}

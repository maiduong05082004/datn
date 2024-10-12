<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;
use Request;

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

        // Lấy banner tương ứng với danh mục cha
        $banner = Banner::where('category_id', $parentCategory->id)->first();

        $bannerData = $banner ? [
            'id' => $banner->id,
            'category_id' => $banner->category_id,
            'image_path' => $banner->image_path,
          
        ] : null;

        // Thêm dữ liệu vào mảng
        $productsByCategory[$parentCategory->name] = [
            'banner' => $bannerData,
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

    $categoryWithMostProducts = Product::where('is_collection', 1)
        ->selectRaw('category_id, COUNT(*) as product_count')
        ->groupBy('category_id')
        ->orderBy('product_count', 'desc')
        ->first();

    if ($categoryWithMostProducts) {
        // Lấy banner của danh mục có nhiều sản phẩm nhất
        $bannerCollection = Banner::where('category_id', $categoryWithMostProducts->category_id)->first();
    } else {
        $latestCollectionProduct = Product::where('is_collection', 1)
            ->orderBy('id', 'desc')
            ->first();
        if ($latestCollectionProduct) {
            $bannerCollection = Banner::where('category_id', $latestCollectionProduct->category_id)->first();
        } else {
            $bannerCollection = Banner::orderBy('id', 'desc')->first();
        }
    }
    $banners = Banner::orderBy('id', 'desc')
    ->take(8)
    ->get();


    return response()->json([
        'products_new_category' => $productsByCategory,
        'hot_products' => ProductResource::collection($hotProducts),
        'collection_products' => [
            'banner_collection' => $bannerCollection,
            'products' => ProductResource::collection($collectionProducts)
        ],
        "banners" => BannerResource::collection($banners)
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
}

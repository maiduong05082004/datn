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

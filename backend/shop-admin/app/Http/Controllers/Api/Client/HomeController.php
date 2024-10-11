<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Category;
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
            $productsByCategory[$parentCategory->name] = ProductResource::collection($newProducts);
        }
        $hotProducts = Product::where('is_hot', 1)
            ->orderBy('id', 'desc')
            ->take(10)
            ->get();


        $collectionProducts = Product::where('is_collection', 1)
            ->orderBy('id', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'products_new_category' => $productsByCategory,
            'hot_products' => ProductResource::collection($hotProducts),
            'collection_products' => ProductResource::collection($collectionProducts),
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




}

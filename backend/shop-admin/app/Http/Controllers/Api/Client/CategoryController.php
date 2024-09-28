<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
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

        $products = Product::whereIn('category_id', $categoryIds)
            ->paginate(6);
        return response()->json(['products' => $products], 200);
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

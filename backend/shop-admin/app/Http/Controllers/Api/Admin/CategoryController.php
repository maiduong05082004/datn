<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')->with('childrenRecursive')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'status' => 'required|boolean',
        'parent_id' => 'nullable|exists:categories,id',
        'image' => 'nullable|string|max:2048', 
    ]);

    $data = $request->only('name', 'parent_id', 'status');

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')->store('categories', 'public');
    } elseif ($request->filled('image')) {
        $data['image'] = $request->input('image');
    }

    $category = Category::create($data);

    return response()->json($category, 201);
}

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
        ]);

        $category = Category::findOrFail($id);
        $data = $request->only('name', 'parent_id', 'status');
        
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ (nếu có)
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($data);
        return response()->json($category, 200);
    }

    public function destroy($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $subcategories = Category::where('parent_id', $category->id)->withTrashed()->get();
    
        foreach ($subcategories as $subcategory) {
            Product::where('category_id', $subcategory->id)
                ->update(['category_id' => 0]);
            $subcategory->forceDelete();
        }
    
        Product::where('category_id', $category->id)
            ->update(['category_id' => 0]);
        $category->forceDelete();
    
        return response()->json(['message' => 'Category permanently deleted successfully'], 200);
    }
    

    public function subcategories($id)
    {
        $category = Category::where('id', $id)->whereNull('deleted_at')->firstOrFail();
        $subcategories = Category::where('parent_id', $id)->whereNull('deleted_at')->get();
        return response()->json(['category' => $category, 'subcategories' => $subcategories], 200);
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();
        return response()->json(['message' => 'Category restored successfully'], 200);
    }
    

    public function trash()
    {
        $categories = Category::onlyTrashed()->get();
        if ($categories->isEmpty()) {
            return response()->json([
                'message' => 'There are no categories in the trash.'
            ], 200);
        }
        return response()->json($categories, 200);
    }

    public function softDestroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully',], 200);
    }
    
}

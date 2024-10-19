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
            'status' => 'required|in:0,1',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'parent_id', 'status');

        // Xử lý ảnh từ file hoặc URL
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        } else {
            return response()->json(['error' => 'Không có ảnh được tải lên.'], 400);
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
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'parent_id', 'status');

        // Xử lý ảnh mới từ file hoặc URL
        if ($request->hasFile('image')) {
            if ($category->image && !filter_var($category->image, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        } else{
            return response()->json(['error' => 'Không có ảnh được tải lên.'], 400);
        }
            $category->update($data);
            return response()->json($category, 200);
    }


    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->children()->exists()) {
            return response()->json([
                'error' => 'Không thể xóa danh mục vì nó có danh mục con.'
            ], 400);
        }

        if ($category->products()->exists()) {
            return response()->json([
                'error' => 'Không thể xóa danh mục vì nó có sản phẩm liên quan.'
            ], 400);
        }

        $category->delete();

        return response()->json(['message' => 'Danh mục đã được xóa thành công.'], 200);
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
        return response()->json(['message' => 'Danh mục đã được xóa thành công'], 200);
    }


    public function trash()
    {
        $categories = Category::onlyTrashed()->get();
        if ($categories->isEmpty()) {
            return response()->json([
                'message' => 'Không có danh mục trong thùng rác.'
            ], 200);
        }
        return response()->json($categories, 200);
    }

    public function softDestroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa danh mục vì nó có danh mục con.'
            ], 400);
        }

        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa danh mục vì nó có sản phẩm liên quan.'
            ], 400);
        }

        $category->delete();
        return response()->json([
            'message' => 'Danh mục đã được thêm vào thùng rác thành công.'
        ], 200);
    }
}

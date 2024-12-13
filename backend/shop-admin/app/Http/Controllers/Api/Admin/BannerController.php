<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $banner =  Banner::where('type', Banner::TYPE_MAIN)
    //     ->orderBy('id', 'desc')
    //     ->get();
    //     return response()->json($banner->map(function($banner){
    //       return [
    //             'id' => $banner->id,
    //             'category_id' => $banner->category_id,
    //             'title' => $banner->title,
    //             'image_path' => $banner->image_path,
    //             'link' => $banner->link,
    //             'type' => $banner->type
    //       ];
    //     }));
    // }
    public function index()
    {
        $banner =  Banner::query()->get();
        return response()->json($banner->map(function ($banner) {
            return [
                'id' => $banner->id,
                'category_id' => $banner->category_id,
                'title' => $banner->title,
                'image_path' => $banner->image_path,
                'link' => $banner->link,
                'type' => $banner->type,
                'status' => $banner->status,
            ];
        }));
    }

    public function show($id)
    {
        $banner =  Banner::query()->findOrFail($id);
        return response()->json(
            [
                'id' => $banner->id,
                'category_id' => $banner->category_id,
                'title' => $banner->title,
                'image_path' => $banner->image_path,
                'link' => $banner->link,
                'type' => $banner->type,
                'status' => $banner->status,

            ]
        );
    }


    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'category_id' => 'exists:categories,id',
            'title' => 'string|max:255',
            'image_path' => 'file|mimes:jpeg,png,jpg,gif,jfif,webp|max:5120',
            'link' => 'string|max:255',
            'type' => 'required|in:' . implode(',', [Banner::TYPE_MAIN, Banner::TYPE_CATEGORY, Banner::TYPE_CUSTOM, Banner::TYPE_COLLECTION]),
            'status' => 'integer|in:0,1',
        ]);


        if ($request->hasFile('image_path')) {
            $uploadedFile = $request->file('image_path');

            try {

                $uploadedImage = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'banners',
                    'public_id' => uniqid(),
                ]);

                $validatedData['image_path'] = $uploadedImage->getSecurePath();
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error uploading image to Cloudinary',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        $banner = Banner::create($validatedData);

        return response()->json([
            'message' => 'Banner created successfully',
            'banner' => $banner
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['error' => 'Banner not found'], 404);
        }

        $validatedData = $request->validate([
            'category_id' => 'exists:categories,id',
            'title' => 'string|max:255',
            'image_path' => 'file|mimes:jpeg,png,jpg,gif,jfif|max:5120', // Để ` cho ảnh
            'link' => 'string|max:255',
            'type' => 'required|in:' . implode(',', [Banner::TYPE_MAIN, Banner::TYPE_CATEGORY, Banner::TYPE_CUSTOM, Banner::TYPE_COLLECTION]),
            'status' => 'required|integer|in:0,1', // Chỉ cho phép giá trị là số 0 hoặc 1
        ]);

        try {
            // Nếu có file mới trong `image_path`, upload lên Cloudinary
            if ($request->hasFile('image_path')) {
                $uploadedFile = $request->file('image_path');

                if ($banner->image_path) {
                    $publicId = pathinfo($banner->image_path, PATHINFO_FILENAME);
                    Cloudinary::destroy('banners/' . $publicId);
                }

                $uploadedImage = Cloudinary::upload($uploadedFile->getRealPath(), [
                    'folder' => 'banners',
                    'public_id' => uniqid(),
                ]);
                $validatedData['image_path'] = $uploadedImage->getSecurePath();
            } else {
                $validatedData['image_path'] = $banner->image_path;
            }

            // Cập nhật banner
            $banner->update($validatedData);

            return response()->json(['message' => 'Banner updated successfully', 'banner' => $banner]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error updating banner', 'details' => $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['error' => 'Banner not found'], 404);
        }
        if ($banner->image_path) {
            try {
                $publicId = basename($banner->image_path, '.' . pathinfo($banner->image_path, PATHINFO_EXTENSION));
                Cloudinary::destroy("banners/$publicId");
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to delete image from Cloudinary', 'details' => $e->getMessage()], 500);
            }
        }

        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully']);
    }


    public function deleteImage($id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json(['error' => 'Banner not found'], 404);
        }

        if ($banner->image_path) {
            try {
                $publicId = basename($banner->image_path, '.' . pathinfo($banner->image_path, PATHINFO_EXTENSION));
                Cloudinary::destroy("banners/$publicId");
                $banner->image_path = null;
                $banner->save();

                return response()->json(['message' => 'Image deleted successfully']);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to delete image from Cloudinary', 'details' => $e->getMessage()], 500);
            }
        }

        return response()->json(['message' => 'No image to delete'], 200);
    }
}

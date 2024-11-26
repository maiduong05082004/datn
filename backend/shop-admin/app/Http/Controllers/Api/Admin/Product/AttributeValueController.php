<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\AttributeValueRequest\AttributeValueRequest;
use App\Http\Requests\AttributeValueRequest\DeleteAttributeValuesRequest;
use App\Http\Requests\AttributeValueRequest\UpdateAttributeValueRequest;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Exception;

class AttributeValueController extends Controller
{
    public function index()
    {
        $attributeValues = AttributeValue::with('attribute')->get();


        $groupedResult = $attributeValues->groupBy('attribute_id')->map(function ($group) {
            return [
                'attribute_id' => $group->first()->attribute_id,
                'attribute_name' => $group->first()->attribute->name,
                'attribute_type' => $group->first()->attribute->attribute_type,
                'values' => $group->map(function ($item) {
                    return [
                        'value_id' => $item->id,
                        'value' => $item->value,
                        'image_path' => $item->image_path ?: null,
                    ];
                })->values(), // Chuyển từ collection về dạng mảng
            ];
        })->values();

        return response()->json($groupedResult, 200);
    }


    // public function store(AttributeValueRequest $request)
    // {


    //     // Tạo các giá trị thuộc tính mới
    //     foreach ($request->values as $value) {
    //         AttributeValue::create([
    //             'attribute_id' => $request->attribute_id,
    //             'value' => $value,
    //         ]);
    //     }

    //     // Trả về phản hồi thành công
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Thêm thành giá trị thuộc tính thành công',
    //     ], 201);
    // }

    public function show($attribute_id)
    {

      $params = AttributeValue::query()->findOrFail($attribute_id);

      return response()->json([
        'attribute_id' => $params->attribute_id,
        'value' => $params->value,
        'image_path' => $params->image_path ?: null,
      ]);
    }




    public function store(AttributeValueRequest $request)
    {
        $attributeId = $request->input('attribute_id');

        if (!$attributeId) {
            return response()->json([
                'success' => false,
                'message' => 'Trường attribute_id là bắt buộc.'
            ], 400);
        }

        $values = $request->input('values');
        if (!$values || !is_array($values)) {
            return response()->json([
                'success' => false,
                'message' => 'Trường values phải là một mảng.'
            ], 400);
        }

        $createdValues = [];
        foreach ($values as $index => $valueData) {
            $value = $valueData['value'] ?? null;
            $imageFile = $request->file("values.$index.image_file");

            if (!$value) {
                return response()->json([
                    'success' => false,
                    'message' => "Thiếu giá trị value tại index $index."
                ], 400);
            }

            $imagePath = null;
            if ($imageFile) {
                try {
                    // Upload file lên Cloudinary
                    $uploadedFile = cloudinary()->upload($imageFile->getRealPath(), [
                        'folder' => 'attribute_values',
                    ]);
                    $imagePath = $uploadedFile->getSecurePath();
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => "Lỗi khi upload ảnh tại index $index: " . $e->getMessage()
                    ], 500);
                }
            }

            // Tạo bản ghi AttributeValue
            $attributeValue = AttributeValue::create([
                'attribute_id' => $attributeId,
                'value' => $value,
                'image_path' => $imagePath,
            ]);

            $createdValues[] = $attributeValue;
        }

        return response()->json([
            'success' => true,
            'message' => 'Thêm các giá trị thuộc tính thành công',
            'data' => $createdValues
        ], 201);
    }




    // public function update(Request $request, $id)
    // {
    //     // Lấy attribute_value theo id
    //     $attributeValue = AttributeValue::findOrFail($id);

    //     // Kiểm tra và cập nhật giá trị nếu có
    //     if ($request->has('value')) {
    //         $attributeValue->value = $request->input('value');
    //     }

    //     $attributeValue->save();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Giá trị thuộc tính đã được cập nhật thành công.',
    //     ], 200);
    // }

    public function update(Request $request, $id)
    {
        $attributeValue = AttributeValue::findOrFail($id);

        if ($request->has('value')) {
            $attributeValue->value = $request->input('value');
        }

        if ($request->hasFile('image_file')) {
            try {
                $uploadedFile = cloudinary()->upload($request->file('image_file')->getRealPath(), [
                    'folder' => 'attribute_values',
                ]);
                $attributeValue->image_path = $uploadedFile->getSecurePath();
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lỗi khi upload ảnh: ' . $e->getMessage(),
                ], 500);
            }
        }

        // Lưu thay đổi
        $attributeValue->save();

        return response()->json([
            'success' => true,
            'message' => 'Giá trị thuộc tính đã được cập nhật thành công.',
            'data' => $attributeValue,
        ], 200);
    }






    // public function destroy($id)
    // {
    //     $attribute_values = AttributeValue::find($id);
    //     if (!$attribute_values) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'attribute_values not found.'
    //         ], 404);
    //     }
    //     $attribute_values->delete();
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Xóa thánh công'
    //     ], 200);
    // }





    public function destroy($id)
    {
        $attributeValue = AttributeValue::find($id);
        if (!$attributeValue) {
            return response()->json([
                'success' => false,
                'message' => 'Attribute value not found.',
            ], 404);
        }

        try {
            if ($attributeValue->image_path) {
                $publicId = pathinfo($attributeValue->image_path, PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
            }
            $attributeValue->delete();
            return response()->json([
                'success' => true,
                'message' => 'Attribute value and associated image have been deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the attribute value or the image: ' . $e->getMessage(),
            ], 500);
        }
    }



    public function deleteImage($id)
    {
        $attributeValue = AttributeValue::findOrFail($id);
        if (!$attributeValue->image_path) {
            return response()->json([
                'success' => false,
                'message' => 'Không có ảnh nào để xóa.',
            ], 404);
        }

        try {
            $publicId = pathinfo($attributeValue->image_path, PATHINFO_FILENAME);
            cloudinary()->destroy($publicId);
            $attributeValue->image_path = null;
            $attributeValue->save();

            return response()->json([
                'success' => true,
                'message' => 'Ảnh đã được xóa thành công.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa ảnh: ' . $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\AttributeValueRequest\AttributeValueRequest;
use App\Http\Requests\AttributeValueRequest\DeleteAttributeValuesRequest;
use App\Http\Requests\AttributeValueRequest\UpdateAttributeValueRequest;

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
                    ];
                })->values(), // Chuyển từ collection về dạng mảng
            ];
        })->values(); 
    
        return response()->json($groupedResult, 200);
    }
    

    public function store(AttributeValueRequest $request)
    {
      

        // Tạo các giá trị thuộc tính mới
        foreach ($request->values as $value) {
            AttributeValue::create([
                'attribute_id' => $request->attribute_id,
                'value' => $value,
            ]);
        }

        // Trả về phản hồi thành công
        return response()->json([
            'success' => true,
            'message' => 'Thêm thành giá trị thuộc tính thành công',
        ], 201);
    }

    public function show($attribute_id)
    {

      $params = AttributeValue::query()->findOrFail($attribute_id);

      return response()->json([
        'attribute_id' => $params->attribute_id,
        'value' => $params->value,
      ]);
    }
    

    // public function update(UpdateAttributeValueRequest $request, $attributeId)

    // {
    //     foreach ($request->values as $valueData) {
    //         if (isset($valueData['id']) && $valueData['id']) {
    //             $attributeValue = AttributeValue::where('id', $valueData['id'])
    //                 ->where('attribute_id', $attributeId)
    //                 ->first();
    
    //             if ($attributeValue) {
    //                 $attributeValue->update([
    //                     'value' => $valueData['value'],
    //                 ]);
    //             }
    //         } else {
    //             AttributeValue::create([
    //                 'attribute_id' => $attributeId,
    //                 'value' => $valueData['value']
    //             ]);
    //         }
    //     }
    
    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Cập nhật và thêm mới giá trị thuộc tính thành công.',
    //     ], 200);
    // }
    
    public function update(Request $request, $id)
    {
        // Lấy attribute_value theo id
        $attributeValue = AttributeValue::findOrFail($id);
    
        // Kiểm tra và cập nhật giá trị nếu có
        if ($request->has('value')) {
            $attributeValue->value = $request->input('value');
        }
    
        $attributeValue->save();
    
        return response()->json([
            'success' => true,
            'message' => 'Giá trị thuộc tính đã được cập nhật thành công.',
        ], 200);
    }
      
    
    public function destroy($id)
{
    $attribute_values = AttributeValue::find($id);
    if (!$attribute_values) {
        return response()->json([
            'success' => false,
            'message' => 'attribute_values not found.'
        ], 404);
    }
    $attribute_values->delete();
    return response()->json([
        'success' => true,
        'message' => 'Xóa thánh công'
    ], 200);

}



}
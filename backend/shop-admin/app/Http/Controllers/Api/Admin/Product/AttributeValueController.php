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
    /**
     * Lấy danh sách các giá trị thuộc tính.
     */
    public function index()
    {
        // Lấy danh sách các giá trị thuộc tính cùng với thuộc tính liên quan
        $attributeValues = AttributeValue::with('attribute')->get();
        
       $attributeValueData = $attributeValues->groupBy('attribute_id');

       $result = $attributeValueData->map(function($group){
        return [
            'attribute_id' => $group->first()->attribute_id,
            'attribute_name' => $group->first()->attribute->name,
            'attribute_type' => $group->first()->attribute->attribute_type,
            'values' => $group->map(function ($item) {
                return [
                    'id' => $item->id,
                    'value' => $item->value,
                 
                ];
            })
        ];
    });


        // Trả về dữ liệu dưới dạng JSON
        return response()->json( $result, 200);
    }

    /**
     * Tạo giá trị thuộc tính mới.
     */
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

    /**
     * Hiển thị thông tin một giá trị thuộc tính cụ thể.
     */
    public function show($attribute_id)
    {
        // Tìm tất cả các giá trị dựa trên attribute_id
        $attributeValues = AttributeValue::with('attribute')
            ->where('attribute_id', $attribute_id)
            ->get();
    
            $attributeValueData = $attributeValues->groupBy('attribute_id');

       $result = $attributeValueData->map(function($group){
        return [
            'attribute_id' => $group->first()->attribute_id,
            'attribute_name' => $group->first()->attribute->name,
            'attribute_type' => $group->first()->attribute->attribute_type,
            'values' => $group->map(function ($item) {
                return [
                    'id' => $item->id,
                    'value' => $item->value,
                 
                ];
            })
        ];
    });
        // Nếu không có giá trị nào liên quan đến attribute_id, trả về thông báo lỗi
        if ($attributeValues->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'không tìm thấy attribute_id nào trong dữ liệu bạn tìm kiếm',
            ], 404);
        }
    
        // Trả về dữ liệu JSON với các giá trị tìm thấy
        return response()->json($result,200);
    }
    
    

    public function update(UpdateAttributeValueRequest $request, $attributeId)

    {
        foreach ($request->values as $valueData) {
            if (isset($valueData['id']) && $valueData['id']) {
                // Cập nhật giá trị đã tồn tại
                $attributeValue = AttributeValue::where('id', $valueData['id'])
                    ->where('attribute_id', $attributeId)
                    ->first();
    
                if ($attributeValue) {
                    $attributeValue->update([
                        'value' => $valueData['value'],
                    ]);
                }
            } else {
                // Tạo mới giá trị nếu chưa có ID
                AttributeValue::create([
                    'attribute_id' => $attributeId,
                    'value' => $valueData['value']
                ]);
            }
        }
    
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật và thêm mới giá trị thuộc tính thành công.',
        ], 200);
    }
    
    
    
    public function destroy(DeleteAttributeValuesRequest $request, $attributeId)
{
  
    // Lấy danh sách các ID cần xóa
    $valueIds = array_column($request->values, 'id');

    // Xóa các giá trị thuộc tính tương ứng
    AttributeValue::whereIn('id', $valueIds)
        ->where('attribute_id', $attributeId)
        ->delete();

    return response()->json([
        'success' => true,
        'message' => 'Xóa giá trị thuộc tính thành công',
    ], 200);
}

}
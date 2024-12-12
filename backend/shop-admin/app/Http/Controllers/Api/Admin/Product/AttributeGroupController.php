<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Models\AttributeGroup;
use App\Models\Attribute;
use App\Models\Group;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\AttributeGroupRequest;
use App\Http\Resources\AttributeGroupResource;

class AttributeGroupController extends Controller
{

    // public function index()
    // {
    //     $attributeGroups = AttributeGroup::with('group', 'attribute')->get();

    //     $groupedData = $attributeGroups->groupBy('group_id');

    //     $result = $groupedData->map(function ($group) {
    //         return [
    //             'group_id' => $group->first()->group->id,
    //             'group_name' => $group->first()->group->name,
    //             'attributes' => $group->map(function ($item) {
    //                 return [
    //                     'id' => $item->attribute->id,
    //                     'name' => $item->attribute->name,
    //                     'attribute_type' => $item->attribute->attribute_type,
    //                     'attribute_values' => $item->attribute->values->mapWithKeys(function ($value) { 
    //                         return ["value_{$value->id}" => $value->value];
    //                     })
    //                 ];
    //             })->values() // Lấy giá trị của từng attribute
    //         ];
    //     });

    //     return response()->json(['variation' => $result->values()]);
    // }

    public function index()
    {
        $attributeGroups = AttributeGroup::with('group', 'attribute')->get();

        $groupedData = $attributeGroups->groupBy('group_id');

        $result = $groupedData->map(function ($group) {
            return [
                'group_id' => $group->first()->group->id,
                'group_name' => $group->first()->group->name,
                'attributes' => $group->map(function ($item) {
                    return [
                        'id' => $item->attribute->id,
                        'name' => $item->attribute->name,
                        'attribute_type' => $item->attribute->attribute_type,
                        'attribute_values' => $item->attribute->values->map(function ($value) {
                            return [
                                'id' => $value->id,
                                'value' => $value->value,
                                'image_path' => $value->image_path
                            ];
                        })->values() // Chuyển về danh sách các đối tượng có id và value
                    ];
                })->values() // Lấy giá trị của từng attribute
            ];
        });

        return response()->json(['variation' => $result->values()]);
    }



    public function store(AttributeGroupRequest $request)
    {
        // Tạo nhóm mới trong bảng groups
        $group = Group::create([
            'name' => $request->group_name,
        ]);

        // Gắn các thuộc tính vào nhóm
        foreach ($request->attribute_id as $attributeId) {
            AttributeGroup::create([
                'group_id' => $group->id,
                'attribute_id' => $attributeId,
            ]);
        }

        // Lấy lại nhóm vừa được tạo với các thuộc tính liên quan
        $groupWithAttributes = Group::with('attributeGroups.attribute')
            ->where('id', $group->id)
            ->first();

        // Trả về phản hồi JSON khi thành công
        return response()->json([
            'success' => true,
            'message' => 'Nhóm biến thể mới đã được tạo thành công.',
            'data' => new AttributeGroupResource($groupWithAttributes)
        ], 201);
    }




    public function show($id)
    {
        $attributeGroups = AttributeGroup::with('group', 'attribute')
            ->where('group_id', $id)
            ->get();

        if ($attributeGroups->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Nhóm thuộc tính không tồn tại.'
            ], 404);
        }

        $result = [
            'group_id' => $attributeGroups->first()->group->id,
            'group_name' => $attributeGroups->first()->group->name,
            'attributes' => $attributeGroups->map(function ($item) {
                return [
                    'id' => $item->attribute->id,
                    'name' => $item->attribute->name,
                    'attribute_type' => $item->attribute->attribute_type,
                    'attribute_values' => $item->attribute->values->map(function ($value) {
                        return [
                            'id' => $value->id,
                            'value' => $value->value,
                            'image_path' => $value->image_path??null
                        ];
                    })->values() // Lấy danh sách đối tượng id và value
                ];
            })->values() 
        ];

        return response()->json(['variation' => [$result]], 201); // Bọc trong 'variation'
    }

    public function update(AttributeGroupRequest $request, $id)
    {
        // Cập nhật thông tin nhóm
        $group = Group::findOrFail($id);
        $group->name = $request->group_name;
        $group->save();

        // Lấy danh sách thuộc tính hiện tại của nhóm
        $existingAttributes = AttributeGroup::where('group_id', $id)->pluck('attribute_id')->toArray();

        // Kiểm tra sự khác nhau giữa các thuộc tính mới và thuộc tính cũ
        $newAttributes = $request->attribute_id;
        $attributesToRemove = array_diff($existingAttributes, $newAttributes); // Thuộc tính cần xóa
        $attributesToAdd = array_diff($newAttributes, $existingAttributes);    // Thuộc tính cần thêm

        // Xóa những thuộc tính không còn được chọn
        if (!empty($attributesToRemove)) {
            AttributeGroup::where('group_id', $id)
                ->whereIn('attribute_id', $attributesToRemove)
                ->delete();
        }

        // Thêm những thuộc tính mới được chọn
        foreach ($attributesToAdd as $attributeId) {
            AttributeGroup::create([
                'group_id' => $group->id,
                'attribute_id' => $attributeId,
            ]);
        }

        // Trả về dữ liệu sau khi cập nhật
        return response()->json([
            'success' => true,
            'message' => 'Nhóm thuộc tính đã được cập nhật thành công.',
            'data' => new AttributeGroupResource($group->load('attributeGroups.attribute'))
        ], 200);
    }



    /**
     * Xóa nhóm thuộc tính
     */
    public function destroy($id)
    {
        // Xóa các thuộc tính liên quan trong bảng attribute_groups
        AttributeGroup::where('group_id', $id)->delete();

        // Xóa nhóm thuộc tính trong bảng groups
        $group = Group::findOrFail($id);
        $group->delete();

        return response()->json([
            'success' => true,
            'message' => 'Nhóm thuộc tính đã được xóa thành công.'
        ], 200);
    }



    public function destroyAttribute($group_id, $attribute_id)
    {
        // Tìm và xóa thuộc tính trong nhóm
        $attributeGroup = AttributeGroup::where('group_id', $group_id)
            ->where('attribute_id', $attribute_id)
            ->first();

        if (!$attributeGroup) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thuộc tính trong nhóm.'
            ], 404);
        }

        // Xóa thuộc tính khỏi nhóm
        $attributeGroup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Thuộc tính đã được xóa khỏi nhóm thành công.'
        ], 200);
    }
}

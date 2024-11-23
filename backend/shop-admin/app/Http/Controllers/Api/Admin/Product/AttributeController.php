<?php

namespace App\Http\Controllers\Api\Admin\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttributeRequest\AttributeRequest;
use App\Http\Requests\AttributeRequest\UpdateAttributeRequest;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    private $attributeTypes = [
        0 => 'Primary',
        1 => 'Secondary',
    ];

    public function index()
    {
        $attributes = Attribute::all();

        $data = $attributes->map(function ($attribute){
            return [
                'id' => $attribute->id,
                'name' => $attribute->name,
            ];
        }); 
        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }


    public function store(AttributeRequest $request)
    {
    
        $attribute = Attribute::create([
            'name' => $request->name,
            'attribute_type' => $request->attribute_type, 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attribute added successfully.',
            'data' => $attribute
        ], 201); 
    }

    public function show($id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json([
                'success' => false,
                'message' => 'Attribute not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $attribute
        ], 200);
    }


    public function update(UpdateAttributeRequest $request, $id)

    {
      
    
        $attribute = Attribute::findOrFail($id);
        $attribute->update([
            'name' => $request->name,
            'attribute_type' => $request->attribute_type,
        ]);
    
        return response()->json([
            'success' => true,
            'message' => 'sửa thành công',
            'data' => $attribute
        ], 200);
    }
    
    // Xóa thuộc tính
    public function destroy($id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json([
                'success' => false,
                'message' => 'Attribute not found.'
            ], 404);
        }
        $attribute->delete();
        return response()->json([
            'success' => true,
            'message' => 'Xóa thánh công'
        ], 200);
    }
}

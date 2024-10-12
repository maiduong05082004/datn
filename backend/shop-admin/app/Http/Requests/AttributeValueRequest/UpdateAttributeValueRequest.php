<?php

namespace App\Http\Requests\AttributeValueRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\AttributeValue;
use Log;

class UpdateAttributeValueRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'values' => 'required|array',
            'values.*.id' => 'nullable|exists:attribute_values,id',
            'values.*.value' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    // Lấy attributeId từ URL
                    $attributeId = $this->route('attribute_value'); 
             
                                        $index = explode('.', $attribute)[1];
                    
                    // Lấy id của giá trị hiện tại từ request (nếu có)
                    $valueId = $this->values[$index]['id'] ?? null;

                    // Kiểm tra trùng lặp giá trị cho cùng một attribute_id
                    $exists = AttributeValue::where('attribute_id', $attributeId)
                        ->where('value', $value)
                        ->when($valueId, function ($query, $valueId) {
                            // Loại trừ giá trị hiện tại khi kiểm tra trùng lặp
                            return $query->where('id', '!=', $valueId);
                        })
                        ->exists();     

                    if ($exists) {
                        $fail("Giá trị '$value' đã tồn tại cho thuộc tính này.");
                    }
                }
            ],
        ];
    }

    public function messages()
    {
        return [
            'values.required' => 'Danh sách giá trị là bắt buộc.',
            'values.array' => 'Giá trị phải là một mảng.',
            'values.*.id.exists' => 'Giá trị không tồn tại.',
            'values.*.value.required' => 'Tất cả các giá trị đều bắt buộc.',
            'values.*.value.string' => 'Giá trị phải là một chuỗi.',
            'values.*.value.max' => 'Giá trị không được vượt quá 255 ký tự.'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422));
    }
}

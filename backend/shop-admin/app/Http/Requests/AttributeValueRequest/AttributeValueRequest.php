<?php

namespace App\Http\Requests\AttributeValueRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use \App\Models\AttributeValue;
class AttributeValueRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'attribute_id' => 'required|exists:attributes,id',
            'values' => 'required|array',
            'values.*' => [
                'required', 
                'string', 
                'max:255', 
                function ($attribute, $value, $fail) {
                    $attributeId = $this->attribute_id;

                    // Kiểm tra giá trị đã tồn tại hay chưa
                    $exists = AttributeValue::where('attribute_id', $attributeId)
                        ->where('value', $value)
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
            'attribute_id.required' => 'Trường thuộc tính là bắt buộc.',
            'attribute_id.exists' => 'Thuộc tính này không tồn tại.',
            'values.required' => 'Danh sách giá trị là bắt buộc.',
            'values.array' => 'Giá trị phải là một mảng.',
            'values.*.required' => 'Tất cả các giá trị đều bắt buộc.',
            'values.*.string' => 'Giá trị phải là một chuỗi.',
            'values.*.max' => 'Giá trị không được vượt quá 255 ký tự.'
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

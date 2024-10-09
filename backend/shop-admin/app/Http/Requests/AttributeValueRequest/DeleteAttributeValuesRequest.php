<?php

namespace App\Http\Requests\AttributeValueRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class DeleteAttributeValuesRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Thay đổi quyền truy cập nếu cần thiết
    }

    public function rules()
    {
        return [
            'values' => 'array', // Bắt buộc phải là mảng
            'values.*.id' => 'required|exists:attribute_values,id', // ID phải tồn tại trong bảng attribute_values
        ];
    }

    public function messages()
    {
        return [
            'values.array' => 'Giá trị phải là một mảng.',
            'values.*.id.required' => 'Mỗi giá trị phải có một ID.',
            'values.*.id.exists' => 'ID giá trị không tồn tại trong cơ sở dữ liệu.',
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

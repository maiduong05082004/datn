<?php

namespace App\Http\Requests\AttributeRequest;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AttributeRequest extends FormRequest
{
 
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'name' => 'required|string|max:255',
            'attribute_type' => 'required|in:0,1', 
        ];
        if ($this->isMethod('post')) {
            $rules['name'] .= '|unique:attributes,name';
        } elseif ($this->isMethod('put') || $this->isMethod('patch')) {
            $attributeId = $this->route('attribute'); 
            $rules['name'] .= '|unique:attributes,name,' . $attributeId;
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên thuộc tính là bắt buộc.',
            'name.string' => 'Tên thuộc tính phải là chuỗi ký tự.',
            'name.max' => 'Tên thuộc tính không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên thuộc tính đã tồn tại, vui lòng chọn tên khác.',
            'attribute_type.required' => 'Loại thuộc tính là bắt buộc.',
            'attribute_type.in' => 'Loại thuộc tính chỉ có thể là 0 (Primary) hoặc 1 (Secondary).',
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

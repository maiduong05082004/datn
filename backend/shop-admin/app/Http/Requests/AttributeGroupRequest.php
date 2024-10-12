<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AttributeGroupRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có được phép thực hiện yêu cầu này hay không.
     *
     * @return bool
     */
    public function authorize()
    {
        // Đảm bảo rằng người dùng được phép thực hiện yêu cầu này, có thể để true cho phép tất cả.
        return true;
    }

    /**
     * Quy tắc xác thực cho yêu cầu.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->route('id') ?? $this->route('attribute_group'); // Thử lấy ID từ route 'id' hoặc 'attribute_group'
        
        $rules = [
            'group_name' => 'required|string|max:255',
            'attribute_id' => 'required|array',
            'attribute_id.*' => 'exists:attributes,id',
        ];
        
        if ($this->isMethod('post')) {
            $rules['group_name'] .= '|unique:groups,name';
        } elseif ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['group_name'] .= '|unique:groups,name,' . $id;
        }
        
        return $rules;
    }
    
    
    /**
     * Thông báo lỗi tùy chỉnh cho các quy tắc xác thực.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'group_name.required' => 'Tên nhóm thuộc tính là bắt buộc.',
            'group_name.unique' => 'Tên nhóm thuộc tính đã tồn tại, vui lòng chọn tên khác.',
            'attribute_id.required' => 'Danh sách thuộc tính là bắt buộc.',
            'attribute_id.*.exists' => 'Thuộc tính được chọn không hợp lệ.',
        ];
    }

    /**
     * Xử lý lỗi khi xác thực không thành công.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422));
    }
}

<?php

namespace App\Http\Requests\ShippingRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreShippingRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có được phép gửi request này không.
     */
    public function authorize()
    {
        return true; // Cho phép tất cả các yêu cầu đã xác thực
    }

    /**
     * Quy tắc xác thực.
     */
    public function rules()
    {
        return [
            'address_line' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'is_default' => 'boolean',
        ];
    }

    /**
     * Thông báo lỗi tùy chỉnh cho các quy tắc xác thực.
     */
    public function messages()
    {
        return [
            'address_line.required' => 'Địa chỉ là bắt buộc.',
            'address_line.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'address_line.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            
            'city.required' => 'Thành phố là bắt buộc.',
            'city.string' => 'Thành phố phải là chuỗi ký tự.',
            'city.max' => 'Tên thành phố không được vượt quá 255 ký tự.',

            'district.required' => 'Quận/Huyện là bắt buộc.',
            'district.string' => 'Quận/Huyện phải là chuỗi ký tự.',
            'district.max' => 'Tên Quận/Huyện không được vượt quá 255 ký tự.',

            'ward.required' => 'Phường/Xã là bắt buộc.',
            'ward.string' => 'Phường/Xã phải là chuỗi ký tự.',
            'ward.max' => 'Tên Phường/Xã không được vượt quá 255 ký tự.',

            'phone_number.required' => 'Số điện thoại là bắt buộc.',
            'phone_number.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone_number.max' => 'Số điện thoại không được vượt quá 15 ký tự.',

            'is_default.boolean' => 'Giá trị mặc định phải là đúng hoặc sai.',
        ];
    }

    /**
     * Tùy chỉnh phản hồi JSON khi xác thực thất bại.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors(),
        ], 422));
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShippingAddressRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Bạn có thể thêm logic xác thực user nếu cần.
    }

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

    public function messages()
    {
        return [
            'address_line.required' => 'Vui lòng nhập địa chỉ.',
            'address_line.string' => 'Địa chỉ phải là chuỗi ký tự hợp lệ.',
            'address_line.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

            'city.required' => 'Vui lòng nhập tên thành phố.',
            'city.string' => 'Thành phố phải là chuỗi ký tự hợp lệ.',
            'city.max' => 'Tên thành phố không được vượt quá 255 ký tự.',

            'district.required' => 'Vui lòng nhập tên quận/huyện.',
            'district.string' => 'Quận/huyện phải là chuỗi ký tự hợp lệ.',
            'district.max' => 'Tên quận/huyện không được vượt quá 255 ký tự.',

            'ward.required' => 'Vui lòng nhập tên phường/xã.',
            'ward.string' => 'Phường/xã phải là chuỗi ký tự hợp lệ.',
            'ward.max' => 'Tên phường/xã không được vượt quá 255 ký tự.',

            'phone_number.required' => 'Vui lòng nhập số điện thoại.',
            'phone_number.string' => 'Số điện thoại phải là chuỗi ký tự hợp lệ.',
            'phone_number.max' => 'Số điện thoại không được vượt quá 15 ký tự.',

            'is_default.boolean' => 'Giá trị của is_default phải là true hoặc false.',
        ];
    }
}

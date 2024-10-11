<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2|max:50|regex:/^[a-zA-Z\s\-]+$/',
            'address' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:15',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&]/',
            ]
        ];
    }

    public function messages()
    {
        return [
            // Name validation messages
            'name.required' => 'Họ tên là bắt buộc.',
            'name.string' => 'Họ tên phải là một chuỗi ký tự.',
            'name.min' => 'Họ tên phải có ít nhất :min ký tự.',
            'name.max' => 'Họ tên không được vượt quá :max ký tự.',
            'name.regex' => 'Họ tên chỉ được chứa các ký tự chữ cái, khoảng trắng và dấu gạch nối.',

            // Address validation messages
            'address.string' => 'Địa chỉ phải là một chuỗi ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá :max ký tự.',

            // Email validation messages
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email phải là một địa chỉ email hợp lệ.',
            'email.max' => 'Email không được vượt quá :max ký tự.',
            'email.unique' => 'Email này đã được sử dụng.',

            // Phone validation messages
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.regex' => 'Số điện thoại không hợp lệ.',
            'phone.min' => 'Số điện thoại phải có ít nhất :min ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá :max ký tự.',

            // Password validation messages
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.string' => 'Mật khẩu phải là một chuỗi ký tự.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
            'password.regex' => 'Mật khẩu phải bao gồm ít nhất 1 chữ cái thường, 1 chữ cái hoa, 1 chữ số và 1 ký tự đặc biệt.',
        ];
    }
}

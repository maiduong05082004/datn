<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',  // Bỏ quy tắc unique
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'thumbnail_image' => 'nullable|max:2048',
            'album_images.*' => 'nullable|max:2048',
            'variations' => 'nullable|json',
            'category_id' => 'required|integer|exists:categories,id',
            'description' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'is_hot' => 'boolean',
            'is_new' => 'boolean',
            'is_collection' => 'boolean',
            'input_day' => 'nullable|date',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'price.required' => 'Giá sản phẩm là bắt buộc.',
            'price.numeric' => 'Giá phải là số.',
            'stock.integer' => 'Số lượng phải là số nguyên.',
            'category_id.required' => 'Danh mục sản phẩm là bắt buộc.',
            'category_id.exists' => 'Danh mục sản phẩm không hợp lệ.',
            'description.string' => 'Mô tả sản phẩm phải là chuỗi ký tự.',
            'content.string' => 'Nội dung sản phẩm phải là chuỗi ký tự.',
            'is_hot.boolean' => 'Trường sản phẩm nổi bật phải là đúng hoặc sai.',
            'is_new.boolean' => 'Trường sản phẩm mới phải là đúng hoặc sai.',
            'is_collection.boolean' => 'Trường bộ sưu tập phải là đúng hoặc sai.',
            'input_day.date' => 'Ngày nhập phải là ngày hợp lệ.',
        ];
    }

    /**
     * Customize the failed validation response.
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

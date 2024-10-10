<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cho phép tất cả các người dùng được authorize để request này
    }

    public function rules()
    {
        $rules = [
            'name' => 'required|string|max:255|unique:products,name',  // Tên sản phẩm là bắt buộc và phải duy nhất
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
    
        // Nếu đây là request cập nhật sản phẩm, thì cần loại bỏ chính sản phẩm đang cập nhật khỏi quy tắc unique
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $productId = $this->route('id');  // Lấy ID sản phẩm từ URL
            $rules['name'] = 'required|string|max:255|unique:products,name,' . $productId;
        }
    
        return $rules;
    }
    

    public function messages()
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'name.unique' => 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.',
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

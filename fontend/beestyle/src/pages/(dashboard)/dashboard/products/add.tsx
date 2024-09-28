import React from 'react'

type Props = {}

const Addproduct = (props: Props) => {
    return (
        <form action="/submit" method="POST" className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Thêm mới Sản Phẩm</h2>
        
        <div className="mb-4">
            <label htmlFor="slug" className="block text-gray-700 font-bold mb-2">Slug:</label>
            <input type="text" name="slug" id="slug" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
        </div>
        
        <div className="mb-4">
            <label htmlFor="name_product" className="block text-gray-700 font-bold mb-2">Tên sản phẩm:</label>
            <input type="text" name="name_product" id="name_product" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
        </div>
    
        <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Giá:</label>
            <input type="number" name="price" id="price" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" step="0.01" required />
        </div>
    
        <div className="mb-4">
            <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">Tồn kho:</label>
            <input type="number" name="stock" id="stock" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
    
        <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Mô tả:</label>
            <input type="text" name="description" id="description" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
        </div>
    
        <div className="mb-4">
    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Nội dung:</label>
    <textarea 
        name="content" 
        id="content" 
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        required
    ></textarea>
</div>

    
        <div className="mb-4">
            <label htmlFor="view" className="block text-gray-700 font-bold mb-2">Lượt xem:</label>
            <input type="number" name="view" id="view" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" required />
        </div>
    
        <div className="mb-4">
            <label htmlFor="category_id" className="block text-gray-700 font-bold mb-2">Danh mục ID:</label>
            <input type="number" name="category_id" id="category_id" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" required />
        </div>
    
        <div className="mb-4">
            <label htmlFor="is_type" className="block text-gray-700 font-bold mb-2">Loại:</label>
            <input type="checkbox" name="is_type" id="is_type" className="mr-2 leading-tight" />
            <span className="text-sm text-gray-600">Sản phẩm đặc biệt</span>
        </div>
    
        <div className="mb-4">
            <label htmlFor="is_hot" className="block text-gray-700 font-bold mb-2">Sản phẩm nổi bật:</label>
            <input type="checkbox" name="is_hot" id="is_hot" className="mr-2 leading-tight" />
        </div>
    
        <div className="mb-4">
            <label htmlFor="is_hot_deal" className="block text-gray-700 font-bold mb-2">Hot Deal:</label>
            <input type="checkbox" name="is_hot_deal" id="is_hot_deal" className="mr-2 leading-tight" />
        </div>
    
        <div className="mb-4">
            <label htmlFor="is_new" className="block text-gray-700 font-bold mb-2">Sản phẩm mới:</label>
            <input type="checkbox" name="is_new" id="is_new" className="mr-2 leading-tight" />
        </div>
    
        <div className="mb-4">
            <label htmlFor="is_show_home" className="block text-gray-700 font-bold mb-2">Hiển thị trên trang chủ:</label>
            <input type="checkbox" name="is_show_home" id="is_show_home" className="mr-2 leading-tight" />
        </div>
    
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Submit
        </button>
    </form>
    )
}

export default Addproduct
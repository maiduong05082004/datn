import React from 'react'

type Props = {}

const Addproduct = (props: Props) => {
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Thêm Sản Phẩm</h2>
            <form action="/submit-product" method="POST">
                {/* Slug */}
                <div className="mb-4">
                    <label htmlFor="slug" className="block text-gray-700 font-bold mb-2">Slug:</label>
                    <input type="text" name="slug" id="slug" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
                </div>
                {/* Tên sản phẩm */}
                <div className="mb-4">
                    <label htmlFor="name_product" className="block text-gray-700 font-bold mb-2">Tên sản phẩm:</label>
                    <input type="text" name="name_product" id="name_product" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
                </div>
                {/* Giá */}
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Giá:</label>
                    <input type="number" step="0.01" name="price" id="price" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                {/* Số lượng tồn kho */}
                <div className="mb-4">
                    <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">Số lượng tồn:</label>
                    <input type="number" name="stock" id="stock" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                {/* Mô tả */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Mô tả:</label>
                    <input type="text" name="description" id="description" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
                </div>
                {/* Nội dung chi tiết */}
                <div className="mb-4">
                    <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Nội dung chi tiết:</label>
                    <textarea name="content" id="content" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required defaultValue={""} />
                </div>
                {/* Lượt xem */}
                <div className="mb-4">
                    <label htmlFor="view" className="block text-gray-700 font-bold mb-2">Lượt xem:</label>
                    <input type="number" name="view" id="view" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                {/* Danh mục */}
                <div className="mb-4">
                    <label htmlFor="category_id" className="block text-gray-700 font-bold mb-2">Danh mục:</label>
                    <input type="number" name="category_id" id="category_id" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                {/* Loại sản phẩm */}
                <div className="mb-4">
                    <label htmlFor="is_type" className="block text-gray-700 font-bold mb-2">Loại sản phẩm:</label>
                    <select name="is_type" id="is_type" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value={1}>Có</option>
                        <option value={0}>Không</option>
                    </select>
                </div>
                {/* Sản phẩm hot */}
                <div className="mb-4">
                    <label htmlFor="is_hot" className="block text-gray-700 font-bold mb-2">Sản phẩm hot:</label>
                    <select name="is_hot" id="is_hot" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value={1}>Có</option>
                        <option value={0}>Không</option>
                    </select>
                </div>
                {/* Hot Deal */}
                <div className="mb-4">
                    <label htmlFor="is_hot_deal" className="block text-gray-700 font-bold mb-2">Hot Deal:</label>
                    <select name="is_hot_deal" id="is_hot_deal" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value={1}>Có</option>
                        <option value={0}>Không</option>
                    </select>
                </div>
                {/* Sản phẩm mới */}
                <div className="mb-4">
                    <label htmlFor="is_new" className="block text-gray-700 font-bold mb-2">Sản phẩm mới:</label>
                    <select name="is_new" id="is_new" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value={1}>Có</option>
                        <option value={0}>Không</option>
                    </select>
                </div>
                {/* Hiển thị trên trang chủ */}
                <div className="mb-4">
                    <label htmlFor="is_show_home" className="block text-gray-700 font-bold mb-2">Hiển thị trên trang chủ:</label>
                    <select name="is_show_home" id="is_show_home" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value={1}>Có</option>
                        <option value={0}>Không</option>
                    </select>
                </div>
                {/* Nút gửi */}
                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                    Thêm Sản Phẩm
                </button>
            </form>
        </div>


    )
}

export default Addproduct
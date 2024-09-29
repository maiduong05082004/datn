import React from 'react'

const UpdateProduct = () => {
  return (
<div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
  <h3 className="text-2xl font-bold mb-6 text-center">Cập nhật phẩm mới</h3>
  {/* Thông tin sản phẩm */}
  <div className="bg-gray-100 p-6 rounded-md mb-6">
    <h4 className="text-lg font-medium mb-4">Thông tin sản phẩm</h4>
    <form className="space-y-6">
      {/* Slug */}
      <div className="mb-4 w-full">
        <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">Slug</label>
        <input
          type="text"
          id="slug"
          name="slug"
          maxLength={255}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Tên sản phẩm */}
      <div className="mb-4 w-full">
        <label htmlFor="name_product" className="block text-gray-700 font-medium mb-2">Tên sản phẩm</label>
        <input
          type="text"
          id="name_product"
          name="name_product"
          maxLength={255}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Giá sản phẩm */}
      <div className="mb-4 w-full">
        <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Giá sản phẩm</label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Số lượng sản phẩm */}
      <div className="mb-4 w-full">
        <label htmlFor="stock" className="block text-gray-700 font-medium mb-2">Số lượng trong kho</label>
        <input
          type="number"
          id="stock"
          name="stock"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Mô tả sản phẩm */}
      <div className="mb-4 w-full">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Mô tả</label>
        <input
          type="text"
          id="description"
          name="description"
          maxLength={255}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Nội dung chi tiết */}
      <div className="mb-4 w-full">
        <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Nội dung chi tiết</label>
        <textarea
          id="content"
          name="content"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>
      {/* Lượt xem */}
      <div className="mb-4 w-full">
        <label htmlFor="view" className="block text-gray-700 font-medium mb-2">Lượt xem</label>
        <input
          type="number"
          id="view"
          name="view"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Danh mục sản phẩm */}
      <div className="mb-4 w-full">
        <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2">ID danh mục</label>
        <input
          type="number"
          id="category_id"
          name="category_id"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Các loại checkbox */}
      <div className="grid grid-cols-2 gap-4">
        {/* Loại sản phẩm */}
        <div className="mb-4">
          <label htmlFor="is_type" className="block text-gray-700 font-medium mb-2">Loại sản phẩm</label>
          <input
            type="checkbox"
            id="is_type"
            name="is_type"
            className="h-5 w-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Sản phẩm hot */}
        <div className="mb-4">
          <label htmlFor="is_hot" className="block text-gray-700 font-medium mb-2">Sản phẩm hot</label>
          <input
            type="checkbox"
            id="is_hot"
            name="is_hot"
            className="h-5 w-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Hot deal */}
        <div className="mb-4">
          <label htmlFor="is_hot_deal" className="block text-gray-700 font-medium mb-2">Hot deal</label>
          <input
            type="checkbox"
            id="is_hot_deal"
            name="is_hot_deal"
            className="h-5 w-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Sản phẩm mới */}
        <div className="mb-4">
          <label htmlFor="is_new" className="block text-gray-700 font-medium mb-2">Sản phẩm mới</label>
          <input
            type="checkbox"
            id="is_new"
            name="is_new"
            className="h-5 w-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Hiển thị ở trang chủ */}
        <div className="mb-4">
          <label htmlFor="is_show_home" className="block text-gray-700 font-medium mb-2">Hiển thị trên trang chủ</label>
          <input
            type="checkbox"
            id="is_show_home"
            name="is_show_home"
            className="h-5 w-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      {/* Nút Lưu */}
      <div className="w-full">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Lưu thông tin
        </button>
      </div>
    </form>
  </div>
</div>

  )
}

export default UpdateProduct
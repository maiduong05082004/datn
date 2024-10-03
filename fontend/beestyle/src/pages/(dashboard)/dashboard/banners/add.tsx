import React from 'react'

type Props = {}

const AddBanners = (props: Props) => {
    return (
      <div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-6 text-center text-white-800">Thêm mới banners</h1>
  <form>
    <div className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
      <div className="bg-blue-100 p-4 rounded-t-lg">
        <h4 className="text-lg font-semibold text-blue-800">Thông tin banner</h4>
      </div>
      <div className="p-6 bg-gray-50">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium text-gray-700">Tiêu đề</label>
          <input type="text" name="title" id="title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
        </div>

        {/* Image Path */}
        <div className="mb-4">
          <label htmlFor="image_path" className="block font-medium text-gray-700">Đường dẫn hình ảnh</label>
          <input type="text" name="image_path" id="image_path" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
        </div>

        {/* Link */}
        <div className="mb-4">
          <label htmlFor="link" className="block font-medium text-gray-700">Liên kết</label>
          <input type="text" name="link" id="link" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
        </div>
      </div>
    </div>

    <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
      Thêm mới
    </button>
  </form>
</div>

      
    )
}

export default AddBanners
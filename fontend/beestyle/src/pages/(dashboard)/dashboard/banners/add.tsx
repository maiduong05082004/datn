import React from 'react'

type Props = {}

const AddBanners = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">Thêm mới Banner</h3>
        {/* Thông tin Banner */}
        <div className="bg-gray-100 p-6 rounded-md mb-6">
          <h4 className="text-lg font-medium mb-4">Thông tin Banner</h4>
          <form className="space-y-6">
            {/* Title */}
            <div className="mb-4 w-full">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Tiêu đề</label>
              <input
                type="text"
                id="title"
                name="title"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
      
            {/* Image Path */}
            <div className="mb-4 w-full">
              <label htmlFor="image_path" className="block text-gray-700 font-medium mb-2">Đường dẫn hình ảnh</label>
              <input
                type="text"
                id="image_path"
                name="image_path"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
      
            {/* Link */}
            <div className="mb-4 w-full">
              <label htmlFor="link" className="block text-gray-700 font-medium mb-2">Liên kết</label>
              <input
                type="text"
                id="link"
                name="link"
                maxLength={255}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
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

export default AddBanners
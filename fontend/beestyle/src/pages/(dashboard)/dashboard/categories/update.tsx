import React from 'react'

type Props = {}
const UpdateCategories = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h3 className="text-2xl font-bold mb-6 text-center">Cập nhật danh mục</h3>
            {/* Thông tin danh mục */}
            <div className="bg-gray-100 p-6 rounded-md mb-6">
                <h4 className="text-lg font-medium mb-4">Thông tin danh mục</h4>
                <form className="space-y-6">
                    {/* Name */}
                    <div className="mb-4 w-full">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Tên danh mục</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            maxLength={255}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Parent ID */}
                    <div className="mb-4 w-full">
                        <label htmlFor="parent_id" className="block text-gray-700 font-medium mb-2">Parent ID</label>
                        <input
                            type="number"
                            id="parent_id"
                            name="parent_id"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-4 w-full">
                        <label htmlFor="status" className="block text-gray-700 font-medium mb-2">Trạng thái</label>
                        <input
                            type="number"
                            id="status"
                            name="status"
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

export default UpdateCategories
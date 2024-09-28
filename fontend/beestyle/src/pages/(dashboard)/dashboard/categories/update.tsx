import React from 'react'

type Props = {}
const UpdateCategories = (props: Props) => {
    return (
        <form action="/submit" method="PUT" className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Update danh mục</h2>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Tên danh mục</label>
                <input type="text" name="name" id="name" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
            <div className="mb-4">
                <label htmlFor="parent_id" className="block text-gray-700 font-bold mb-2">Parent ID:</label>
                <input type="number" name="parent_id" id="parent_id" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Trạng thái</label>
                <input type="number" name="status" id="status" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Submit
            </button>
        </form>
    )
}

export default UpdateCategories
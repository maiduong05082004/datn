import React from 'react'

type Props = {}

const AddBanners = (props: Props) => {
    return (
        <form action="/submit" method="POST" className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Thêm mới Banners</h2>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                <input type="text" name="title" id="title" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
            <div className="mb-4">
                <label htmlFor="image_path" className="block text-gray-700 font-bold mb-2">Image Path:</label>
                <input type="text" name="image_path" id="image_path" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
            <div className="mb-4">
                <label htmlFor="link" className="block text-gray-700 font-bold mb-2">Link:</label>
                <input type="url" name="link" id="link" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={255} required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Submit
            </button>
        </form>
    )
}

export default AddBanners
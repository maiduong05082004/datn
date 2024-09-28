import React from 'react'

type Props = {}

const addUser = (props: Props) => {
    return (
        <form className="space-y-6 p-6 rounded-lg shadow-md">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">Tên sản phẩm:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">Mô tả:</label>
                <textarea
                    id="description"
                    name="description"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                    rows={4}
                ></textarea>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-900">Giá:</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                />
            </div>
            <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Thêm sản phẩm
            </button>
        </form>

    )
}

export default addUser
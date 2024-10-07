import React from 'react'

type Props = {}

const ListCategories = (props: Props) => {
  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Danh sách Danh mục</h3>
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-md mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-center">ID</th>
              <th className="py-3 px-4 text-center">Tên danh mục</th>
              <th className="py-3 px-4 text-center">Danh mục con</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 text-center text-black dark:text-white">1</td>
              <td className="py-3 px-4 text-center text-black dark:text-white">Danh mục 1</td>
              <td className="py-3 px-4 text-center text-black dark:text-white">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Danh mục con
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 text-center text-black dark:text-white">2</td>
              <td className="py-3 px-4 text-center text-black dark:text-white">Danh mục 2</td>
              <td className="py-3 px-4 text-center text-black dark:text-white">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Danh mục con
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default ListCategories;

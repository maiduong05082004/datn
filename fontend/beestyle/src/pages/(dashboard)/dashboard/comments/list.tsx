import React from 'react'

type Props = {}

const ListComments = (props: Props) => {
  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Danh sách bình luận</h3>
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-md mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Tên người dùng</th>
              <th className="py-3 px-4 text-left">Product ID</th>
              <th className="py-3 px-4 text-left">Nội dung bình luận</th>
              <th className="py-3 px-4 text-left">Ngày bình luận</th>
              <th className="py-3 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 text-black dark:text-white">fbdjfd</td>
              <td className="py-3 px-4 text-black dark:text-white">ABC</td>
              <td className="py-3 px-4 text-black dark:text-white">bhjsbaaff</td>
              <td className="py-3 px-4 text-black dark:text-white">28/09/2024</td>
              <td className="py-3 px-4">
                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200">
                  Xóa
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 text-black dark:text-white">vjvhb</td>
              <td className="py-3 px-4 text-black dark:text-white">DEF</td>
              <td className="py-3 px-4 text-black dark:text-white">Lorem ipsum comment...</td>
              <td className="py-3 px-4 text-black dark:text-white">29/09/2024</td>
              <td className="py-3 px-4">
                <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListComments
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd';
import axios from 'axios';
import React from 'react'

type Props = {}

const ListProducts = (props: Props) => {
  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Danh sách Sản phẩm</h3>
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-md mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Slug</th>
              <th className="py-3 px-4 text-left">Tên sản phẩm</th>
              <th className="py-3 px-4 text-left">Giá</th>
              <th className="py-3 px-4 text-left">Tồn kho</th>
              <th className="py-3 px-4 text-left">Mô tả</th>
              <th className="py-3 px-4 text-left">Nội dung</th>
              <th className="py-3 px-4 text-left">Lượt xem</th>
              <th className="py-3 px-4 text-left">ID danh mục</th>
              <th className="py-3 px-4 text-left">Loại sản phẩm</th>
              <th className="py-3 px-4 text-left">Sản phẩm hot</th>
              <th className="py-3 px-4 text-left">Hot deal</th>
              <th className="py-3 px-4 text-left">Sản phẩm mới</th>
              <th className="py-3 px-4 text-left">Hiển thị trang chủ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 text-black dark:text-white">1</td>
              <td className="py-3 px-4 text-black dark:text-white">slug-1</td>
              <td className="py-3 px-4 text-black dark:text-white">Sản phẩm 1</td>
              <td className="py-3 px-4 text-black dark:text-white">1000.00</td>
              <td className="py-3 px-4 text-black dark:text-white">50</td>
              <td className="py-3 px-4 text-black dark:text-white">Mô tả sản phẩm 1</td>
              <td className="py-3 px-4 text-black dark:text-white">Nội dung chi tiết sản phẩm 1...</td>
              <td className="py-3 px-4 text-black dark:text-white">500</td>
              <td className="py-3 px-4 text-black dark:text-white">123</td>
              <td className="py-3 px-4 text-black dark:text-white">1</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">1</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">0</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">1</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">1</td> {/* 1 = True, 0 = False */}
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 text-black dark:text-white">2</td>
              <td className="py-3 px-4 text-black dark:text-white">slug-2</td>
              <td className="py-3 px-4 text-black dark:text-white">Sản phẩm 2</td>
              <td className="py-3 px-4 text-black dark:text-white">2000.00</td>
              <td className="py-3 px-4 text-black dark:text-white">30</td>
              <td className="py-3 px-4 text-black dark:text-white">Mô tả sản phẩm 2</td>
              <td className="py-3 px-4 text-black dark:text-white">Nội dung chi tiết sản phẩm 2...</td>
              <td className="py-3 px-4 text-black dark:text-white">1000</td>
              <td className="py-3 px-4 text-black dark:text-white">124</td>
              <td className="py-3 px-4 text-black dark:text-white">0</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">0</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">1</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">0</td> {/* 1 = True, 0 = False */}
              <td className="py-3 px-4 text-black dark:text-white">0</td> {/* 1 = True, 0 = False */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>



  )
}

export default ListProducts
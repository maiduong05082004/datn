import React from 'react'

type Props = {}

const ListProducts = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">Danh sách Sản phẩm</h3>
        <div className="bg-gray-100 p-6 rounded-md mb-6">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-800 text-white">
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
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">slug-1</td>
                <td className="py-3 px-4">Sản phẩm 1</td>
                <td className="py-3 px-4">1000.00</td>
                <td className="py-3 px-4">50</td>
                <td className="py-3 px-4">Mô tả sản phẩm 1</td>
                <td className="py-3 px-4">Nội dung chi tiết sản phẩm 1...</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">123</td>
                <td className="py-3 px-4">1</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">1</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">0</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">1</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">1</td> {/* 1 = True, 0 = False */}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">slug-2</td>
                <td className="py-3 px-4">Sản phẩm 2</td>
                <td className="py-3 px-4">2000.00</td>
                <td className="py-3 px-4">30</td>
                <td className="py-3 px-4">Mô tả sản phẩm 2</td>
                <td className="py-3 px-4">Nội dung chi tiết sản phẩm 2...</td>
                <td className="py-3 px-4">1000</td>
                <td className="py-3 px-4">124</td>
                <td className="py-3 px-4">0</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">0</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">1</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">0</td> {/* 1 = True, 0 = False */}
                <td className="py-3 px-4">0</td> {/* 1 = True, 0 = False */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      

    )
}

export default ListProducts
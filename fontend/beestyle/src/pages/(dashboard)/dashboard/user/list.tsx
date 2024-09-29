import React from 'react'

type Props = {}

const ListUser = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">Danh sách Người dùng</h3>
        <div className="bg-gray-100 p-6 rounded-md mb-6">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên</th>
                <th className="py-3 px-4 text-left">Ngày sinh</th>
                <th className="py-3 px-4 text-left">Giới tính</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Mật khẩu</th>
                <th className="py-3 px-4 text-left">Nhà cung cấp</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Nguyễn Văn A</td>
                <td className="py-3 px-4">1990-01-01</td>
                <td className="py-3 px-4">male</td>
                <td className="py-3 px-4">nguyenvana@example.com</td>
                <td className="py-3 px-4">*******</td>
                <td className="py-3 px-4">Facebook</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">Trần Thị B</td>
                <td className="py-3 px-4">1985-02-15</td>
                <td className="py-3 px-4">female</td>
                <td className="py-3 px-4">tranthib@example.com</td>
                <td className="py-3 px-4">*******</td>
                <td className="py-3 px-4">Google</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      

    )
}

export default ListUser
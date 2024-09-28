import React from 'react'

type Props = {}

const ListUser = (props: Props) => {
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Danh sách người dùng</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Tên</th>
                        <th className="py-3 px-4 text-left">Ngày sinh</th>
                        <th className="py-3 px-4 text-left">Giới tính</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Mật khẩu</th>
                        <th className="py-3 px-4 text-left">Tên nhà cung cấp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">Nguyễn Văn A</td>
                        <td className="py-3 px-4">1/1/2000</td>
                        <td className="py-3 px-4">Nam</td>
                        <td className="py-3 px-4">vana@gmail.com</td>
                        <td className="py-3 px-4">12345678</td>
                        <td className="py-3 px-4">ABC</td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default ListUser
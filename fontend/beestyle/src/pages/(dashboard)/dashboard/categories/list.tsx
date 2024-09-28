import React from 'react'

type Props = {}
const ListCategories = (props: Props) => {
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Danh sách danh mục</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Tên danh mục</th>
                        <th className="py-3 px-4 text-left">Parent ID</th>
                        <th className="py-3 px-4 text-left">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                  
                    <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">Áo thun</td>
                        <td className="py-3 px-4">hhh</td>
                        <td className="py-3 px-4">Hoàn tất</td>
                    </tr>
                   
                </tbody>
            </table>
        </div>

    )
}

export default ListCategories
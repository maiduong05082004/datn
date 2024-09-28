import React from 'react'

type Props = {}

const ListComments = (props: Props) => {
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Danh sách bình luận</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">User ID</th>
                        <th className="py-3 px-4 text-left">Product ID</th>
                        <th className="py-3 px-4 text-left">Nội dung bình luận</th>
                        <th className="py-3 px-4 text-left">Ngày bình luận</th>
                    </tr>
                </thead>
                <tbody>
                    
                    <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">ABC</td>
                        <td className="py-3 px-4">bhjsbaaff</td>
                        <td className="py-3 px-4">28/09/2024</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>

    )
}

export default ListComments
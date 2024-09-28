import React from 'react'

type Props = {}


const ListBanners = (props: Props) => {
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">List Banners</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Tiêu đề</th>
                        <th className="py-3 px-4 text-left">Đường dẫn ảnh</th>
                        <th className="py-3 px-4 text-left">Liên kết</th>
                    </tr>
                </thead>
                <tbody>
                 
                    <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">AAA</td>
                        <td className="py-3 px-4">
                            <img src="<?php echo $item['image_path']; ?>" alt="<?php echo $item['title']; ?>" className="h-12" />
                        </td>
                        <td className="py-3 px-4">
                            <a href="<?php echo $item['link']; ?>" className="text-blue-500 hover:underline"></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default ListBanners
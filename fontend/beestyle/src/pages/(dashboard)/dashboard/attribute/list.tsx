import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

// Định nghĩa kiểu cho giá trị thuộc tính
type AttributeValue = {
    id: number;
    name: string;
    attribute_id: number; // ID của thuộc tính mà giá trị này thuộc về
};

// Hàm lấy dữ liệu từ API
const fetchAttributeValues = async (): Promise<AttributeValue[]> => {
    const response = await axios.get('http://127.0.0.1:8000/api/admins/attribute_values');
    return response.data;
};

const ListAttributeValues: React.FC = () => {
    const { data, error, isLoading, isError, refetch } = useQuery<AttributeValue[]>('attributeValues', fetchAttributeValues);

    if (isLoading) {
        return <div className="text-center">Đang tải...</div>;
    }

    if (isError) {
        return <div className="text-red-600 text-center">Đã xảy ra lỗi: {error instanceof Error ? error.message : 'Có lỗi không xác định'}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Danh sách Giá trị Thuộc tính</h2>
            {/* <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={refetch} // Gọi lại API khi nhấn nút
      >
        Tải lại
      </button> */}
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-center">ID</th>
                        <th className="py-3 px-4 text-center">Tên Giá Trị</th>
                        <th className="py-3 px-4 text-center">ID Thuộc Tính</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((attributeValue) => (
                        <tr key={attributeValue.id} className="border-b border-gray-200">
                            <td className="py-3 px-4 text-center">{attributeValue.id}</td>
                            <td className="py-3 px-4 text-center">{attributeValue.name}</td>
                            <td className="py-3 px-4 text-center">{attributeValue.attribute_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAttributeValues;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'antd'; // Sử dụng Modal và Button từ Ant Design

type Value = {
    id: number;
    value: string;
};

type Attribute = {
    attribute_id: number;
    attribute_name: string;
    attribute_type: number;
    values: Value[];
};

type AttributesResponse = {
    [key: string]: Attribute;
};

const deleteAttribute = async ({ attributeId, valueId }: { attributeId: number; valueId?: number }): Promise<void> => {
    if (valueId) {
        await axios.delete(`http://127.0.0.1:8000/api/admins/attributes/${attributeId}`, {
            data: {
                values: [{ id: valueId }],
            },
        });
    } else {
        await axios.delete(`http://127.0.0.1:8000/api/admins/attributes/${attributeId}`);
    }
};

const fetchAttributes = async (): Promise<AttributesResponse> => {
    const response = await axios.get('http://127.0.0.1:8000/api/admins/attribute_values');
    return response.data;
};

const ListAttributeValues: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { data, error, isLoading, isError } = useQuery<AttributesResponse>('attributes', fetchAttributes);
    const [notification, setNotification] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Thay visible bằng isModalOpen
    const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null); // Lưu thuộc tính đã chọn

    const mutation = useMutation(deleteAttribute, {
        onSuccess: () => {
            queryClient.invalidateQueries('attributes');
            setNotification('Đã xóa thuộc tính thành công!');
            setTimeout(() => setNotification(null), 3000);
        },
        onError: (error: Error) => {
            alert(`Có lỗi xảy ra khi xóa thuộc tính: ${error.message}`);
        },
    });

    const handleEdit = (attributeId: number) => {
        // Ví dụ khi bạn điều hướng từ danh sách
        navigate(`/admin/updateAttribute/${attributeId}`);

    };

    const handleDelete = (attributeId: number, valueId?: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục này không?')) {
            mutation.mutate({ attributeId, valueId });
        }
    };

    const handleViewDetails = (attribute: Attribute) => {
        setSelectedAttribute(attribute); // Lưu thuộc tính đã chọn
        setIsModalOpen(true); // Mở modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Đóng modal
    };

    const handleAddNew = () => {
        navigate('/admin/addAttributes'); // Điều hướng đến trang thêm mới
    };

    useEffect(() => {
        queryClient.invalidateQueries('attributes');
    }, [location.key]);

    if (isLoading) {
        return <div className="text-center">Đang tải...</div>;
    }

    if (isError) {
        return <div className="text-red-600 text-center">Đã xảy ra lỗi: {error instanceof Error ? error.message : 'Có lỗi không xác định'}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl text-center font-bold mb-8">Danh sách Giá trị Thuộc tính</h2>
            {notification && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-800 p-4 rounded-md text-center mb-4 z-50">
                    {notification}
                </div>
            )}

            {/* Nút Thêm Mới */}
            <div className="flex justify-end mb-4">
                <Button type="primary" onClick={handleAddNew}>
                    Thêm Mới
                </Button>
            </div>

            <table className="min-w-full bg-white border rounded-lg shadow-md mt-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border-b py-3 px-4 text-center">STT</th>
                        <th className="border-b py-3 px-4 text-center">ID</th>
                        <th className="border-b py-3 px-4 text-left">Tên sản phẩm</th>
                        <th className="border-b py-3 px-4 text-left">Mô tả</th>
                        <th className="border-b py-3 px-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data && Object.values(data).map((attribute, index) => (
                        <React.Fragment key={attribute.attribute_id}>
                            <tr className="border-b">
                                <td className="py-3 px-4 text-center">{index + 1}</td>
                                <td className="py-3 px-4 text-center">{attribute.attribute_id}</td>
                                <td className="py-3 px-4 text-left">{attribute.attribute_name}</td>
                                <td className="py-3 px-4 text-left">
                                    <button
                                        onClick={() => handleViewDetails(attribute)} // Gọi hàm khi nhấn "Xem chi tiết"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleEdit(attribute.attribute_id)}
                                        className="ml-2 bg-white border border-blue-500 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-50"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(attribute.attribute_id)}
                                        className="ml-2 bg-white border border-red-500 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-4">
                <nav className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-md focus:outline-none">
                        1
                    </button>
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </nav>
            </div>

            {/* Modal hiển thị chi tiết */}
            {selectedAttribute && (
                <Modal
                    title={`Chi tiết thuộc tính: ${selectedAttribute.attribute_name}`}
                    open={isModalOpen} // Thay visible bằng open
                    onCancel={handleCloseModal}
                    footer={[
                        <Button key="close" onClick={handleCloseModal}>
                            Đóng
                        </Button>,
                    ]}
                >
                    <p><strong>ID:</strong> {selectedAttribute.attribute_id}</p>
                    <p><strong>Loại thuộc tính:</strong> {selectedAttribute.attribute_type}</p>
                    <p><strong>Giá trị:</strong></p>
                    <ul>
                        {selectedAttribute.values.map((value) => (
                            <li key={value.id}>{value.value}</li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
    );
};
export default ListAttributeValues;

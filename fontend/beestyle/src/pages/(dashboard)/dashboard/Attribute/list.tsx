import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Button, message, Modal, Popconfirm, Spin, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircleFilled, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

type AttributeValue = {
    value_id: number;
    value: string;
};

type AttributeWithValues = {
    attribute_id: number;
    attribute_name: string;
    attribute_type: number;
    values: AttributeValue[];
};

type Attribute = {
    id: number;
    name: string;
};

const ListAttribute: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState<AttributeWithValues | null>(null);

    const { data: attributes = [], isLoading, error } = useQuery({
        queryKey: ['attributes'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attributes');
            return response.data.data || [];
        },
    });

    const { data: attributeValues = [] } = useQuery({
        queryKey: ['attributesvalue'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attribute_values');
            return response.data || [];
        },
    });

    const deleteAttributeMutation = useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/attributes/${id}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa thuộc tính thành công');
            queryClient.invalidateQueries({
                queryKey: ['attributes'],
            })
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.message}`);
        },
    });

    const deleteAttributeValueMutation = useMutation({
        mutationFn: async (valueId: number) => {
            await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/attribute_values/${valueId}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa giá trị thành công');
            queryClient.invalidateQueries({
                queryKey: ['attributesWithValues'],
            })
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.message}`);
        },
    });

    // Xử lý sự kiện "Xem chi tiết"
    const handleViewDetails = (attribute: Attribute) => {
        const attributeDetail = attributeValues.find(
            (attr: AttributeWithValues) => attr.attribute_id === attribute.id
        );
        setSelectedAttribute(attributeDetail || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAttribute(null);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
        },
        {
            title: 'Tên thuộc tính',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (attribute: Attribute) => (
                <div className="flex space-x-2">
                    <Button
                        icon={<EyeOutlined />}
                        className="bg-blue-400 text-white hover:bg-gray-800"
                        onClick={() => handleViewDetails(attribute)}
                    />
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        className="bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={() => navigate(`/admin/attribute/update/${attribute.id}`)}
                    />
                    <Popconfirm
                        title="Xóa thuộc tính"
                        description="Bạn có chắc muốn xóa thuộc tính này không?"
                        onConfirm={() => deleteAttributeMutation.mutate(attribute.id)}
                        okText="Yes"
                        cancelText="No"
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    }

    if (error) {
        return <div className="text-center text-red-500">Không thể tải dữ liệu</div>;
    }

    return (
        <>
            {contextHolder}
            <div className="w-full mx-auto px-5 py-8">
                <div className="flex gap-5 items-center mb-6">
                    <Button
                        type="default"
                        icon={<PlusCircleFilled />}
                    >
                        <Link to={`/admin/attribute/add`}>Thêm Attribute</Link>
                    </Button>
                    <Button
                        type="default"
                        icon={<PlusCircleFilled />}
                    >
                        <Link to={`/admin/attribute_value/add`}>Thêm Giá Trị Attribute</Link>
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={attributes}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 7,
                        showTotal: (total) => `Tổng ${total} danh mục`,
                    }}
                />
            </div>

            <Modal
                title={`Chi tiết thuộc tính: ${selectedAttribute?.attribute_name}`}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedAttribute && (
                    <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl text-white mb-8">
                        <h2 className="text-3xl font-bold mb-6 border-b border-white/30 pb-3">
                            Thông tin Thuộc Tính
                        </h2>
                        <h3 className="text-xl font-semibold mt-6">Giá trị:</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                            {selectedAttribute.values.map((value) => (
                                <div
                                    key={value.value_id}
                                    className="relative border border-gray-100 bg-white text-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
                                >
                                    <p className="text-xl font-semibold text-gray-800">{value.value}</p>

                                    <div className="flex justify-between items-center mt-6">
                                        <Button
                                            type="default"
                                            icon={<EditOutlined />}
                                            className="text-blue-500 hover:text-blue-600 transition-colors"
                                            onClick={() => navigate(`/admin/attribute_value/update/${value.value_id}`)}
                                        />
                                        <Popconfirm
                                            title="Xóa giá trị"
                                            description="Bạn có chắc muốn xóa giá trị này không?"
                                            onConfirm={() => deleteAttributeValueMutation.mutate(value.value_id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="default"
                                                danger
                                                icon={<DeleteOutlined />}
                                                className="text-red-500 hover:text-red-600 transition-colors"
                                            />
                                        </Popconfirm>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                )}
            </Modal>
        </>
    );
};

export default ListAttribute;

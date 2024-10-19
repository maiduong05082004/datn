import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
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

const ListAttribute: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState<AttributeWithValues | null>(null);

    // Fetch attributes and their values
    const { data: attributes = [], isLoading, error } = useQuery({
        queryKey: ['attributesWithValues'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/admins/attribute_values');
            return response.data;
        },
    });

    const deleteAttributeMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`http://127.0.0.1:8000/api/admins/attributes/${id}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa thuộc tính thành công');
            queryClient.invalidateQueries({
                queryKey: ['attributesWithValues'],
            })
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.message}`);
        },
    });

    const deleteAttributeValueMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`http://127.0.0.1:8000/api/admins/attribute_values/${id}`);
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

    const handleViewDetails = (attribute: AttributeWithValues) => {
        setSelectedAttribute(attribute);
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
            dataIndex: 'attribute_name',
            key: 'attribute_name',
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (attribute: AttributeWithValues) => (
                <div className="flex space-x-2">
                    <Button
                        icon={<EyeOutlined />}
                        className="bg-blue-400 text-white hover:bg-gray-800"
                        onClick={() => handleViewDetails(attribute)}
                    />
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/updateattribute/${attribute.attribute_id}`)}
                    />
                    <Popconfirm
                        title="Xóa thuộc tính"
                        description="Bạn có chắc muốn xóa thuộc tính này không?"
                        onConfirm={() => deleteAttributeMutation.mutate(attribute.attribute_id)}
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
            <div className="w-full mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" type="primary" icon={<PlusCircleFilled />}>
                        <Link to={`/admin/addattribute_value`}>Thêm giá trị</Link>
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={attributes}
                    rowKey="attribute_id"
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
                    <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg text-white mb-6">
                        <h2 className="text-xl font-bold mb-2">Thông tin Thuộc Tính</h2>
                        <h3 className="font-semibold text-lg mt-4">Giá trị:</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {selectedAttribute.values.map((value) => (
                                <div
                                    key={value.value_id}
                                    className="border rounded-lg p-3 bg-white text-black shadow-sm hover:shadow-md transition relative"
                                >
                                    <p className="text-gray-900">{value.value}</p>
                                    <div className="flex justify-center space-x-4 mt-4">
                                        <Button
                                            type="link"
                                            icon={<EditOutlined />}
                                            onClick={() => navigate(`/admin/updateattribute_value/${value.value_id}`)}
                                            className="text-blue-500 hover:text-blue-700 hover:underline focus:outline-none"
                                        />
                                        <Popconfirm
                                            title="Xóa giá trị"
                                            description="Bạn có chắc muốn xóa giá trị này không?"
                                            onConfirm={() => deleteAttributeValueMutation.mutate(value.value_id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                className="text-red-500 hover:text-red-700 transition-all duration-300 focus:outline-none"
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

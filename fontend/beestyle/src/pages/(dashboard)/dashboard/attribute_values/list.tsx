import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, message, Modal, Popconfirm, Spin, Table } from 'antd';
import { Link } from 'react-router-dom';
import { PlusCircleFilled, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
};

type AttributeValue = {
    id: number;
    value: string;
};

type AttributeWithValues = {
    attribute_id: number;
    attribute_name: string;
    attribute_type: number;
    values: AttributeValue[];
};

const ListAttribute = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState<AttributeWithValues | null>(null);

    const { data: attributes, isLoading, error } = useQuery({
        queryKey: ['attributes'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');
            return response.data.data;
        },
    });

    const { data: attributeValues } = useQuery({
        queryKey: ['attributeValues'],
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
                queryKey: ['attributes'],
            })
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.message}`);
        },
    });

    const deleteAttributeValueMutation = useMutation({
        mutationFn: async (idvalue: number) => {
            await axios.delete(`http://127.0.0.1:8000/api/admins/attribute_values/${idvalue}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa giá trị thành công');
            queryClient.invalidateQueries({
                queryKey: ['attributeValues'],
            })
        },
        onError: () => {
            throw new Error
        },
    });


    const handleViewDetails = (attribute: Attribute) => {
        const attributeDetail = attributeValues[attribute.id];
        setSelectedAttribute(attributeDetail);
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
            render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
        },
        {
            title: 'Tên thuộc tính',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Loại',
            dataIndex: 'attribute_type',
            key: 'attribute_type',
        },
        {
            title: 'Action',
            key: 'action',
            render: (attribute: Attribute) => (
                <div className="flex space-x-2">
                    <Button
                        icon={<EyeOutlined />}
                        className="bg-black text-white hover:bg-gray-800"
                        onClick={() => handleViewDetails(attribute)}
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

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    if (error) return <div className="text-center text-red-500">Không thể tải dữ liệu</div>;

    return (
        <>
            {contextHolder}
            <div className="w-full mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Button type="primary" icon={<PlusCircleFilled />}>
                        <Link to={`/admin/addattribute`} className="text-white">
                            Thêm thuộc tính
                        </Link>
                    </Button>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={attributes}
                        rowKey="id"
                        pagination={{
                            pageSize: 7,
                            showTotal: (total) => `Tổng ${total} danh mục`,
                        }}
                    />
                </div>
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
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className="text-lg">
                                    <span className="font-semibold">Loại: </span>
                                    {selectedAttribute.attribute_type === 0
                                        ? 'Màu sắc'
                                        : selectedAttribute.attribute_type === 1
                                            ? 'Kích thước'
                                            : 'Khác'}
                                </p>
                            </div>
                            <div className="text-4xl">
                                {selectedAttribute.attribute_type === 0 ? (
                                    <span role="img" aria-label="Color">
                                        🎨
                                    </span>
                                ) : (
                                    <span role="img" aria-label="Size">
                                        📏
                                    </span>
                                )}
                            </div>
                        </div>

                        <h3 className="font-semibold text-lg mt-4">Giá trị:</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {selectedAttribute.values.map((value : any) => (
                                <div
                                    key={value.id}
                                    className="border rounded-lg p-3 bg-white text-black shadow-sm hover:shadow-md transition relative"
                                >
                                    <p className="text-gray-900">{value.value}</p>
                                    <Popconfirm
                                        title="Xóa giá trị"
                                        description="Bạn có chắc muốn xóa giá trị này không?"
                                        onConfirm={() => deleteAttributeValueMutation.mutate(value.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            className="absolute top-2 right-2"
                                        />
                                    </Popconfirm>
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

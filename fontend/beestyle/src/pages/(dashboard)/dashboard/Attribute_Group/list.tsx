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

type AttributeGroup = {
    group_id: number;
    group_name: string;
    attributes: AttributeWithValues[];
};

const ListAttributeGroup: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<AttributeGroup | null>(null);

    // Lấy danh sách nhóm thuộc tính
    const { data: attributeGroups = [], isLoading, error } = useQuery({
        queryKey: ['attribute_groups'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/admins/attribute_groups');
            return response.data?.variation || [];
        },
    });

    // Xóa nhóm thuộc tính
    const deleteAttributeGroupMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa nhóm thuộc tính thành công');
            queryClient.invalidateQueries({ queryKey: ['attribute_groups'] });
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.message}`);
        },
    });

    // Xử lý sự kiện "Xem chi tiết"
    const handleViewDetails = (group: AttributeGroup) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGroup(null);
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
            title: 'Tên nhóm thuộc tính',
            dataIndex: 'group_name',
            key: 'group_name',
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            render: (group: AttributeGroup) => (
                <div className="flex space-x-2">
                    <Button
                        icon={<EyeOutlined />}
                        className="bg-blue-400 text-white hover:bg-gray-800"
                        onClick={() => handleViewDetails(group)}
                    />
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/attribute_group/update/${group.group_id}`)}
                    />
                    <Popconfirm
                        title="Xóa nhóm thuộc tính"
                        description="Bạn có chắc muốn xóa nhóm thuộc tính này không?"
                        onConfirm={() => deleteAttributeGroupMutation.mutate(group.group_id)}
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
                <div className="flex gap-5 items-center mb-6">
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        type="primary"
                        icon={<PlusCircleFilled />}
                    >
                        <Link to={`/admin/attribute_group/add`}>Thêm Nhóm Thuộc Tính</Link>
                    </Button>
                   
                </div>

                <Table
                    columns={columns}
                    dataSource={attributeGroups}
                    rowKey="group_id"
                    bordered
                    pagination={{
                        pageSize: 7,
                        showTotal: (total) => `Tổng ${total} nhóm thuộc tính`,
                    }}
                />
            </div>

            <Modal
                title={`Chi tiết nhóm thuộc tính: ${selectedGroup?.group_name}`}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedGroup && (
                    <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl text-white mb-8">
                        <h2 className="text-3xl font-bold mb-6 border-b border-white/30 pb-3">
                            Thông tin Nhóm Thuộc Tính: {selectedGroup.group_name}
                        </h2>
                        <h3 className="text-xl font-semibold mt-6">Danh sách thuộc tính:</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                            {selectedGroup.attributes.map((attribute) => (
                                <div
                                    key={attribute.attribute_id}
                                    className="relative border border-gray-100 bg-white text-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
                                >
                                    <p className="text-xl font-semibold text-gray-800">{attribute.attribute_name}</p>

                                    <div className="flex justify-between items-center mt-6">
                                        <Button
                                            type="default"
                                            icon={<EditOutlined />}
                                            className="text-blue-500 hover:text-blue-600 transition-colors"
                                            onClick={() => navigate(`/admin/attribute/update/${attribute.attribute_id}`)}
                                        />
                                        <Popconfirm
                                            title="Xóa thuộc tính"
                                            description="Bạn có chắc muốn xóa thuộc tính này không?"
                                            onConfirm={() => deleteAttributeGroupMutation.mutate(attribute.attribute_id)}
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

export default ListAttributeGroup;

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Button, message, Modal, Popconfirm, Spin, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircleFilled, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { toast, ToastContainer } from 'react-toastify';

type AttributeValue = {
    value_id: number;
    value: string;
    image_path: string;
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
            toast.success('Xóa Thuộc Tính Thành Công')
            queryClient.invalidateQueries({
                queryKey: ['attributes'],
            })

        },
        onError: () => {
            toast.error('Xóa Thuộc Tính Thất Bại')

        },
    });

    const deleteAttributeValueMutation = useMutation({
        mutationFn: async (valueId: number) => {
            await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/attribute_values/${valueId}`);
        },
        onSuccess: () => {
            toast.success('Xóa Giá Trị Thuộc Tính Thành Công')
            queryClient.invalidateQueries({
                queryKey: ['attributesvalue'],
            })
        },
        onError: () => {
            toast.success('Xóa Giá Trị Thuộc Tính Thất Bại!')
        },
    });

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

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: "50px",
            align: 'center',
            render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
        },
        {
            title: 'Tên thuộc tính',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Hành Động',
            key: 'action',
            align: 'center',
            width: "50px",
            render: (attribute: Attribute) => (
                <div className="flex justify-center gap-2">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(attribute)}
                    />
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/dashboard/attribute/update/${attribute.id}`)}
                    />
                    <Popconfirm
                        title="Xóa thuộc tính"
                        description="Bạn có chắc muốn xóa thuộc tính này không?"
                        onConfirm={() => deleteAttributeMutation.mutate(attribute.id)}
                        okText="Yes"
                        cancelText="No"
                        icon={<DeleteOutlined
                        />}
                    >
                        <Button type="default" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const dataSource = selectedAttribute?.values.map((value, index) => ({
        key: value.value_id,
        stt: index + 1,
        value: value.value,
        image_path: value.image_path,
        value_id: value.value_id,
    }));
    const columns2: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            width: "50px",
            align: 'center'
        },
        {
            title: 'Giá Trị',
            dataIndex: 'value',
            key: 'value',
        },
        ...(selectedAttribute?.attribute_id == 9 ? [{
            title: 'Ảnh Màu Sắc',
            dataIndex: 'image_path',
            key: 'image_path',
            render: (image_path: any) => (
                <div className="flex justify-center items-center">
                    {image_path ? (
                        <img
                            src={image_path}
                            alt="Attribute"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
            ),
        }] : []),
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: "50px",
            render: (text: any, record: any) => (
                <div className="flex justify-center gap-4">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        className="rounded-full"
                        onClick={() =>
                            navigate(
                                `/admin/dashboard/attribute_value/update/${record.value_id}`
                            )
                        }
                    />
                    <Popconfirm
                        title="Xóa giá trị"
                        description="Bạn có chắc muốn xóa giá trị này không?"
                        onConfirm={() =>
                            deleteAttributeValueMutation.mutate(
                                record.value_id
                            )
                        }
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="default"
                            danger
                            icon={<DeleteOutlined />}
                            className="rounded-full"
                        />
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
            <ToastContainer />
            <div className="w-full mx-auto px-5 py-8">
                <div className="flex gap-5 items-center mb-6">
                    <Button
                        type="default"
                        icon={<PlusCircleFilled />}
                    >
                        <Link to={`/admin/dashboard/attribute/add`}>Thêm Thuộc Tính</Link>
                    </Button>
                    <Button
                        type="default"
                        icon={<PlusCircleFilled />}
                    >
                        <Link to={`/admin/dashboard/attribute_value/add`}>Thêm Giá Trị Thuộc Tính</Link>
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
                centered
                width={'50%'}
            >
                {selectedAttribute && (
                    <div className="bg-slate-200 p-5">
                        <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-3">
                            Thông tin Thuộc Tính
                        </h2>
                        <h3 className="text-xl font-semibold mt-6">Giá trị:</h3>

                        {/* Table Layout */}
                        <div className="overflow-x-auto mt-6">
                            <Table
                                dataSource={dataSource}
                                columns={columns2}
                                rowKey="key"
                                bordered
                                pagination={false}
                            />
                        </div>
                    </div>
                )}

            </Modal>
        </>
    );
};

export default ListAttribute;

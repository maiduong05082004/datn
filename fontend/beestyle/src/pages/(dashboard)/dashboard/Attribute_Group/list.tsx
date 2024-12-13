import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Table } from 'antd';
import instance from '@/configs/axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { toast, ToastContainer } from 'react-toastify';

type Props = {};

const ListAttributeGroup = (props: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: attributeGroups, isLoading } = useQuery({
        queryKey: ['attribute_group'],
        queryFn: async () => {
            const response = await instance.get('api/admins/attribute_groups');
            return response?.data?.variation;
        },
    });

    const mutation = useMutation({
        mutationFn: async (id: any) => {
            return await instance.delete(`api/admins/attribute_groups/${id}`);
        },
        onSuccess: () => {
            toast.success('Xóa Nhóm Thuộc Tính Thành Công');
            queryClient.invalidateQueries({ queryKey: ['attribute_group'] });
        },
        onError: () => {
            toast.error('Xóa Nhóm Thuộc Tính Thất Bại');
        }
    });

    const dataSource = attributeGroups ? attributeGroups.map((group: any, index: number) => ({
        key: group.group_id,
        stt: index + 1,
        id: group.group_id,
        name: group.group_name,
        attributes: group.attributes,
    })) : [];

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',
            width: "50px",
        },
        {
            title: 'Tên nhóm thuộc tính',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: "250px",
        },
        {
            title: 'Thuộc tính và Giá trị',
            key: 'attributes',
            render: (record) => (
                <div className="space-y-3">
                    {record.attributes.map((attr: any, index: number) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-2">
                                <span className="font-semibold text-gray-800 mr-2">{attr.name}:</span>
                                <span className="text-sm text-gray-600">({attr.attribute_values.length} giá trị)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {attr.attribute_values.map((value: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2 items-center bg-white border rounded px-2 py-1 text-sm text-gray-700 
                        hover:bg-blue-50 hover:border-blue-200 
                        transition-colors duration-200 text-center"
                                    >
                                        {value.image_path ? (
                                            <img src={value.image_path} alt={value.value} className="w-8 h-8 rounded-full mb-1" />
                                        ) : null}
                                        <span>{value.value}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Hành Động',
            align: 'center',
            key: 'action',
            width: "150px",
            render: (attribute_group: any) => (
                <div className="flex space-x-4 justify-center">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/dashboard/attribute_group/update/${attribute_group.id}`)}
                    />
                    <Popconfirm
                        title="Xóa nhóm thuộc tính"
                        description="Bạn có chắc muốn xóa nhóm thuộc tính này không?"
                        onConfirm={() => mutation.mutate(attribute_group.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            type="default"
                            danger
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="list-attribute-group-container w-full mx-auto p-5">
            <ToastContainer />
            <Button
                icon={<PlusOutlined />}
                type="default"
                onClick={() => navigate('/admin/dashboard/attribute_group/add')}
            >
                Thêm mới
            </Button>
            <Table
                className='pt-5'
                dataSource={dataSource}
                columns={columns}
                loading={isLoading}
                pagination={{
                    pageSize: 5,
                    showTotal: (total) => `Tổng ${total} nhóm thuộc tính`,
                    className: 'text-gray-600',
                }}
                bordered
            />
        </div>
    );
};

export default ListAttributeGroup;
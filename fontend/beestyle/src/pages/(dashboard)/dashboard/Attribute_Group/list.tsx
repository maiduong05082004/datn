import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Table } from 'antd';
import axiosInstance from '@/configs/axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

const ListAttributeGroup = (props: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: attributeGroups, isLoading } = useQuery({
        queryKey: ['attribute_group'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attribute_groups');
            return response?.data?.variation;
        },
    });
    const mutation = useMutation({
        mutationFn: async (id: any) => {
            return await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa nhóm thuộc tính thành công');
            queryClient.invalidateQueries({ queryKey: ['attribute_group'] });
        },
        onError: () => {
            messageApi.error('Xóa nhóm thuộc tính thất bại');
        }
    })

    const dataSource = attributeGroups ? attributeGroups.map((group: any, index: number) => ({
        key: group.group_id,
        stt: index + 1,
        id: group.group_id,
        name: group.group_name,
        attributes: group.attributes,
    })) : [];

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Tên nhóm thuộc tính',
            dataIndex: 'name',
            key: 'name',
            className: 'text-left text-lg font-semibold text-blue-700 p-3',
        },
        {
            title: 'Action',
            key: 'action',
            render: (attribute_group: any) => (
                <div className="flex space-x-4 justify-center">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        className="bg-yellow-400 text-white hover:bg-yellow-500 rounded-lg px-4 py-2 shadow-md"
                        onClick={() => navigate(`/admin/attribute_group/update/${attribute_group.id}`)}
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
                            type="primary"
                            danger
                            className="bg-red-400 text-white hover:bg-red-500 rounded-lg px-4 py-2 shadow-md"
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const expandedRowRender = (record : any) => {
        return (
            <div className="space-y-6 px-5 py-3">
                {record.attributes.map((attr : any, index : any) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                    >
                        <strong className="text-blue-700 text-lg">{attr.name}:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {attr.attribute_values.map((value : any, idx : any) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm font-medium shadow-sm"
                                >
                                    {value.value}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    

    return (
        <div className="list-attribute-group-container w-full mx-auto px-6 py-8 bg-gray-50">
            {contextHolder}
            <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 mb-6 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => navigate('/admin/attribute_group/add')}
            >
                Thêm mới
            </Button>
            <Table
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                dataSource={dataSource}
                columns={columns}
                loading={isLoading}
                pagination={{
                    pageSize: 5,
                    showTotal: (total) => `Tổng ${total} nhóm thuộc tính`,
                    className: 'text-gray-600',
                }}
                bordered
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.attributes.length > 0,
                }}
            />
        </div>
    );
};

export default ListAttributeGroup;

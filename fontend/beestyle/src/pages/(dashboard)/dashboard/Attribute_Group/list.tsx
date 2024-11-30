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
            className: 'w-12',
        },
        {
            title: 'Tên nhóm thuộc tính',
            dataIndex: 'name',
            key: 'name',
            className: 'text-left text-lg font-semibold p-3',
        },
        {
            title: 'Action',
            width: 200,

            key: 'action',
            render: (attribute_group: any) => (
                <div className="flex space-x-4 justify-center">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        className=' hover:bg-gray-200 transition duration-300 ease-in-out'
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
                            className='hover:bg-gray-200 transition duration-300 ease-in-out'
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const expandedRowRender = (record: any) => {
        return (
            <div className="space-y-6 px-5 py-3">
                {record.attributes.map((attr: any, index: any) => (
                    <div
                        key={index}
                        className="p-5 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <strong className="text-lg text-gray-800">{attr.name}:</strong>
                        </div>
                        <div className="overflow-hidden">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attr.attribute_values.map((value: any, idx: any) => (
                                        <tr
                                            key={idx}
                                            className="border-b hover:bg-gray-50 transition-colors duration-300 ease-in-out"
                                        >
                                            <td className="px-4 py-2 text-sm text-gray-700">{value.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    


    return (
        <div className="list-attribute-group-container w-full mx-auto p-5">
            {contextHolder}
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
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.attributes.length > 0,
                }}
            />
        </div>
    );
};

export default ListAttributeGroup;

import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Popconfirm, Table } from 'antd';
import axios from 'axios';
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
            const response = await axios.get('http://127.0.0.1:8000/api/admins/attribute_groups');
            return response?.data?.variation;
        },
    });
    const mutation = useMutation({
        mutationFn: async (id: any) => {
            return await axios.delete(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`);
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
            className: 'text-center font-bold text-gray-700 bg-gray-100 p-3',
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
                        type="link"
                        icon={<EyeOutlined />}
                        className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 shadow-md"
                        onClick={() => navigate(`/admin/attribuite_group/detail/${attribute_group.id}`)}
                    />
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        className="bg-yellow-400 text-white hover:bg-yellow-500 rounded-lg px-4 py-2 shadow-md"
                        onClick={() => navigate(`/admin/products/update/${attribute_group.id}`)}
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

    const expandedRowRender = (record: any) => {
        return (
            <div className="space-y-7 px-4">
                {record.attributes.map((attr: any, index: number) => (
                    <div key={index} className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                        <strong className="text-indigo-800 text-base">{attr.name}:</strong>
                        <div className="flex flex-wrap gap-3 mt-3">
                            {attr.attribute_values.map((value: any, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold shadow-sm"
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

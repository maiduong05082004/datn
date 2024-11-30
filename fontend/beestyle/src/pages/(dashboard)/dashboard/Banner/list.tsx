import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Popconfirm, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';

type Banner = {
    id: number;
    category_id: number;
    title: string;
    image_path: string;
    link: string | null;
    type: string | null;
    status: number;
};

const ListBannersMain: React.FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const { data: BannerData, isLoading } = useQuery({
        queryKey: ['banners'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/banners');
            return response.data;
        },
    });

    const { data: categoryData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
            return response.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            return await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/banners/${id}`);
        },
        onSuccess: () => {
            messageApi.success('Xóa banner thành công');
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
        onError: () => {
            messageApi.error('Xóa banner thất bại');
        }
    });

    const categoryMap = categoryData?.reduce((map: Record<number, string>, category: any) => {
        map[category.id] = category.name;
        return map;
    }, {});

    // Lọc banners chỉ có type === 'main'
    const dataSource = BannerData?.filter((item: Banner) => item.type === 'main').map((item: Banner, index: number) => ({
        key: item.id,
        stt: index + 1,
        ...item,
        categoryName: categoryMap?.[item.category_id] || 'Không có',
        typeLabel: 'Ảnh chính', // Chỉ hiển thị loại main nên gán trực tiếp
    }));

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string | null) => text || 'Không có',
        },
        {
            title: 'Image',
            dataIndex: 'image_path',
            key: 'image_path',
            render: (text: string) => (
                <img src={text} alt="banner" style={{ width: 100, height: 50, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (text: string | null) =>
                text ? (
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                ) : (
                    'Không có'
                ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (status === 1 ? 'Hoạt động' : 'Không hoạt động'),
        },
        {
            title: 'Action',
            key: 'actions',
            render: (_: any, record: Banner) => (
                <Space size="middle">
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/dashboard/banner/detail/${record.id}`)}
                    />
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/dashboard/banner/update/${record.id}`)}
                    />
                    <Popconfirm
                        title="Bạn có muốn xóa banner này không?"
                        onConfirm={() => mutation.mutate(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="default" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isLoading)
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    return (
        <div className="w-full mx-auto items-center justify-center p-5">
            {contextHolder}
            <div className="flex justify-between items-center mb-6">
                <Button
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/dashboard/banner/add')}
                >
                    Thêm Banners
                </Button>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(record) => record.id.toString()}
                bordered
                pagination={{
                    pageSize: 7,
                    showTotal: (total) => `Tổng ${total} banner`,
                    className: 'text-gray-600',
                }}
            />
        </div>
    );
};

export default ListBannersMain;

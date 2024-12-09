import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Popconfirm, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { toast, ToastContainer } from 'react-toastify';

type Banner = {
    id: number;
    category_id: number;
    title: string;
    image_path: string;
    link: string | null;
    type: string | null;
    status: number;
};

const ListBannersCategory: React.FC = () => {
    const navigate = useNavigate();
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

    const buildCategoryMap = (categories: any[]) => {
        const map: Record<number, string> = {};

        const traverse = (category: any) => {
            map[category.id] = category.name;
            if (category.children_recursive && category.children_recursive.length > 0) {
                category.children_recursive.forEach(traverse);
            }
        };

        categories.forEach(traverse);
        return map;
    };

    const categoryMap = categoryData ? buildCategoryMap(categoryData) : {};

    const dataSource = BannerData?.filter((item: Banner) => item.type === 'category').map((item: Banner, index: number) => ({
        key: item.id,
        stt: index + 1,
        ...item,
    }));

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            return await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/banners/${id}`);
        },
        onSuccess: () => {
            toast.success('Xóa Banner Thành Công')
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
        onError: () => {
            toast.error('Xóa Banner Thất Bại!')
        },
    });

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',
            width: "50px",
        },
        {
            title: 'Tiêu Đề',
            dataIndex: 'title',
            key: 'title',
            align: 'center',
            render: (text: string | null) => text || 'Không có',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image_path',
            key: 'image_path',
            align: 'center',
            render: (text: string) => (
                <img src={text} alt="banner" style={{ width: 100, height: 50, objectFit: 'cover' }} className='m-auto' />
            ),
        },
        {
            title: 'Danh Mục',
            dataIndex: 'category_id',
            key: 'category_id',
            align: 'center',
            render: (categoryId: number) => categoryMap?.[categoryId] || 'Không có danh mục',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: number) => status === 1 ? 'Hoạt động' : 'Không hoạt động',
        },
        {
            title: 'Hành Động',
            key: 'actions',
            align: 'center',
            width: "50px",
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
    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    return (
        <div className="w-full mx-auto items-center justify-center p-5">
            <ToastContainer />
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

export default ListBannersCategory;

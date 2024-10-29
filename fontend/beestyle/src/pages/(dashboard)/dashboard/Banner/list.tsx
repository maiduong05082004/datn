import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type Banner = {
    id: number;
    title: string;
    image: string;
    link: string;
};

const ListBanners: React.FC = () => {
    const navigate = useNavigate();

    // Dữ liệu mẫu cho bảng banners
    const banners: Banner[] = [
        { id: 1, title: 'Banner 1', image: 'Ảnh 1', link: 'https://example.com/link1' },
        { id: 2, title: 'Banner 2', image: 'Ảnh 2', link: 'https://example.com/link2' },
    ];

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: '30%',
        },
        {
            title: 'Liên kết',
            dataIndex: 'link',
            key: 'link',
            width: '30%',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_: any, banner: Banner) => (
                <Space size="middle" className="flex justify-around">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/banner/update/${banner.id}`)}
                    />
                    <Popconfirm
                        title="Xóa Banner"
                        description="Bạn có chắc muốn xóa banner này không?"
                        // Thêm logic xóa nếu cần
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="w-full mx-auto items-center justify-center px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/banner/add')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Thêm Banners
                </Button>
            </div>
            <Table
                dataSource={banners}
                columns={columns}
                rowKey={(record) => record.id}
                bordered
                pagination={{
                    pageSize: 7,
                    // showTotal: (total) => `Tổng ${total} banner`,
                }}
                className="w-full"
            />
        </div>
    );
};

export default ListBanners;

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchPromotions, deletePromotion } from '@/services/promotions';
import { Promotion } from '@/common/types/promotion';
import { ColumnsType } from 'antd/es/table';

const ListPromotions: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: promotions, isLoading, isError } = useQuery({
        queryKey: ['promotions'],
        queryFn: fetchPromotions,
    });

    const { mutate: removePromotion } = useMutation({
        mutationFn: deletePromotion,
        onSuccess: () => {
            message.success('Xóa khuyến mãi thành công');
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
        },
        onError: () => {
            message.error('Xóa khuyến mãi thất bại');
        },
    });
    const columns: ColumnsType<Promotion> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a: Promotion, b: Promotion) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
        },
        { title: 'Mã khuyến mãi', dataIndex: 'code', key: 'code' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Giảm giá',
            dataIndex: 'discount_amount',
            key: 'discount_amount',
            render: (_: any, record: Promotion) =>
                record.discount_type === 'percent'
                    ? `${record.discount_amount} %` + (record.max_discount_amount ? ` (tối đa ${record.max_discount_amount}) ₫` : '')
                    : `${record.discount_amount} ₫`,
        },
        {
            title: 'Đơn hàng tối thiểu',
            dataIndex: 'min_order_value',
            key: 'min_order_value',
            render: (value) => (value ? `${value} ₫` : 'Không áp dụng'),
        },
        {
            title: 'Số lần sử dụng',
            dataIndex: 'usage_limit',
            key: 'usage_limit',
            render: (value) => (value ? `${value} lần` : 'Không giới hạn'),
        },
        { title: 'Bắt đầu', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Kết thúc', dataIndex: 'end_date', key: 'end_date' },
        {
            title: 'Danh mục',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories: { id: number; name: string }[]) =>
                categories?.length ? (
                    categories.map((category) => <Tag key={category.id}>{category.name}</Tag>)
                ) : (
                    ''
                ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'products',
            key: 'products',
            render: (products: { id: number; name: string }[]) =>
                products?.length ? (
                    products.map((product) => <Tag key={product.id}>{product.name}</Tag>)
                ) : (
                    ''
                ),
        },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Promotion) => (
                <Space size="middle">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/updatePromotions/${record.id}`)}
                    />
                    <Popconfirm
                        title="Xóa khuyến mãi?"
                        onConfirm={() => removePromotion(record.id)}
                        okText="Có"
                        cancelText="Không"
                        okButtonProps={{ type: 'default' }}
                    >
                        <Button type="default" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isLoading) return <div>Đang tải danh sách khuyến mãi...</div>;
    if (isError) return <div>Lỗi khi tải danh sách khuyến mãi</div>;

    return (
        <div className="mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <Button
                    type="default"
                    className="bg-black hover:bg-slate-300 text-white"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/addPromotions')}
                >
                    Thêm Khuyến Mãi
                </Button>
            </div>
            <Table
                dataSource={promotions}
                columns={columns}
                rowKey="id"
                bordered
                pagination={{ pageSize: 10 }}
                onChange={(pagination, filters, sorter) => {
                    console.log('Các tham số đã thay đổi:', pagination, filters, sorter);
                }}
            />
        </div>
    );
};

export default ListPromotions;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Popconfirm, message, Tag, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchPromotions, deletePromotion } from '@/services/promotions';
import { Promotion } from '@/common/types/promotion';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import SearchComponent from '@/components/ui/search';

const ListPromotions: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('');

    const { data: promotions, isLoading, isError } = useQuery({
        queryKey: ['promotions'],
        queryFn: fetchPromotions,
    });

    const { mutate: removePromotion } = useMutation({
        mutationFn: deletePromotion,
        onSuccess: () => {
            toast.success(`Xóa Khuyến Mại Thành Công`)
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
        },
        onError: () => {
            toast.success(`Xóa Khuyến Mại Thất Bại`)
        },
    });
    const columns: ColumnsType<Promotion> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: "50px",
            sorter: (a: Promotion, b: Promotion) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
        },
        { title: 'Mã khuyến mãi', dataIndex: 'code', key: 'code' ,align: 'center'},
        { title: 'Mô tả', dataIndex: 'description', key: 'description',
            render: (text: string) => <div>{text.split('\n').map((line, index) => <div key={index}>{line}</div>)}</div>
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount_amount',
            key: 'discount_amount',      
            align: 'center',
            render: (_: any, record: Promotion) =>
                record.discount_type === 'percent'
                    ? `${record.discount_amount} %` + (record.max_discount_amount ? ` (tối đa ${record.max_discount_amount}₫)` : '')
                    : `${record.discount_amount} ₫`,
        },
        {
            title: 'Đơn hàng tối thiểu',
            dataIndex: 'min_order_value',
            align: 'center',
            key: 'min_order_value',
            render: (value) => {
                if (!value) return 'Không áp dụng';
                const formattedValue = Math.round(parseFloat(value));
                return `${new Intl.NumberFormat('vi-VN').format(formattedValue)}đ`;
            },
        },
        {
            title: 'Số lần sử dụng',
            dataIndex: 'usage_limit',
            align: 'center',
            key: 'usage_limit',
            render: (value) => (value ? `${value} lần` : 'Không giới hạn'),
        },
        { title: 'Bắt đầu', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Kết thúc', dataIndex: 'end_date', key: 'end_date' },
        // {
        //     title: 'Danh mục',
        //     dataIndex: 'categories',
        //     key: 'categories',
        //     render: (categories: { id: number; name: string }[]) =>
        //         categories?.length ? (
        //             categories.map((category) => <Tag key={category.id}>{category.name}</Tag>)
        //         ) : (
        //             ''
        //         ),
        // },
        // {
        //     title: 'Sản phẩm',
        //     dataIndex: 'products',
        //     key: 'products',
        //     render: (products: { id: number; name: string }[]) =>
        //         products?.length ? (
        //             products.map((product) => <Tag key={product.id}>{product.name}</Tag>)
        //         ) : (
        //             ''
        //         ),
        // },
        {
            title: 'Kích Hoạt',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            render: (is_active: boolean) => (
                <Tag color={is_active ? 'green' : 'red'}>
                    {is_active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                </Tag>
            ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => {
                let color = '';
                let text = '';
                switch (status) {
                    case 'active':
                        color = 'blue';
                        text = 'Đang diễn ra';
                        break;
                    case 'upcoming':
                        color = 'orange';
                        text = 'Sắp diễn ra';
                        break;
                    case 'disabled':
                        color = 'gray';
                        text = 'Không hoạt động';
                        break;
                    default:
                        color = 'default';
                        text = status;
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: "50px",
            render: (_: any, record: Promotion) => (
                <Space size="middle">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/dashboard/promotions/update/${record.id}`)}
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

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setSearchQuery('');
            return;
        }
        setSearchQuery(query);
    };

    const handleSort = (sortKey: string) => {
        setSortKey(sortKey);
    };

    const filteredPromotions = promotions?.filter((promotion: Promotion) => {
        if (!searchQuery) return true;
        
        const searchLower = searchQuery.toLowerCase();
        return promotion.code.toLowerCase().includes(searchLower);
    });

    const sortedPromotions = [...(filteredPromotions || [])].sort((a, b) => {
        if (sortKey === 'code') {
            return a.code.localeCompare(b.code);
        }
        return 0;
    });

    if (isLoading) {
        return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
      }
    if (isError) return <div>Lỗi khi tải danh sách khuyến mãi</div>;

    return (
        <div className="mx-auto p-5">
            <div className="flex justify-between items-center mb-4">
                <Button
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/admin/dashboard/promotions/add')}
                >
                    Thêm Khuyến Mãi
                </Button>
            </div>

            <SearchComponent
                items={promotions || []}
                onSearch={handleSearch}
                onSortChange={handleSort}
                sortOptions={['code']}
                sortOptionsName={['Mã khuyến mãi']}
            />

            <Table
                dataSource={sortedPromotions}
                columns={columns}
                rowKey="id"
                bordered
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ListPromotions;

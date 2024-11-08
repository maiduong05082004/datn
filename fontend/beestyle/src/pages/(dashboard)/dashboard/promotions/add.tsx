import { Category, Product } from '@/common/types/promotion';
import { createPromotion, fetchCategories, fetchProductsByCategory } from '@/services/promotions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddPromotion: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [promotionScope, setPromotionScope] = useState<'category' | 'product'>('category');
    const [discountType, setDiscountType] = useState<'amount' | 'percent'>('percent');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const { mutate: addPromotion, isPending } = useMutation({
        mutationFn: createPromotion,
        onSuccess: () => {
            message.success('Khuyến mãi đã được tạo thành công!');
            form.resetFields();
            navigate('/admin/listPromotions');
        },
        onError: () => {
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        },
    });

    useEffect(() => {
        const fetchProducts = async () => {
            if (selectedCategory && promotionScope === 'product') {
                try {
                    const fetchedProducts = await fetchProductsByCategory(selectedCategory);
                    setProducts(fetchedProducts || []);
                } catch (error) {
                    console.error('Lỗi khi tải sản phẩm:', error);
                    message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
                    setProducts([]);
                }
            } else {
                setProducts([]);
            }
        };

        fetchProducts();
    }, [selectedCategory, promotionScope]);

    const onFinish = (values: any) => {
        addPromotion({
            ...values,
            start_date: values.start_date.format('YYYY-MM-DD'),
            end_date: values.end_date.format('YYYY-MM-DD'),
            is_active: values.is_active || false,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Thêm Khuyến Mãi Mới</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Mã Khuyến Mãi"
                    name="code"
                    rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Ngày Bắt Đầu"
                    name="start_date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Ngày Kết Thúc"
                    name="end_date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Loại Giảm Giá"
                    name="discount_type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                >
                    <Radio.Group
                        onChange={(e) => setDiscountType(e.target.value)}
                        value={discountType}
                    >
                        <Radio value="percent">Giảm theo phần trăm</Radio>
                        <Radio value="amount">Giảm theo số tiền</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Số Tiền Giảm"
                    name="discount_amount"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                {discountType === 'percent' && (
                    <Form.Item
                        label="Giảm Tối Đa"
                        name="max_discount_amount"
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm tối đa!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                )}

                <Form.Item label="Số Lần Sử Dụng" name="usage_limit">
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Giá Trị Đơn Hàng Tối Thiểu" name="min_order_value">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Loại Khuyến Mãi"
                    name="promotion_type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi!' }]}
                >
                    <Select placeholder="Chọn loại khuyến mãi">
                        <Option value="shipping">Miễn phí vận chuyển</Option>
                        <Option value="product_discount">Giảm giá sản phẩm</Option>
                        <Option value="voucher_discount">Giảm giá bằng voucher</Option>
                        <Option value="first_order">Giảm giá đơn hàng đầu tiên</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Phạm Vi Khuyến Mãi" name="promotion_scope">
                    <Radio.Group
                        onChange={(e) => {
                            setPromotionScope(e.target.value);
                            form.setFieldsValue({ category_ids: [], product_ids: [] });
                            setSelectedCategory(null);
                        }}
                        value={promotionScope}
                    >
                        <Radio value="category">Theo Danh Mục</Radio>
                        <Radio value="product">Theo Sản Phẩm</Radio>
                    </Radio.Group>
                </Form.Item>

                {promotionScope === 'category' && (
                    <Form.Item label="Danh Mục" name="category_ids" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                        <Select mode="multiple" placeholder="Chọn danh mục" loading={isLoadingCategories} allowClear>
                            {categories.map((category) => (
                                <Option key={category.id} value={category.id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {promotionScope === 'product' && (
                    <>
                        <Form.Item label="Chọn Danh Mục" name="filter_category">
                            <Select
                                placeholder="Chọn danh mục để lọc sản phẩm"
                                onChange={(value) => {
                                    setSelectedCategory(value);
                                    form.setFieldsValue({ product_ids: [] });
                                }}
                                loading={isLoadingCategories}
                                allowClear
                            >
                                {categories.map((category) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Chọn Sản Phẩm"
                            name="product_ids"
                            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder={products.length > 0 ? "Chọn sản phẩm" : "Không có sản phẩm"}
                                allowClear
                                disabled={products.length === 0}
                            >
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <Option key={product.id} value={product.id}>
                                            {product.name}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled value="">Không có sản phẩm</Option>
                                )}
                            </Select>
                        </Form.Item>
                    </>
                )}

                <Form.Item label="Kích Hoạt" name="is_active" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="Trạng Thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="active">Đang diễn ra</Option>
                        <Option value="expired">Đã hết hạn</Option>
                        <Option value="upcoming">Sắp diễn ra</Option>
                        <Option value="disabled">Vô hiệu hóa</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                        >
                            Thêm mới
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/promotions/list')}
                            size="large"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-6"
                        >
                            Quay lại
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddPromotion;

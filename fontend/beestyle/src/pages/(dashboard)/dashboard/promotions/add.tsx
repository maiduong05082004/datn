// import { Category, Product } from '@/common/types/promotion';
import { createPromotion, fetchCategories, fetchProductsByCategory } from '@/services/promotions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddPromotion: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // const [promotionScope, setPromotionScope] = useState<'category' | 'product' | 'none'>('category');
    const [discountType, setDiscountType] = useState<'amount' | 'percent'>('percent');
    // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    // const [products, setProducts] = useState<Product[]>([]);

    // const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    //     queryKey: ['categories'],
    //     queryFn: fetchCategories,
    // });

    const { mutate: addPromotion, isPending } = useMutation({
        mutationFn: createPromotion,
        onSuccess: () => {
            message.success('Khuyến mãi đã được tạo thành công!');
            form.resetFields();
            navigate('/admin/dashboard/promotions/list');
        },
        onError: () => {
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        },
    });

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         if (selectedCategory && promotionScope === 'product') {
    //             try {
    //                 const fetchedProducts = await fetchProductsByCategory(selectedCategory);
    //                 setProducts(fetchedProducts || []);
    //             } catch (error) {
    //                 console.error('Lỗi khi tải sản phẩm:', error);
    //                 message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    //                 setProducts([]);
    //             }
    //         } else {
    //             setProducts([]);
    //         }
    //     };

    //     fetchProducts();
    // }, [selectedCategory, promotionScope]);

    const onFinish = (values: any) => {
        let promotionType = '';
        if (values.promotion_subtype === 'shipping') {
            promotionType = 'shipping';
        } else {
            promotionType = 'product';
        }

        addPromotion({
            ...values,
            promotion_type: promotionType,
            start_date: values.start_date.format('YYYY-MM-DD'),
            end_date: values.end_date.format('YYYY-MM-DD'),
            is_active: values.is_active || false,
        });
    };

    return (
        <div className="min-h-screen p-5">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Mã Khuyến Mãi"
                    name="code"
                    rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi!' }]}
                    className='mb-[10px]'
                >
                    <Input className='h-10' />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    className='mb-[10px]'
                >
                    <Input.TextArea rows={5} />
                </Form.Item>

                <Form.Item
                    label="Ngày Bắt Đầu"
                    name="start_date"
                    className='mb-[10px]'
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} className='h-10' />
                </Form.Item>

                <Form.Item
                    label="Ngày Kết Thúc"
                    name="end_date"
                    className='mb-[10px]'
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} className='h-10' />
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

                {discountType === 'percent' && (
                    <>
                        <Form.Item
                            label="Số Phần Trăm Giảm"
                            name="discount_amount"
                            className='mb-[10px]'
                            rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm!' }]}
                        >
                            <InputNumber min={0} max={100} style={{ width: '100%' }} className='h-10' />
                        </Form.Item>
                        <Form.Item
                            label="Triết Khấu Tối Đa"
                            name="max_discount_amount"
                            className='mb-[10px]'
                            rules={[{ required: true, message: 'Trường số tiền chiết khấu tối đa là bắt buộc khi loại giảm giá là phần trăm!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} className='h-10' />
                        </Form.Item>
                    </>
                )}
                {discountType === 'amount' && (
                    <>
                        <Form.Item
                            label="Số Tiền Giảm"
                            name="discount_amount"
                            className='mb-[10px]'
                            rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} className='p-1' />
                        </Form.Item>
                    </>
                )}
                <Form.Item label="Tổng Số Lượng Voucher" name="usage_limit" className='mb-[10px]'>
                    <InputNumber min={1} style={{ width: '100%' }} className='p-1' />
                </Form.Item>

                <Form.Item label="Giá Trị Đơn Hàng Tối Thiểu" name="min_order_value" className='mb-[10px]'
                >
                    <InputNumber min={0} style={{ width: '100%' }} className='p-1'/>
                </Form.Item>

                <Form.Item
                    label="Loại Khuyến Mãi"
                    name="promotion_subtype"
                    className='mb-[10px]'
                    rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi!' }]}
                >
                    <Select placeholder="Chọn loại khuyến mãi" className='h-10'>
                        <Option value="shipping">Miễn phí vận chuyển</Option>
                        <Option value="product_discount">Giảm giá sản phẩm</Option>
                        <Option value="voucher_discount">Giảm giá bằng voucher</Option>
                        <Option value="first_order">Giảm giá đơn hàng đầu tiên</Option>
                    </Select>
                </Form.Item>

                {/* <Form.Item label="Phạm Vi Khuyến Mãi" name="promotion_scope">
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
                        <Radio value="none">Không Có</Radio>
                    </Radio.Group>
                </Form.Item>

                {promotionScope === 'category' && (
                    <Form.Item label="Danh Mục" className='mb-[10px]' name="category_ids" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                        <Select mode="multiple" placeholder="Chọn danh mục" loading={isLoadingCategories} className='h-10' allowClear>
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
                        <Form.Item label="Chọn Danh Mục" name="filter_category" className='mb-[10px]'>
                            <Select
                                placeholder="Chọn danh mục để lọc sản phẩm"
                                className='h-10'
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
                            className='mb-[10px]'
                            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                        >
                            <Select
                            className='h-10'
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
                )} */}

                <Form.Item label="Kích Hoạt" name="is_active" valuePropName="checked" className='mb-[10px]'>
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="Trạng Thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái" className='h-10'>
                        <Option value="active">Đang diễn ra</Option>
                        <Option value="expired">Đã hết hạn</Option>
                        <Option value="upcoming">Sắp diễn ra</Option>
                        <Option value="disabled">Vô hiệu hóa</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <div className='flex justify-end space-x-4'>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/dashboard/promotions/list')}
                        >
                            Back
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddPromotion;
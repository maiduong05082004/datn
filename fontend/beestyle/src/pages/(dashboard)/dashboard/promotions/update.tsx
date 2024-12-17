import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Switch, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, fetchProductsByCategory, updatePromotion, getPromotion } from '@/services/promotions';
import { Category, Product, Promotion } from '@/common/types/promotion';

const { Option } = Select;

const UpdatePromotion: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // const [promotionScope, setPromotionScope] = useState<'category' | 'product'>('category');
    const [discountType, setDiscountType] = useState<'amount' | 'percent'>('percent');
    // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    // const [products, setProducts] = useState<Product[]>([]);
    const token = localStorage.getItem('token_admin');
    const [isActive, setIsActive] = useState<boolean>(false);

    // const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    //     queryKey: ['categories'],
    //     queryFn: fetchCategories,
    // });

    const { data: promotionData, isLoading, isError } = useQuery<Promotion>({
        queryKey: ['promotion', id],
        queryFn: () => getPromotion(Number(id)),
    });

    const { mutate: updatePromotionMutate, isPending: isUpdating } = useMutation({
        mutationFn: (values: any) => updatePromotion(Number(id), values),
        onSuccess: () => {
            message.success('Cập nhật khuyến mãi thành công!');
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
    //                 message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    //             }
    //         } else {
    //             setProducts([]);
    //         }
    //     };

    //     fetchProducts();
    // }, [selectedCategory, promotionScope]);

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/admins/promotions/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setDiscountType(data.discount_type);
                setIsActive(data.is_active);
                
                form.setFieldsValue({
                    code: data.code,
                    description: data.description,
                    start_date: moment(data.start_date),
                    end_date: moment(data.end_date),
                    discount_amount: data.discount_amount,
                    discount_type: data.discount_type,
                    max_discount_amount: data.max_discount_amount,
                    usage_limit: data.usage_limit,
                    min_order_value: data.min_order_value,
                    promotion_type: data.promotion_type,
                    promotion_subtype: data.promotion_subtype,
                    promotion_scope: data.products.length > 0 ? 'product' : 'category',
                    is_active: data.is_active,
                    status: data.is_active ? data.status : 'disabled',
                    category_ids: data.categories.map((cat: Category) => cat.id),
                    product_ids: data.products.map((prod: Product) => prod.id),
                });
            } catch (error) {
                message.error('Không thể tải dữ liệu khuyến mãi.');
            }
        };

        fetchPromotion();
    }, [id]);

    const onFinish = (values: any) => {
        let promotionType = '';
        if (values.promotion_subtype === 'shipping') {
            promotionType = 'shipping';
        } else {
            promotionType = 'product';
        }

        updatePromotionMutate({
            ...values,
            promotion_type: promotionType,
            start_date: values.start_date.format('YYYY-MM-DD'),
            end_date: values.end_date.format('YYYY-MM-DD'),
            is_active: values.is_active || false,
        });
    };

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (isError) return <div>Có lỗi xảy ra khi tải dữ liệu khuyến mãi</div>;

    return (
        <div className="min-h-screen p-5">
            <Form form={form} layout="vertical" onFinish={onFinish}>

                <Form.Item
                    label="Mã khuyến mãi"
                    name="promo_code"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã khuyến mãi!' },
                        { max: 20, message: 'Mã khuyến mãi không được dài quá 20 ký tự!' },
                    ]}
                >
                    <Input className='h-10' />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} className="h-10" />
                </Form.Item>

                <Form.Item
                    label="Ngày bắt đầu"
                    name="start_date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker className="h-10" style={{ width: '100%' }} />
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
                    label="Loại giảm giá"
                    name="discount_type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                >
                    <Select className="h-10" placeholder="Chọn loại giảm giá">
                        <Option value="percentage">Giảm theo phần trăm</Option>
                        <Option value="fixed">Giảm theo giá cố định</Option>
                    </Select>
                </Form.Item>

                {discountType === 'percent' ? (
                    <>
                        <Form.Item
                            label="Số Phần Trăm Giảm"
                            name="discount_amount"
                            rules={[{ required: true, message: 'Vui lòng nhập số phần trăm giảm!' }]}
                        >
                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Triết Khấu Tối Đa"
                            name="max_discount_amount"
                            rules={[{ required: true, message: 'Trường số tiền chiết khấu tối đa là bắt buộc khi loại giảm giá là phần trăm!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </>
                ) : (
                    <Form.Item
                        label="Số tiền giảm"
                        name="discount_amount"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số tiền giảm!' },
                            { type: 'number', min: 0, message: 'Số tiền giảm phải là số dương!' },
                        ]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                )}

                <Form.Item label="Số Lần Sử Dụng" name="usage_limit" className='mb-[10px]'>
                    <InputNumber min={1} style={{ width: '100%' }} className='py-1' />
                </Form.Item>
                <Form.Item label="Giá Trị Đơn Hàng Tối Thiểu" name="min_order_value" className='mb-[10px]'>
                    <InputNumber min={0} style={{ width: '100%' }} className='py-1' />
                </Form.Item>

                <Form.Item
                    label="Loại khuyến mãi"
                    name="promotion_type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi!' }]}
                >
                    <Select placeholder="Chọn loại khuyến mãi">
                        <Option value="discount">Giảm giá</Option>
                        <Option value="gift">Quà tặng</Option>
                        <Option value="free_shipping">Miễn phí vận chuyển</Option>
                    </Select>
                </Form.Item>
                {/* <Form.Item label="Phạm Vi Khuyến Mãi" name="promotion_scope">
                    <Radio.Group
                        onChange={(e) => setPromotionScope(e.target.value)}
                        value={promotionScope}
                    >
                        <Radio value="category">Theo Danh Mục</Radio>
                        <Radio value="product">Theo Sản Phẩm</Radio>
                    </Radio.Group>
                </Form.Item>

                {promotionScope === 'category' && (
                    <Form.Item label="Danh Mục" name="category_ids" className='mb-[10px]'>
                        <Select mode="multiple" placeholder="Chọn danh mục" loading={isLoadingCategories} className='h-10'>
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
                            <Select onChange={(value) => setSelectedCategory(value)} loading={isLoadingCategories} className='h-10'>
                                {categories.map((category) => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Chọn Sản Phẩm" name="product_ids" className='mb-[10px]'>
                            <Select mode="multiple" disabled={products.length === 0} className='h-10'>
                                {products.map((product) => (
                                    <Option key={product.id} value={product.id}>
                                        {product.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </>
                )} */}

                <Form.Item label="Kích Hoạt" name="is_active" valuePropName="checked" className='mb-[10px]'>
                    <Switch onChange={(checked) => {
                        setIsActive(checked);
                        if (!checked) {
                            form.setFieldsValue({ status: 'disabled' });
                        } else {
                            form.setFieldsValue({ status: 'active' });
                        }
                    }} />
                </Form.Item>

                <Form.Item label="Trạng Thái" name="status">
                    <Select className='h-10' disabled={!isActive}>
                        {isActive ? (
                            <>
                                <Option value="active">Đang diễn ra</Option>
                                <Option value="upcoming">Sắp diễn ra</Option>
                            </>
                        ) : (
                            <Option value="disabled">Không hoạt động</Option>
                        )}
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

export default UpdatePromotion;

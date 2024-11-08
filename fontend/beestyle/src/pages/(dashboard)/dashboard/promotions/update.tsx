import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  message,
} from 'antd';
import moment, { Moment } from 'moment';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchCategories,
  fetchProductsByCategory,
  fetchProductsByIds,
  updatePromotion,
  getPromotion,
} from '@/services/promotions';
import { Category, Product, Promotion } from '@/common/types/promotion';

const { Option } = Select;

type PromotionScope = 'category' | 'product' | 'none';
type DiscountType = 'amount' | 'percent';

interface FormValues {
  code: string;
  description: string;
  start_date: Moment;
  end_date: Moment;
  discount_amount: number;
  discount_type: DiscountType;
  max_discount_amount?: number;
  usage_limit?: number;
  min_order_value?: number;
  promotion_subtype: 'first_order' | 'product_discount' | 'voucher_discount' | 'shipping';
  promotion_scope: PromotionScope;
  is_active: boolean;
  status: string;
  category_ids?: number[];
  product_ids?: number[];
  filter_category?: number;
}

const UpdatePromotion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);

  const promotionScope = Form.useWatch('promotion_scope', form);
  const discountType = Form.useWatch('discount_type', form);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: promotionData, isLoading, isError } = useQuery<Promotion>({
    queryKey: ['promotion', id],
    queryFn: () => getPromotion(Number(id)),
  });

  const { mutate: updatePromotionMutate, isPending: isUpdating } = useMutation({
    mutationFn: (values: FormValues) => {
      const promotionData = {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        promotion_type: (values.promotion_subtype === 'shipping' ? 'shipping' : 'product') as 'shipping' | 'product',
      };
      return updatePromotion(Number(id), promotionData);
      
    },
    onSuccess: () => {
      message.success('Cập nhật khuyến mãi thành công!');
      navigate('/admin/promotions/list');
    },
    onError: () => {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  React.useEffect(() => {
    const fetchProducts = async () => {
      if (promotionScope === 'product') {
        if (selectedCategory) {
          try {
            const fetchedProducts = await fetchProductsByCategory(selectedCategory);
            setProducts(fetchedProducts || []);
          } catch (error) {
            message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
          }
        } else if (
          form.getFieldValue('product_ids') &&
          form.getFieldValue('product_ids').length > 0
        ) {
          try {
            const productIds = form.getFieldValue('product_ids') as number[];
            const fetchedProducts = await fetchProductsByIds(productIds);
            setProducts(fetchedProducts || []);
          } catch (error) {
            message.error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
          }
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategory, promotionScope, form]);

  React.useEffect(() => {
    const fetchPromotion = async () => {
      try {
        if (id) {
          const data = await getPromotion(Number(id));

          // Xác định promotion_scope
          const scope: PromotionScope =
            data.products && data.products.length > 0
              ? 'product'
              : data.categories && data.categories.length > 0
              ? 'category'
              : 'none';

          // Đặt giá trị cho form
          form.setFieldsValue({
            code: data.code,
            description: data.description,
            start_date: moment(data.start_date),
            end_date: moment(data.end_date),
            discount_amount: data.discount_amount,
            discount_type: data.discount_type as DiscountType,
            max_discount_amount: data.max_discount_amount,
            usage_limit: data.usage_limit || undefined,
            min_order_value: data.min_order_value,
            promotion_subtype: data.promotion_subtype as FormValues['promotion_subtype'],
            promotion_scope: scope,
            is_active: data.is_active,
            status: data.status,
            category_ids: data.categories ? data.categories.map((cat) => cat.id) : [],
            product_ids: data.products ? data.products.map((prod) => prod.id) : [],
            filter_category: undefined,
          });

          // Nếu scope là 'product', tải sản phẩm dựa trên product_ids
          if (scope === 'product') {
            if (data.products && data.products.length > 0) {
              const productIds = data.products.map((prod: Product) => prod.id);
              const fetchedProducts = await fetchProductsByIds(productIds);
              setProducts(fetchedProducts || []);

              // Đặt selectedCategory nếu tất cả sản phẩm thuộc cùng một danh mục
              const uniqueCategories = Array.from(
                new Set(fetchedProducts.map((prod) => prod.category_id)),
              );
              if (uniqueCategories.length === 1) {
                setSelectedCategory(uniqueCategories[0]);
                form.setFieldsValue({ filter_category: uniqueCategories[0] });
              } else {
                setSelectedCategory(null);
                form.setFieldsValue({ filter_category: undefined });
              }
            }
          }
        }
      } catch (error) {
        message.error('Không thể tải dữ liệu khuyến mãi.');
      }
    };

    fetchPromotion();
  }, [id, form]);

  const onFinish = (values: FormValues) => {
    updatePromotionMutate(values);
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (isError) return <div>Có lỗi xảy ra khi tải dữ liệu khuyến mãi</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Cập Nhật Khuyến Mãi</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changedValues) => {
          if ('promotion_scope' in changedValues) {
            setSelectedCategory(null);
            setProducts([]);
            form.setFieldsValue({
              category_ids: [],
              product_ids: [],
              filter_category: undefined,
            });
          }
          if ('discount_type' in changedValues) {
            form.setFieldsValue({
              discount_amount: undefined,
              max_discount_amount: undefined,
            });
          }
        }}
      >
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
          <Radio.Group>
            <Radio value="percent">Giảm theo phần trăm</Radio>
            <Radio value="amount">Giảm theo số tiền</Radio>
          </Radio.Group>
        </Form.Item>

        {discountType === 'percent' && (
          <>
            <Form.Item
              label="Số Phần Trăm Giảm"
              name="discount_amount"
              rules={[{ required: true, message: 'Vui lòng nhập số phần trăm giảm!' }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Giảm Tối Đa"
              name="max_discount_amount"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm tối đa!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}
        {discountType === 'amount' && (
          <Form.Item
            label="Số Tiền Giảm"
            name="discount_amount"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm!' }]}
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
          name="promotion_subtype"
          rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi!' }]}
        >
          <Select placeholder="Chọn loại khuyến mãi">
            <Option value="shipping">Miễn phí vận chuyển</Option>
            <Option value="product_discount">Giảm giá sản phẩm</Option>
            <Option value="voucher_discount">Giảm giá bằng voucher</Option>
            <Option value="first_order">Giảm giá đơn hàng đầu tiên</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Phạm Vi Khuyến Mãi"
          name="promotion_scope"
          rules={[{ required: true, message: 'Vui lòng chọn phạm vi khuyến mãi!' }]}
        >
          <Radio.Group>
            <Radio value="category">Theo Danh Mục</Radio>
            <Radio value="product">Theo Sản Phẩm</Radio>
            <Radio value="none">Không Có</Radio>
          </Radio.Group>
        </Form.Item>

        {promotionScope === 'category' && (
          <Form.Item
            label="Danh Mục"
            name="category_ids"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn danh mục"
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
        )}

        {promotionScope === 'product' && (
          <>
            <Form.Item label="Chọn Danh Mục" name="filter_category">
              <Select
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
                disabled={products.length === 0}
                placeholder="Chọn sản phẩm"
                allowClear
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
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
          <Button type="default" htmlType="submit" loading={isUpdating}>
            Cập Nhật Khuyến Mãi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePromotion;

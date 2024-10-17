import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Input, Select, Button, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  status: boolean;
  image: string | null;
  children_recursive: Category[];
}

const UpdateCategories: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  // Query lấy dữ liệu danh mục hiện tại
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/admins/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Query lấy danh sách tất cả danh mục
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  // Mutation cập nhật danh mục
  const mutation = useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      return await axios.put(`http://127.0.0.1:8000/api/admins/categories/${id}`, categoryData);
    },
    onSuccess: () => {
      messageApi.success('Cập nhật danh mục thành công!');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/listCategories');
    },
    onError: (error: any) => {
      messageApi.error(`Lỗi: ${error.message}`);
    },
  });

  // Đổ dữ liệu vào form khi category được tải xong
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        parent_id: category.parent_id,
        image: category.image || '',
      });
    }
  }, [category, form]);

  const onFinish = (values: any) => {
    const payload = {
      name: values.name,
      status: true,
      parent_id: values.parent_id || null,
      image: values.image || null,
    };
    mutation.mutate(payload);
  };

  if (categoryLoading || categoriesLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Cập Nhật Danh Mục
          </h2>
          <Form
            form={form}
            name="updateCategory"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            initialValues={{...category}}
          >
            <Form.Item
              label={<span className="font-medium text-gray-700">Tên danh mục</span>}
              name="name"
              rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}
            >
              <Input
                placeholder="Nhập tên danh mục"
                size="large"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Danh mục cha</span>}
              name="parent_id"
            >
              <Select
                allowClear
                placeholder="Chọn danh mục cha (nếu có)"
                size="large"
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                options={categories.map((cat: Category) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Ảnh (URL)</span>}
              name="image"
            >
              <Input
                placeholder="Nhập URL ảnh"
                size="large"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end space-x-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                >
                  Cập nhật
                </Button>
                <Button
                  onClick={() => navigate('/admin/listCategories')}
                  size="large"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-6"
                >
                  Quay lại
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateCategories;

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Form, Input, Select, message, Spin, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  status: boolean;
  image: string | null;
  children_recursive: Category[];
}

const AddCategories: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>(''); // State để lưu URL ảnh

  // Fetch categories from API
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  // Mutation to add a new category
  const { mutate } = useMutation({
    mutationFn: async (categoryData: any) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/categories', categoryData);
    },
    onSuccess: () => {
      messageApi.success('Thêm danh mục thành công!');
      form.resetFields();
      setImageUrl(''); // Reset lại URL ảnh
      navigate('/admin/listCategories');
    },
    onError: (error: any) => {
      messageApi.error(`Lỗi: ${error.message}`);
    },
  });

  // Handle form submission
  const onFinish = (values: any) => {
    const payload = {
      name: values.name,
      status: values.status,
      parent_id: values.parent_id || null,
      image: imageUrl, // Gửi URL ảnh vào payload
    };

    mutate(payload);
  };

  if (isLoading) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Thêm Mới Danh Mục
          </h2>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
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
              rules={[{ required: true, message: 'URL ảnh là bắt buộc' }]}
            >
              <Input
                placeholder="Nhập URL ảnh"
                size="large"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Trạng thái</span>}
              name="status"
              rules={[{ required: true, message: 'Trạng thái là bắt buộc' }]}
            >
              <Radio.Group>
                <Radio value={true}>Hoạt động</Radio>
                <Radio value={false}>Không hoạt động</Radio>
              </Radio.Group>
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

export default AddCategories;

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Form, Input, Select, message, Spin } from 'antd';
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
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (categoryData: FormData) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/categories', categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      messageApi.success('Thêm danh mục thành công!');
      form.resetFields();
      setFileUrl(null);
      navigate('/admin/listCategories');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.parent_id) formData.append('parent_id', String(values.parent_id));
    if (fileUrl) formData.append('image_url', fileUrl);

    mutate(formData);
  };

  if (isLoading) {
    return <Spin tip="Đang tải..." className="flex justify-center items-center h-screen" />;
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
                options={categories?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Ảnh</span>}
              name="image"
              rules={[{ required: true, message: 'Ảnh là bắt buộc' }]}
            >
              <input type="file"/>
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

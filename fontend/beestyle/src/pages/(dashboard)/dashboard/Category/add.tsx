import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Button, Form, Input, Select, message, Spin, Checkbox } from 'antd';
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
  const [file, setFile] = useState<File | null>(null);
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (categoryData: FormData) => {
      return await axiosInstance.post('http://127.0.0.1:8000/api/admins/categories', categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      messageApi.success('Thêm danh mục thành công!');
      form.resetFields();
      setFile(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    
    if (!values.name) {
        message.error('Tên danh mục là bắt buộc.');
        return;
    }

    if (values.parent_id) {
        if (file) {
            message.error('Không được thêm ảnh khi có danh mục cha.');
            return;
        }
    } else {
        if (!file) {
            message.error('Ảnh là bắt buộc nếu không có danh mục cha.');
            return;
        }
        formData.append('image', file);
    }

    formData.append('status', values.status ? '1' : '0');
    
    mutate(formData);
  };

  if (isLoading) {
    return <Spin tip="Đang tải..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen p-5">
        <div className="w-full max-w-8xl">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            initialValues={{ status: false }}
          >
            <Form.Item
              label={<span className="font-medium text-gray-700">Tên danh mục</span>}
              name="name"
              rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}
            >
              <Input
                placeholder="Nhập tên danh mục"
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            >
              <input 
                type="file" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }} 
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Trạng thái</span>}
              name="status"
              valuePropName="checked"
            >
              <Checkbox>Hoạt động</Checkbox>
            </Form.Item>

            <Form.Item>
              <div className='flex justify-end space-x-4'>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  onClick={() => navigate('/admin/dashboard/category/list')}
                >
                  Back
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

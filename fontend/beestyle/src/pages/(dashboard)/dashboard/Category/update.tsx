import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Button, Form, Input, Select, message, Spin, Checkbox } from 'antd';
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
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  const { data: categoryToUpdate, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (categoryToUpdate) {
      form.setFieldsValue({
        name: categoryToUpdate.name,
        parent_id: categoryToUpdate.parent_id,
        status: categoryToUpdate.status,
      });
      setPreviewImage(categoryToUpdate.image || null);
    }
  }, [categoryToUpdate, form]);

  const { mutate } = useMutation({
    mutationFn: async (categoryData: FormData) => {
      return await axiosInstance.put(`http://127.0.0.1:8000/api/admins/categories/${id}`, categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      messageApi.success('Cập nhật danh mục thành công!');
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
  
    if (values.name) {
      formData.append('name', values.name);
    } else {
      message.error('Tên danh mục là bắt buộc.');
      return;
    }
  
    formData.append('status', values.status ? '1' : '0');
  
    if (values.parent_id) {
      formData.append('parent_id', values.parent_id);
      if (file) {
        message.error('Không được thêm ảnh khi có danh mục cha.');
        return;
      }
    } else {
      if (file) {
        formData.append('image', file);
      } else if (!categoryToUpdate?.image) {
        message.error('Ảnh là bắt buộc nếu không có danh mục cha.');
        return;
      }
    }
  
    mutate(formData);
  };
  
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile)); // Update preview with the new file
    }
  };

  if (isLoadingCategories || isLoadingCategory) {
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
            >
              {previewImage && (
                <div className="mb-4">
                  <img
                    src={previewImage}
                    alt="Category Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
                  />
                  <p>Ảnh hiện tại</p>
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
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

export default UpdateCategories;

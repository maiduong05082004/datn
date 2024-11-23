import React, { useState } from 'react';
import { Button, Form, Input, Select, Upload, message, Spin, FormProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';

const { Option } = Select;
interface fileType {
  title: string;
  category_id: number;
  link?: string;
  image?: File;
}

const AddBanners: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  // Fetch categories
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosInstance.post('http://127.0.0.1:8000/api/admins/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      messageApi.success('Thêm banner thành công!');
      form.resetFields();
      setFile(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  const onFinish: FormProps<fileType>["onFinish"] = (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('category_id', values.category_id);
    formData.append('type', values.type);
    formData.append('status', values.status);
    if (values.link) {
      formData.append('link', values.link);
    }
    if (file) {
      formData.append('image_path', file);
    }

    mutate(formData);
  };

  const handleFileChange = (info: any) => {
    if (info.fileList.length > 0) {
      setFile(info.fileList[0].originFileObj);
    } else {
      setFile(null);
    }
  };

  if (categoryLoading) {
    return <Spin tip="Đang tải danh mục..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-6 text-center">Thêm Banner Mới</h2>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{
            title: '',
            category_id: undefined,
            link: '',
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề Banner"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề banner' }]}
          >
            <Input placeholder="Nhập tiêu đề banner" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categoryData?.map((category: any) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại Banner"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn Loạn Banner">
              <option value="main">Banner Chính</option>
              <option value="category">Banner Danh Mục</option>
              <option value="custom">Banner Tự Do</option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
                <Option value={0}>Không hoạt động</Option>
                <Option value={1}>Hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="link"
            label="Đường link (Tùy chọn)"
          >
            <Input placeholder="Nhập đường link" />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Ảnh Banner</span>}
            name="image"
            rules={[{ required: true, message: 'Vui lòng tải lên ảnh banner' }]}
          >
            <Upload
              listType="picture"
              onChange={handleFileChange}
              beforeUpload={() => false} 
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className='flex justify-end space-x-4'>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={() => navigate('/admin/dashboard/banner/list')}>
                Back
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddBanners;

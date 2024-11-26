import React, { useState } from 'react';
import { Button, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';

const { Option } = Select;

const AddBanners: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [bannerType, setBannerType] = useState<string>(''); // Lưu trạng thái của `type`

  // Fetch categories
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  // Mutation để thêm banner
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
      setBannerType('');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const formData = new FormData();
    
    if (values.type) formData.append('type', values.type);
    if (values.title) formData.append('title', values.title);
    if (values.category_id) formData.append('category_id', values.category_id.toString());
    if (values.status) formData.append('status', values.status.toString());
    if (values.link) formData.append('link', values.link);

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

  const handleTypeChange = (value: string) => {
    setBannerType(value);
    if (value === 'main') {
      form.setFieldsValue({ category_id: undefined, link: undefined });
    } else if (value === 'category') {
      form.setFieldsValue({ link: undefined });
    } else if (value === 'custom') {
      form.setFieldsValue({ category_id: undefined });
    }
  };

  if (categoryLoading) {
    return <div>Đang tải danh mục...</div>;
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
            type: '',
            status: 1,
          }}
        >
          {/* Chỉ hiển thị loại banner ban đầu */}
          <Form.Item name="type" label="Loại Banner">
            <Select placeholder="Chọn loại banner" onChange={handleTypeChange} allowClear>
              <Option value="main">Banner Chính</Option>
              <Option value="category">Banner Danh Mục</Option>
              <Option value="custom">Banner Tự Do</Option>
            </Select>
          </Form.Item>

          {/* Hiển thị các trường khác khi `type` được chọn */}
          {bannerType && (
            <>
              <Form.Item name="title" label="Tiêu đề Banner">
                <Input placeholder="Nhập tiêu đề banner" />
              </Form.Item>

              {bannerType === 'category' && (
                <Form.Item name="category_id" label="Danh mục">
                  <Select placeholder="Chọn danh mục">
                    {categoryData?.map((category: any) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {bannerType !== 'main' && (
                <Form.Item name="link" label="Đường link (Tùy chọn)">
                  <Input placeholder="Nhập đường link" />
                </Form.Item>
              )}

              <Form.Item name="status" label="Trạng thái">
                <Radio.Group>
                  <Radio value={0}>Không hoạt động</Radio>
                  <Radio value={1}>Hoạt động</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="image" label="Ảnh Banner">
                <Upload listType="picture" onChange={handleFileChange} beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button type="default" htmlType="submit">
                Thêm mới
              </Button>
              <Button onClick={() => navigate('/admin/dashboard/banner/list')}>Quay lại</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddBanners;

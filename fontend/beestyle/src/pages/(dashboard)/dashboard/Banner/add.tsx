import React, { useState } from 'react';
import { Button, Cascader, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { toast, ToastContainer } from 'react-toastify';

const { Option } = Select;

const AddBanners: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [bannerType, setBannerType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });
  const categoryOptions = categories?.map((category: any) => ({
    value: category.id,
    label: category.name,
    children: category.children_recursive && category.children_recursive.length > 0
      ? category.children_recursive.map((child: any) => ({
        value: child.id,
        label: child.name,
        children: child.children_recursive && child.children_recursive.length > 0
          ? child.children_recursive.map((subChild: any) => ({
            value: subChild.id,
            label: subChild.name,
          }))
          : [],
      }))
      : [],
  }));

  // Mutation để thêm banner
  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosInstance.post('http://127.0.0.1:8000/api/admins/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      toast.success('Thêm Banner Thành Công')
      form.resetFields();
      setFile(null);
      setBannerType('');
      setLoading(false);

    },
    onError: () => {
      toast.error('Thêm Banner Thất Bại!')
      setLoading(false)
    },
  });

  const onFinish = (values: any) => {
    setLoading(true);
    const selectedCategoryId = Array.isArray(values.category_id)
      ? values.category_id[values.category_id.length - 1] 
      : values.category_id;
    const formData = new FormData();

    if (values.type) formData.append('type', values.type);
    if (values.title) formData.append('title', values.title);
    if (selectedCategoryId) formData.append('category_id', selectedCategoryId.toString());
    if (values.status) formData.append('status', values.status.toString());
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
      form.setFieldsValue({ category_id: undefined });
    } else if (value === 'category') {
      form.setFieldsValue({});
    } else if (value === 'custom') {
      form.setFieldsValue({ category_id: undefined });
    } else if (value === 'collection') {
      form.setFieldsValue({ category_id: undefined });
    }
  };

  if (isLoadingCategories) {
    return <div>Đang tải danh mục...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-6 text-center">Thêm Banner Mới</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            title: '',
            category_id: "",
            type: '',
            status: 0,
          }}
        >
          <Form.Item name="type" label="Loại Banner" className='mb-[10px]'>
            <Select placeholder="Chọn loại banner" onChange={handleTypeChange} allowClear className='h-10'>
              <Option value="main">Banner Chính</Option>
              <Option value="category">Banner Danh Mục</Option>
              <Option value="custom">Banner Tự Do</Option>
              <Option value="collection">Bộ Sưu Tập</Option>
            </Select>
          </Form.Item>
          {bannerType && (
            <>
              <Form.Item name="title" label="Tiêu đề Banner" className='mb-[10px]'>
                <Input placeholder="Nhập tiêu đề banner" className='h-10' />
              </Form.Item>

              {bannerType === 'category' && (
                <Form.Item
                  label="Danh mục"
                  name="category_id"
                  className='mb-[10px]'
                  rules={[{ required: true, message: "Danh mục sản phẩm bắt buộc!" }]}
                >
                  <Cascader options={categoryOptions} className='h-10' />
                </Form.Item>
              )}

              <Form.Item name="status" label="Trạng thái" className='mb-[10px]'>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
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

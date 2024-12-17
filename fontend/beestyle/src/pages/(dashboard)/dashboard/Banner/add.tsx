import React, { useState } from 'react';
import { Button, Cascader, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
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
      const response = await instance.get('api/admins/categories');
      return response.data;
    },
  });
  const parentCategories = categories?.filter((category: any) => category.parent_id === null) || [];

  // Mutation để thêm banner
  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await instance.post('api/admins/banners', formData, {
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
    const formData = new FormData();

    if (values.type) formData.append('type', values.type);
    if (values.title) formData.append('title', values.title);
    if (values.category_id) formData.append('category_id', values.category_id.toString());
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
        <h2 className="text-2xl font-bold mb-5 text-center">Thêm Banner Mới</h2>
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
          {/* Loại Banner */}
          <Form.Item name="type" label="Loại Banner" className='mb-[10px]'>
            <Select placeholder="Chọn loại banner" onChange={handleTypeChange} allowClear className='h-10'>
              <Option value="main">Banner Chính</Option>
              <Option value="category">Banner Danh Mục</Option>
              <Option value="collection">Bộ Sưu Tập</Option>
            </Select>
          </Form.Item>

          {bannerType && (
            <>
              {/* Tiêu đề Banner */}
              <Form.Item
                name="title"
                label="Tiêu đề Banner"
                className='mb-[10px]'
                rules={[
                  { required: true, message: "Tiêu đề banner là bắt buộc" },
                  { min: 5, message: "Tiêu đề banner phải có ít nhất 5 ký tự" },
                  { max: 100, message: "Tiêu đề banner không được vượt quá 100 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tiêu đề banner" className='h-10' />
              </Form.Item>

              {/* Banner Danh Mục */}
              {bannerType === 'category' && (
                <Form.Item
                  label="Danh mục"
                  name="category_id"
                  rules={[{ required: true, message: "Danh mục sản phẩm bắt buộc phải chọn" }]}
                >
                  <Select placeholder="Chọn danh mục">
                    {parentCategories.map((category: any) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {/* Trạng thái */}
              <Form.Item name="status" label="Trạng thái" className='mb-[10px]'>
                <Radio.Group>
                  <Radio value={0}>Không hoạt động</Radio>
                  <Radio value={1}>Hoạt động</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Ảnh Banner */}
              <Form.Item
                name="image"
                label="Ảnh Banner"
                rules={[
                  { required: true, message: "Ảnh banner là bắt buộc" },
                ]}
              >
                <Upload
                  listType="picture"
                  onChange={handleFileChange}
                  beforeUpload={(file) => {
                    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
                    const isValidSize = file.size / 1024 / 1024 < 2;
                    if (!isValidType) {
                      message.error("Chỉ chấp nhận file định dạng JPG hoặc PNG.");
                      return false;
                    }
                    if (!isValidSize) {
                      message.error("Kích thước ảnh phải nhỏ hơn 2MB.");
                      return false;
                    }
                    return true;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          {/* Nút Hành Động */}
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

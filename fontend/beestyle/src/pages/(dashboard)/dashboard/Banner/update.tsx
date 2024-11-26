import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';

const { Option } = Select;

const UpdateBanners: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [bannerType, setBannerType] = useState<string>(''); // Lưu trạng thái `type`

  // Fetch categories
  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admins/categories');
      return response.data;
    },
  });

  // Fetch banner details
  const { data: bannerData, isLoading: bannerLoading, isError: bannerError } = useQuery({
    queryKey: ['banner', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/admins/banners/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Mutation để cập nhật banner
  const { mutate: updateBanner } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosInstance.post(`/api/admins/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' },
      });
    },
    onSuccess: () => {
      messageApi.success('Cập nhật banner thành công!');
      form.resetFields();
      setFileList([]);
      navigate('/admin/dashboard/banner/list'); // Chuyển hướng sau khi thành công
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  // Mutation để xóa ảnh banner
  const { mutate: deleteImage } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`/api/admins/banners/${id}/image`);
    },
    onSuccess: () => {
      messageApi.success('Xóa ảnh thành công!');
      setFileList([]);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  // Xử lý gửi dữ liệu
  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title || '');
    formData.append('type', values.type || '');
    formData.append('status', values.status.toString());
    if (values.category_id) formData.append('category_id', values.category_id.toString());
    if (values.link) formData.append('link', values.link);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image_path', fileList[0].originFileObj);
    }
    updateBanner(formData);
  };

  // Xử lý thay đổi file
  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
  };

  // Xử lý khi thay đổi loại banner
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

  // Pre-fill form với dữ liệu banner
  useEffect(() => {
    if (bannerData) {
      form.setFieldsValue({
        title: bannerData.title,
        type: bannerData.type,
        category_id: bannerData.category_id,
        link: bannerData.link,
        status: bannerData.status,
      });
      setBannerType(bannerData.type);
      if (bannerData.image_path) {
        setFileList([
          {
            uid: '-1',
            name: 'currentImage.png',
            status: 'done',
            url: bannerData.image_path,
          },
        ]);
      }
    }
  }, [bannerData, form]);

  if (categoryLoading || bannerLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (categoryError || bannerError) {
    return <div>Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</div>;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-6 text-center">Cập Nhật Banner</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            title: '',
            type: '',
            status: 1,
            category_id: undefined,
            link: '',
          }}
        >
          <Form.Item
            name="type"
            label="Loại Banner"
            rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
          >
            <Select placeholder="Chọn loại banner" onChange={handleTypeChange} allowClear>
              <Option value="main">Banner Chính</Option>
              <Option value="category">Banner Danh Mục</Option>
              <Option value="custom">Banner Tự Do</Option>
            </Select>
          </Form.Item>

          {bannerType && (
            <>
              <Form.Item
                name="title"
                label="Tiêu đề Banner"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề banner' }]}
              >
                <Input placeholder="Nhập tiêu đề banner" />
              </Form.Item>

              {bannerType === 'category' && (
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
              )}

              {bannerType !== 'main' && (
                <Form.Item
                  name="link"
                  label="Đường link (Tùy chọn)"
                  rules={[
                    {
                      required: bannerType === 'custom',
                      message: 'Vui lòng nhập đường link cho banner tự do',
                    },
                  ]}
                >
                  <Input placeholder="Nhập đường link" />
                </Form.Item>
              )}

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Radio.Group>
                  <Radio value={1}>Hoạt động</Radio>
                  <Radio value={0}>Không hoạt động</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Ảnh Banner"
                name="image"
              >
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                </Upload>
                {fileList.length > 0 && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => deleteImage()}
                    style={{ marginTop: '10px' }}
                  >
                    Xóa ảnh hiện tại
                  </Button>
                )}
              </Form.Item>
            </>
          )}

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => navigate('/admin/dashboard/banner/list')}>Quay lại</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default UpdateBanners;

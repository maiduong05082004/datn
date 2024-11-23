import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Upload, message, Spin, FormProps, Radio } from 'antd';
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

  // Fetch categories
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  // Fetch banner details
  const { data: bannerData, isLoading: bannerLoading } = useQuery({
    queryKey: ['banner', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/banners/${id}`);
      return response.data;
    },
  });

  // Mutation to update banner
  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosInstance.put(`http://127.0.0.1:8000/api/admins/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
          _method: 'PUT',
        },
      });
    },
    onSuccess: () => {
      messageApi.success('Cập nhật banner thành công!');
      form.resetFields();
      setFileList([]);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  // Mutation to delete image
  const { mutate: deleteImage } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`http://127.0.0.1:8000/api/admins/banners/${id}/image`);
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

  useEffect(() => {
    if (bannerData) {
      form.setFieldsValue({
        title: bannerData.title,
        category_id: bannerData.category_id,
        link: bannerData.link,
        type: bannerData.type,
        status: bannerData.status,
      });
      setFileList([
        {
          uid: '-1',
          status: 'done',
          url: bannerData.image_path,
        },
      ]);
    }
  }, [bannerData, form]);

  const onFinish: FormProps<any>["onFinish"] = (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('category_id', values.category_id);
    formData.append('type', values.type);
    formData.append('status', values.status.toString());
    if (values.link) {
      formData.append('link', values.link);
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    mutate(formData);
  };

  const handleFileChange = (info: any) => {
    const { fileList } = info;
    setFileList(fileList);
  };

  if (categoryLoading || bannerLoading) {
    return <Spin tip="Đang tải danh mục và banner..." className="flex justify-center items-center h-screen" />;
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
            category_id: undefined,
            link: '',
            type: 'main',
            status: 1,
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
            name="link"
            label="Đường link (Tùy chọn)"
          >
            <Input placeholder="Nhập đường link" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại Banner"
            rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
          >
            <Select placeholder="Chọn loại banner">
              <Option value="main">Main</Option>
              <Option value="custom">Custom</Option>
              <Option value="category">Category</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Radio.Group>
              <Radio value={1}>Hiển thị</Radio>
              <Radio value={0}>Ẩn</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Ảnh Banner</span>}
            name="image"
          >
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: false,
              }}
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
            </Upload>
            {fileList.length > 0 && (
              <Button
                type="link"
                danger
                onClick={() => deleteImage()}
              >
                Xóa ảnh hiện tại
              </Button>
            )}
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => navigate('/admin/dashboard/banner/list')}>
                Quay lại
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default UpdateBanners;

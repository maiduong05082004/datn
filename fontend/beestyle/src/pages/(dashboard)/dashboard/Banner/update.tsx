import React, { useState, useEffect } from 'react';
import { Button, Cascader, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { toast, ToastContainer } from 'react-toastify';

const { Option } = Select;

const UpdateBanners: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [bannerType, setBannerType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories, isError: categoryError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admins/categories');
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
      toast.success('Cập Nhật Banner Thành Công')
      setFileList([]);
      setLoading(false);
    },
    onError: () => {
      toast.error('Cập Nhật Banner Thất Bại!')
    },
  });

  const { mutate: deleteImage } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`/api/admins/banners/${id}/image`);
    },
    onSuccess: () => {
      toast.success('Xóa Ảnh Thành Công')
      setFileList([]);
    },
    onError: () => {
      toast.error('Xóa Ảnh Thất Bại!')
    },
  });

  const onFinish = (values: any) => {
    setLoading(true);
    const selectedCategoryId = Array.isArray(values.category_id)
      ? values.category_id[values.category_id.length - 1]
      : values.category_id;
    const formData = new FormData();
    formData.append('title', values.title || '');
    formData.append('type', values.type || '');
    formData.append('status', values.status.toString());
    if (selectedCategoryId) formData.append('category_id', selectedCategoryId.toString());
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image_path', fileList[0].originFileObj);
    }
    updateBanner(formData);
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
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
            status: 'done',
            url: bannerData.image_path,
          },
        ]);
      }
    }
  }, [bannerData, form]);

  if (isLoadingCategories || bannerLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (categoryError || bannerError) {
    return <div>Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen p-5">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="type"
            label="Loại Banner"
            className='mb-[10px]'
            rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
          >
            <Select className='h-10' placeholder="Chọn loại banner" onChange={handleTypeChange} allowClear>
              <Option value="main">Banner Chính</Option>
              <Option value="category">Banner Danh Mục</Option>
              <Option value="custom">Banner Tự Do</Option>
              <Option value="collection">Bộ Sưu Tập</Option>
            </Select>
          </Form.Item>

          {bannerType && (
            <>
              <Form.Item
                name="title"
                label="Tiêu đề Banner"
                className='mb-[10px]'
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề banner' }]}
              >
                <Input placeholder="Nhập tiêu đề banner" className='h-10' />
              </Form.Item>

              {bannerType === 'category' && (
                <Form.Item
                  className="mb-[10px]"
                  label="Danh mục"
                  name="category_id"
                  rules={[{ required: true, message: "Danh mục sản phẩm bắt buộc phải chọn" }]}
                >
                  <Cascader options={categoryOptions} className='h-10' />

                </Form.Item>
              )}

              <Form.Item
                name="status"
                label="Trạng thái"
                className='mb-[10px]'
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
                    Xóa ảnh
                  </Button>
                )}
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

export default UpdateBanners;

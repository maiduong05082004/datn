import React, { useState, useEffect } from 'react';
import { Button, Cascader, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
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
      const response = await instance.get('/api/admins/categories');
      return response.data;
    },
  });
  const parentCategories = categories?.filter((category: any) => category.parent_id === null) || [];
  // Fetch banner details
  const { data: bannerData, isLoading: bannerLoading, isError: bannerError } = useQuery({
    queryKey: ['banner', id],
    queryFn: async () => {
      const response = await instance.get(`/api/admins/banners/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Mutation để cập nhật banner
  const { mutate: updateBanner } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await instance.post(`/api/admins/banners/${id}`, formData, {
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
      setLoading(false);
    },
  });

  const { mutate: deleteImage } = useMutation({
    mutationFn: async () => {
      return await instance.delete(`/api/admins/banners/${id}/image`);
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
    const formData = new FormData();
    formData.append('title', values.title || '');
    if (values.type) formData.append('type', values.type);
    formData.append('status', values.status.toString());
    if (values.category_id) formData.append('category_id', values.category_id.toString());
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
          {/* Loại Banner */}
          <Form.Item
            name="type"
            label="Loại Banner"
            className='mb-[10px]'
            rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
          >
            <Select className='h-10' placeholder="Chọn loại banner" onChange={handleTypeChange} allowClear>
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
                  { required: true, message: 'Vui lòng nhập tiêu đề banner' },
                  { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
                  { max: 100, message: 'Tiêu đề không được vượt quá 100 ký tự' },
                ]}
              >
                <Input placeholder="Nhập tiêu đề banner" className='h-10' />
              </Form.Item>

              {/* Danh mục Banner */}
              {bannerType === 'category' && (
                <Form.Item
                  label="Danh mục"
                  name="category_id"
                  className="mb-[10px]"
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

              {/* Ảnh Banner */}
              <Form.Item
                label="Ảnh Banner"
                name="image"
                rules={[
                  { required: true, message: 'Vui lòng tải lên ảnh banner' },
                ]}
              >
                <Upload
                  listType="picture"
                  fileList={fileList}
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

          {/* Hành động */}
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, message, Spin, Checkbox, Image } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  status: boolean;
  image: string | null;
}

const UpdateCategories: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/admins/categories/${id}`);
        setCategoryData(response.data);
        form.setFieldsValue({
          name: response.data.name,
          parent_id: response.data.parent_id,
          status: response.data.status,
        });
      } catch (error) {
        message.error('Không thể tải dữ liệu danh mục.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
        setCategories(response.data);
      } catch (error) {
        message.error('Không thể tải danh sách danh mục cha.');
      }
    };

    fetchCategoryData();
    fetchCategories();
  }, [id, form]);

  const handleUpdateCategory = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('status', values.status ? '1' : '0');

      if (values.parent_id !== undefined && values.parent_id !== null) {
        formData.append('parent_id', String(values.parent_id));
      }

      if (file) {
        formData.append('image', file);
      }

      // Debug FormData để kiểm tra các giá trị
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Sử dụng PUT để cập nhật toàn bộ dữ liệu
      await axios.put(`http://127.0.0.1:8000/api/admins/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      messageApi.success('Cập nhật danh mục thành công!');
      navigate('/admin/listCategories');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    }
  };

  const onFinish = (values: any) => {
    handleUpdateCategory(values);
  };

  if (isLoading) {
    return <Spin tip="Đang tải..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Cập Nhật Danh Mục
          </h2>
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
              {categoryData?.image && (
                <Image
                  width={200}
                  src={
                    categoryData.image.startsWith('http')
                      ? categoryData.image
                      : `http://127.0.0.1:8000/storage/${categoryData.image}`
                  }
                  alt="Category Image"
                  className="mb-4"
                />
              )}
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                >
                  Cập nhật
                </Button>
                <Button
                  onClick={() => navigate('/admin/listCategories')}
                  size="large"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-6"
                >
                  Quay lại
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

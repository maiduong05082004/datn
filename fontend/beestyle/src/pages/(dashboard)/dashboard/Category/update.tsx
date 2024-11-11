import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosInstance from '@/configs/axios';
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
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  const { data: categoriesUpdate, isLoading: isLoadingCategory, refetch } = useQuery({
    queryKey: ['categoriesUpdate', id],
    queryFn: async () => {
      const response = await AxiosInstance.get(`http://127.0.0.1:8000/api/admins/categories/${id}`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (categoryData: FormData) => {
      return await AxiosInstance.post(
        `http://127.0.0.1:8000/api/admins/categories/${id}`, 
        categoryData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          params: {
            _method: 'PUT'
          }
        }
      );
    },
    onSuccess: () => {
      messageApi.success('Cập nhật danh mục thành công!');
      
      // Làm mới lại dữ liệu sau khi cập nhật thành công
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoriesUpdate', id] });
      
      // Reset form và điều hướng về danh sách
      form.resetFields();
      setFile(null);
      navigate('/admin/category/list');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  useEffect(() => {
    if (categoriesUpdate) {
      form.setFieldsValue({
        ...categoriesUpdate,
        status: !!categoriesUpdate?.status,
      });
    }
  }, [categoriesUpdate, form]);

  const onFinish = (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);

    if (!values.name) {
      message.error('Tên danh mục là bắt buộc.');
      return;
    }

    if (values.parent_id) {
      formData.append('parent_id', values.parent_id);
    } else {
      if (file) {
        formData.append('image', file);
      } else if (!categoriesUpdate?.image || isImageDeleted) {
        if (isImageDeleted) {
          formData.append('delete_image', '1');
        }
        message.error('Ảnh là bắt buộc nếu không có danh mục cha.');
        return;
      }
    }

    if (isImageDeleted) {
      formData.append('delete_image', '1');
    }

    formData.append('status', values.status ? '1' : '0');
    mutate(formData);
  };

  if (isLoadingCategories || isLoadingCategory) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin>
          <div className="p-12">
            <p>Đang tải...</p>
          </div>
        </Spin>
      </div>
    );
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
            initialValues={{
              ...categoriesUpdate,
              status: !!categoriesUpdate?.status,
            }}
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
            >
              {categoriesUpdate?.image && !isImageDeleted && (
                <div className="mb-2">
                  <div className="relative w-32">
                    <img 
                      src={categoriesUpdate.image} 
                      alt="Current category" 
                      className="w-32 h-32 object-cover"
                    />
                    <Button 
                      type="primary"
                      danger
                      size="small"
                      className="absolute top-0 right-0"
                      onClick={() => setIsImageDeleted(true)}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    setIsImageDeleted(false);
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
                  Cập Nhật
                </Button>
                <Button
                  onClick={() => navigate('/admin/category/list')}
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

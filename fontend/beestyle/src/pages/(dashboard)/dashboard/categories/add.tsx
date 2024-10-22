import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Form, Input, Select, message, Spin, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';

// Interface cho danh mục (Category)
interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  status: boolean;
  image: string | null;
  children_recursive: Category[];
}

const AddCategories: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null); // State để lưu trữ file hình ảnh

  // Fetch danh sách các danh mục để làm danh mục cha
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/categories');
      return response.data;
    },
  });

  // Mutation để thêm danh mục mới
  const { mutate } = useMutation({
    mutationFn: async (categoryData: FormData) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/categories', categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      // Khi thành công, hiển thị thông báo và reset form
      messageApi.success('Thêm danh mục thành công!');
      form.resetFields();
      setFile(null);
      navigate('/admin/listCategories');
    },
    onError: (error: any) => {
      // Khi có lỗi, hiển thị thông báo lỗi
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  // Hàm xử lý khi nhấn nút "Submit" của form
  const onFinish = (values: any) => {
    const formData = new FormData(); // Sử dụng FormData để gửi dữ liệu dạng multipart
    formData.append('name', values.name);
    
    // Nếu có danh mục cha, thêm parent_id vào formData
    if (values.parent_id) {
      formData.append('parent_id', String(values.parent_id));
    } else {
      // Nếu không có danh mục cha, kiểm tra xem đã chọn ảnh chưa
      if (!file) {
        // Nếu chưa chọn ảnh, hiện thông báo lỗi và kết thúc hàm
        message.error('Ảnh là bắt buộc nếu không có danh mục cha');
        return;
      }
      // Nếu đã chọn ảnh, thêm ảnh vào formData
      formData.append('image', file);
    }
    
    // Nếu trạng thái không được cung cấp, đặt mặc định là '0' (tương ứng với không hoạt động)
    formData.append('status', values.status ? '1' : '0');
    
    // Gửi dữ liệu đi bằng hàm mutate
    mutate(formData);
  };

  // Hiển thị trạng thái tải dữ liệu danh mục cha
  if (isLoading) {
    return <Spin tip="Đang tải..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Thêm Mới Danh Mục
          </h2>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            initialValues={{ status: false }} // Đặt giá trị mặc định cho trạng thái là "false"
          >
            {/* Input cho tên danh mục */}
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

            {/* Select cho danh mục cha (có thể không chọn) */}
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

            {/* Input cho file hình ảnh */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Ảnh</span>}
              name="image"
            >
              <input 
                type="file" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }} 
              />
            </Form.Item>

            {/* Checkbox cho trạng thái của danh mục */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Trạng thái</span>}
              name="status"
              valuePropName="checked" // Sử dụng valuePropName để làm việc với checkbox
            >
              <Checkbox>Hoạt động</Checkbox>
            </Form.Item>

            {/* Các nút "Thêm mới" và "Quay lại" */}
            <Form.Item>
              <div className="flex justify-end space-x-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                >
                  Thêm mới
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

export default AddCategories;

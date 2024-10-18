import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

interface Users {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
  date_of_birth: string;
  sex: 'male' | 'female';
  provider_name?: string | null;
  provider_id?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
}

const AddUser: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (user: Users) => {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/admins/users`,
          user,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return response.data;
      } catch (error: any) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Có lỗi xảy ra';
          throw new Error(errorMessage);
        } else {
          throw new Error('Không thể kết nối tới máy chủ');
        }
      }
    },
    onSuccess: () => {
      messageApi.success('Thêm người dùng thành công');
      form.resetFields();
    },
    onError: (error: Error) => {
      messageApi.error(`Lỗi: ${error.message}`);
    },
  });
  

  const onFinish = (values: any) => {
    const payload: Users = {
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
      is_active: true,
      date_of_birth: values.date_of_birth
        ? values.date_of_birth.format('YYYY-MM-DD')
        : null,
      sex: values.sex || null,
      provider_name: null,
      provider_id: null,
      email_verified_at: null,
      last_login_at: null,
    };
    mutation.mutate(payload);
  };




  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <Form
            form={form}
            name="addUser"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            {/* Name */}
            <Form.Item
              label="Tên Người Dùng"
              name="name"
              rules={[
                { required: true, message: 'Tên người dùng là bắt buộc' },
                { pattern: /^[a-zA-Z\s-]+$/, message: 'Tên chỉ chứa chữ cái, khoảng trắng và dấu gạch nối' },
              ]}
            >
              <Input placeholder="Nhập tên người dùng" size="large" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email là bắt buộc' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập email" size="large" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="date_of_birth"
              rules={[{ required: true, message: 'Ngày sinh là bắt buộc' }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                size="large"
                className="w-full"
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="sex"
              rules={[{ required: true, message: 'Giới tính là bắt buộc' }]}
            >
              <Select
                placeholder="Chọn giới tính"
                size="large"
                options={[
                  { value: 'male', label: 'Nam' },
                  { value: 'female', label: 'Nữ' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vai trò là bắt buộc' }]}
            >
              <Select
                placeholder="Chọn vai trò"
                size="large"
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'user', label: 'User' },
                  { value: 'moderator', label: 'Moderator' },
                ]}
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end space-x-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                >
                  Thêm Người Dùng
                </Button>
                <Button
                  size="large"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-6"
                  onClick={() => form.resetFields()}
                >
                  Đặt Lại
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUser;

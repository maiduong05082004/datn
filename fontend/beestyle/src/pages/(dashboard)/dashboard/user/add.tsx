import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

interface Users {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
  date_of_birth: string;
  sex: 'male' | 'female';
  email_verified_at?: string | null;
  provider_name?: string | null;
  provider_id?: string | null;
  last_login_at?: string | null;
}

const AddUser: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (user: Users) => {
      try {
        return await axios.post(`http://127.0.0.1:8000/api/admins/users`, user);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      messageApi.success('Thêm người dùng thành công');
      form.resetFields();
      setLoading(false);
    },
    onError: (error: Error) => {
      messageApi.error(`Lỗi: ${error.message}`);
      setLoading(false);
    },
  });

  const onFinish = (values: any) => {
    setLoading(true);
    const payload: Users = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      password: values.password.trim(),
      address: values.address.trim(),
      role: values.role,
      is_active: true,
      date_of_birth: values.date_of_birth
        ? values.date_of_birth.format('YYYY-MM-DD')
        : '',
      sex: values.sex,
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
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <Form
            form={form}
            name="addUser"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <Form.Item
              label="Tên Người Dùng"
              name="name"
              rules={[{ required: true, message: 'Tên người dùng là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên người dùng" size="large" />
            </Form.Item>

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
              label="Số Điện Thoại"
              name="phone"
              rules={[
                { required: true, message: 'Số điện thoại là bắt buộc' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>

            <Form.Item
              label="Địa Chỉ"
              name="address"
              rules={[
              ]}
            >
              <Input placeholder="Địa chỉ" size="large" />
            </Form.Item>

            <Form.Item
              label="Mật Khẩu"
              name="password"
              rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" size="large" />
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

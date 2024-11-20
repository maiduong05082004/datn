import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, message, FormProps, Spin } from 'antd';
import axiosInstance from '@/configs/axios';

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Users {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

const UpdateUser: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user details
  const { data: userManager, isLoading } = useQuery({
    queryKey: ['userManager', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/users/${id}`);
      return response.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (user: Users) => {
        const response = await axiosInstance.put(
          `http://127.0.0.1:8000/api/admins/users/${id}`,
          user,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return response.data;
    },
    onSuccess: () => {
      messageApi.success('Cập nhật người dùng thành công');
      queryClient.invalidateQueries({
        queryKey: ['userManager'],
      })
    },
    onError: (error: Error) => {
      messageApi.error(`Lỗi: ${error.message}`);
    },
  });

  const onFinish: FormProps<Users>['onFinish'] = (values) => {
    mutate(values);
  };

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen p-5">
        <div className="w-full max-w-8xl">
          <Form
            form={form}
            name="updateUser"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
            initialValues={{...userManager}}
          >
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
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Số điện thoại là bắt buộc' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Mật khẩu là bắt buộc' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" size="large" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: 'Địa chỉ là bắt buộc' },
              ]}
            >
              <Input placeholder="Nhập địa chỉ" size="large" />
            </Form.Item>

            <Form.Item>
              <div className='flex justify-end space-x-4'>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button onClick={() => navigate('/admin/dashboard/user/list')}>
                  Back
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;

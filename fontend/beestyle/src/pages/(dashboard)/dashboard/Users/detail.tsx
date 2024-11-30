import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Button, Input, Form, message } from 'antd';
import axiosInstance from '@/configs/axios';

type Props = {};

interface UserDetail {
  id: number;
  name: string;
  date_of_birth: string | null;
  sex: 'male' | 'female' | null;
  email: string;
  address: string | null;
  phone: string | null;
  email_verified_at: string | null;
  provider_name: string | null;
  provider_id: string | null;
  role: 'admin' | 'user' | 'moderator';
}

const DetailUser: React.FC<Props> = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Fetch user detail using React Query
  const { data: userDetail, isLoading } = useQuery<UserDetail>({
    queryKey: ['userDetail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/users/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." className="flex justify-center items-center h-screen" />;
  }

  if (!userDetail) {
    return <div className="text-center text-lg text-red-500 font-semibold">Không tìm thấy thông tin người dùng</div>;
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
            className="space-y-6"
            initialValues={{ ...userDetail }}
            disabled 
          >
            <Form.Item
              label="Tên Người Dùng"
              name="name"
              rules={[
                { required: true, message: 'Tên người dùng là bắt buộc' },
                { pattern: /^[a-zA-Z\s-]+$/, message: 'Tên chỉ chứa chữ cái, khoảng trắng và dấu gạch nối' },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email là bắt buộc' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Số điện thoại là bắt buộc' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Địa chỉ là bắt buộc' }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => navigate('/admin/dashboard/user/list')}>Back</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DetailUser;

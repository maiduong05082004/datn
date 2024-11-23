import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Descriptions, Button, Card } from 'antd';
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
  last_login_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const DetailUser: React.FC<Props> = () => {
  const { id } = useParams();
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
    <div className="p-5">
        <Descriptions
          bordered
          size="middle"
          column={{ xs: 1, sm: 1, md: 3 }}
          className="w-full"
        >
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Tên người dùng</span>}>
            {userDetail.name}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Ngày sinh</span>}>
            {userDetail.date_of_birth ? userDetail.date_of_birth : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Email</span>}>
            {userDetail.email}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Địa chỉ</span>}>
            {userDetail.address ? userDetail.address : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Số điện thoại</span>}>
            {userDetail.phone ? userDetail.phone : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Quyền</span>}>
            {userDetail.role}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Trạng thái hoạt động</span>}>
            {userDetail.is_active ? 'Hoạt động' : 'Không hoạt động'}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Ngày tạo</span>}>
            {new Date(userDetail.created_at).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Ngày cập nhật</span>}>
            {new Date(userDetail.updated_at).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Lần đăng nhập cuối</span>}>
            {userDetail.last_login_at
              ? new Date(userDetail.last_login_at).toLocaleDateString()
              : 'Chưa có thông tin'}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold text-gray-800">Email đã xác thực</span>}>
            {userDetail.email_verified_at ? 'Đã xác thực' : 'Chưa xác thực'}
          </Descriptions.Item>
        </Descriptions>      
      <div className="flex justify-end mt-5">
        <Button type="primary" onClick={() => navigate('/admin/dashboard/user/list')}>
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default DetailUser;

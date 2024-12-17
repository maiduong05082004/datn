import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type Props = {};

const Logout = (props: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Gọi API logout
        await axios.post('http://localhost:8000/api/client/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Token được lấy từ localStorage
          },
        });

        // Xóa token và các thông tin khác nếu cần
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Xóa user info (nếu có)

        toast.success('Đăng xuất thành công!'); // Thông báo thành công

        // Chuyển hướng về trang đăng nhập
        navigate('/login');
      } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        toast.error('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!');
      }
    };

    handleLogout();
  }, [navigate]);

  return <div>Đang đăng xuất...</div>;
};

export default Logout;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      alert('Đăng nhập bằng Google thành công!');
      navigate('/');
    } else {
      alert('Lỗi khi đăng nhập bằng Google');
      navigate('/signup');
    }
  }, [navigate]);

  return <div>Đang xử lý đăng nhập Google...</div>;
};

export default GoogleCallback;

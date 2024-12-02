import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/user';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginUser(email, password);
      
      localStorage.setItem('authToken', response.token);

      navigate('/');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      alert('Đăng nhập thất bại: ' + (error as any).response?.data?.message || 'Lỗi không xác định');
    }
  };

  return (
    <main>
      <div className="px-[15px]">
        <div className="my-[24px] max-w-[430px] mx-auto lg:my-[60px]">
          <div className="mb-[30px]">
            <h1 className='text-[24px] font-[700] text-center mb-[24px]'>ĐĂNG NHẬP</h1>
            <div className="text-[14px] font-[500]">
              Đăng ký thành viên và nhận ngay ưu đãi 10% cho đơn hàng đầu tiên
              <br />
              Nhập mã: <b>BEESTYLEWELCOME</b>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="">
              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="email">EMAIL</label>
                <input
                  className='border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]'
                  type="email"
                  id="email"
                  placeholder='Email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="password">MẬT KHẨU</label>
                <input
                  className='border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]'
                  type="password"
                  id="password"
                  placeholder='Mật khẩu'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-[100%] text-[16px] mt-[24px]">
                <button type="submit" className='px-[32px] py-[12px] bg-black text-white rounded-[4px]'>ĐĂNG NHẬP</button>
              </div>

              <div className="mt-[16px] flex justify-center items-center *:text-[14px] *:text-[#787878] *:font-[500]">
                <a href="">Quên mật khẩu?</a>
                <span className='mx-[10px]'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2" height="10" viewBox="0 0 2 10" fill="none"> <rect x="0.5" width="1" height="10" fill="#D0D0D0"></rect> </svg>
                </span>
                <a href="/signup">Đăng ký</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signin;

import React, { useState } from 'react';
import { sendForgotPasswordEmail } from '@/services/user'; // Service API để gọi backend.

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await sendForgotPasswordEmail(email);
      setSuccessMessage('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.');
    } catch (error) {
      setErrorMessage('Không thể gửi email khôi phục. Vui lòng thử lại.');
    }
  };

  return (
    <main>
      <div className="px-[15px]">
        <div className="my-[24px] max-w-[430px] mx-auto lg:my-[60px]">
          <h1 className="text-[24px] font-[700] text-center mb-[24px]">QUÊN MẬT KHẨU</h1>

          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
              <label className="mb-[8px] font-[500]" htmlFor="email">EMAIL</label>
              <input
                className="border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]"
                type="email"
                id="email"
                placeholder="Nhập email của bạn"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-[100%] text-[16px] mt-[24px]">
              <button type="submit" className="px-[32px] py-[12px] bg-black text-white rounded-[4px]">
                Gửi Yêu Cầu
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;

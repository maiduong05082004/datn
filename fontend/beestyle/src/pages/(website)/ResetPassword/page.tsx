import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '@/services/user';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (password !== confirmPassword) {
        setErrorMessage('Mật khẩu xác nhận không khớp.');
        return;
    }

    try {
        await resetPassword({ 
            token: token || '', 
            password, 
            password_confirmation: confirmPassword
        });
        setSuccessMessage('Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập.');
    } catch (error: any) {
        const errorData = error.response?.data || {};
        const errorMessage = errorData.errors?.password?.[0] || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
        setErrorMessage(errorMessage);
    }
};

  return (
    <main>
      <div className="px-[15px]">
        <div className="my-[24px] max-w-[430px] mx-auto lg:my-[60px]">
          <h1 className="text-[24px] font-[700] text-center mb-[24px]">ĐẶT LẠI MẬT KHẨU</h1>

          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
              <label className="mb-[8px] font-[500]" htmlFor="password">MẬT KHẨU MỚI</label>
              <input
                className="border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]"
                type="password"
                id="password"
                placeholder="Nhập mật khẩu mới"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
              <label className="mb-[8px] font-[500]" htmlFor="confirm-password">XÁC NHẬN MẬT KHẨU</label>
              <input
                className="border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px]"
                type="password"
                id="confirm-password"
                placeholder="Nhập lại mật khẩu"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-[100%] text-[16px] mt-[24px]">
              <button type="submit" className="px-[32px] py-[12px] bg-black text-white rounded-[4px]">
                Đặt Lại Mật Khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;

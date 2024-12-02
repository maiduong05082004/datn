import { useState } from 'react';
import { registerUser } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import { SignupSchema } from '../../common/validations/user';

type TAuth = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  date: string;
  sex: string;
};

const Signup = () => {
  const [formData, setFormData] = useState<TAuth>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    date: '',
    sex: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = SignupSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors: { [key: string]: string } = {};
      error.details.forEach(detail => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        date_of_birth: formData.date,
        sex: formData.sex,
      });
      localStorage.setItem('authToken', response.token);
      alert('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      alert('Đăng ký thất bại: ' + (error as any).response.data.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/google');
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Đăng ký bằng Google thất bại:', error);
      alert('Đăng ký bằng Google thất bại');
    }
  };

  return (
    <main>
      <div className="px-[15px]">
        <div className="my-[32px] max-w-[430px] mx-auto lg:my-[60px]">
          <div className="mb-[15px]">
            <h1 className='text-[16px] font-[700] mb-[16px] lg:text-[20px]'>Thông tin đăng ký</h1>
            <div className="text-[14px] font-[500]">
              Đăng ký thành viên và nhận ngay ưu đãi 10% cho đơn hàng đầu tiên
              <br />
              Nhập mã:
              <b>BEESTYLEWELCOME</b>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="name">Họ và Tên</label>
                <input
                  className={`border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px] ${errors.name ? 'border-red-500' : ''}`}
                  type="text"
                  name="name"
                  placeholder='Họ và tên'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="email">Email</label>
                <input
                  className={`border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px] ${errors.email ? 'border-red-500' : ''}`}
                  type="email"
                  name="email"
                  placeholder='Nhập email'
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="password">Mật khẩu</label>
                <input
                  className={`border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px] ${errors.password ? 'border-red-500' : ''}`}
                  type="password"
                  name="password"
                  placeholder='Mật khẩu'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="password"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                <input
                  className={`mt-[8px] border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px] ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  type="password"
                  name="confirmPassword"
                  placeholder='Xác nhận mật khẩu'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="confirmPassword"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="sex">Giới tính</label>
                <div className="flex">
                  <div className="flex items-center">
                    <input
                      className="mr-[5px]"
                      type="radio"
                      name="sex"
                      value="male"
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="">Nam</label>
                  </div>
                  <div className="flex items-center ml-[50px]">
                    <input
                      className="mr-[5px]"
                      type="radio"
                      name="sex"
                      value="female"
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="">Nữ</label>
                  </div>
                </div>
                {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
              </div>

              <div className="mt-[24px] flex flex-col w-[100%] text-[14px]">
                <label className='mb-[8px] font-[500]' htmlFor="date">Ngày sinh</label>
                <input
                  className={`border-[#808080] border-[1px] rounded-[4px] px-[16px] py-[12px] font-[600] ${errors.date ? 'border-red-500' : ''}`}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>

              <div className="flex flex-col w-[100%] text-[16px] mt-[24px]">
                <button type='submit' className='px-[32px] py-[12px] bg-black text-white rounded-[4px]'>ĐĂNG KÝ</button>
              </div>
            </div>
          </form>

          <div className="flex justify-evenly my-[32px] *:text-[14px] *:text-[#787878]">
            <button onClick={handleGoogleSignup}>
              <div className="mb-[5px] flex justify-center items-center">
                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRcJCBNNt1a5beIvBpfZ_vM82U1B3AHdou0Pi50225Ng5dtIE_R" alt="" width={40} height={40} />
              </div>
              <span>DĂNG KÝ GOOGLE</span>
            </button>
            <button>
              <div className="mb-[5px] flex justify-center items-center">
                <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTFPNc3va29d6z1y9PQDmou5b5VlkC7t2u0swQfnJBKsE3Im2wF" alt="" width={40} height={40} />
              </div>
              <span>ĐĂNG NHẬP FACEBOOK</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
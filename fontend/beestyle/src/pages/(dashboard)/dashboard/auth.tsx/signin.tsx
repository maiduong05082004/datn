import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import icon
import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import { message } from 'antd';
import { useNavigate, Link } from 'react-router-dom'; // Import Link từ react-router-dom
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'; // Import các icon mới

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
    const [errors, setErrors] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const [messageAPI, contextHolder] = message.useMessage();

    const { mutate } = useMutation({
        mutationFn: async (auth) => {
            try {
                const response = await instance.post(`http://localhost:8000/api/admins/signin`, auth);
                return response.data;
            } catch (error) {
                throw error;
            }

        },
        onSuccess: (data) => {
            messageAPI.success("Đăng nhập thành công!");
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/admin/dashboard");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
            messageAPI.error(errorMessage);
        }

    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset lỗi
        let validationErrors = { email: '', password: '' };
        let hasError = false;

        // Kiểm tra email
        if (!email.trim()) {
            validationErrors.email = 'Vui lòng điền đầy đủ email';
            hasError = true;
        }

        // Kiểm tra password
        if (!password.trim()) {
            validationErrors.password = 'Vui lòng nhập mật khẩu';
            hasError = true;
        }

        setErrors(validationErrors);

        // Nếu không có lỗi, xử lý đăng nhập
        if (!hasError) {
            mutate({ email, password });
        }
    };

    return (
<div className="flex items-center justify-center min-h-screen bg-white">
    {contextHolder}
    <div className="bg-white p-8 rounded-md max-w-md w-full text-black shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">BEESTYLE</h1>
        <h2 className="text-lg text-gray-600 text-center mb-6">Sign in to your account</h2>

        <form onSubmit={handleSubmit}>
    <div className="mb-4">
        <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800 mb-2"
        >
            Email <span className="text-red-500">*</span>
        </label>

        <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 ${errors.email ? 'border border-red-500' : 'border border-black'}`}
            placeholder="Enter your email"
        />
        {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
    </div>

    <div className="mb-4">
        <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800 mb-2"
        >
            Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">
    <input
        type={showPassword ? 'text' : 'password'} // Hiển thị hoặc ẩn mật khẩu
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-full px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 ${errors.password ? 'border border-red-500' : 'border border-black'}`}
        placeholder="Enter your password"
    />

    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-500"
    >
        <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye} // Biểu tượng mắt, thay đổi theo trạng thái
            size="sm" // Kích thước nhỏ hơn
        />
    </button>
</div>

        {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
    </div>

    <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-black">
            <input
                type="checkbox"
                className="form-checkbox text-black bg-gray-100"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>

        <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-500">
            Forgot password?
        </Link>
    </div>

    <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md transition"
    >
        Sign In
    </button>
</form>


        <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">OR</p>

            <button
                type="button"
                className="w-full py-2 mt-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-md transition"
            >
                Use a Sign-In Code
            </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
            New to Beestyle?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500">
                Sign up now.
            </Link>
        </p>

        <p className="mt-4 text-xs text-gray-500 text-center">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <a href="#" className="text-gray-400 hover:text-gray-300">
                Learn more.
            </a>
        </p>
    </div>
</div>






    );

};


export default Signin;

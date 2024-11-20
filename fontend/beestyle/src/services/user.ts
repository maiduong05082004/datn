import baseAPI from '@/configs/axios';
import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/client/auth';
export const registerUser = async (userData: { name: string; email: string; password: string; password_confirmation: string; date_of_birth: string; sex: string; }) => {
    try {
        const response = await baseAPI.post('api/signup', userData);
        return response.data;
    } catch (error) {
        console.error('Đăng ký thất bại:', error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await baseAPI.post('api/signin', { email, password });
        localStorage.setItem('authToken', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Đăng nhập thất bại:', error);
        throw error;
    }
};


export const getUserProfile = async (userId: string) => {
    try {
        const response = await baseAPI.get(`api/client/auth/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Lấy thông tin người dùng thất bại:', error);
        throw error;
    }
};

export const updateUserProfile = async (userId: string, userData: { name?: string; email?: string; date?: string; sex?: string; }) => {
    try {
        const response = await baseAPI.put(`api/client/auth/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Cập nhật thông tin người dùng thất bại:', error);
        throw error;
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await baseAPI.delete(`api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Xóa người dùng thất bại:', error);
        throw error;
    }
};

export const sendForgotPasswordEmail = async (email: string) => {
    return axios.post(`${BASE_URL}/forgot-password`, { email });
};

export const resetPassword = async (data: { token: string; password: string; password_confirmation: string}) => {
    return axios.post(`${BASE_URL}/reset-password`, data);
};

export const updateUserInfo = async (data: {
    name?: string;
    date_of_birth?: string;
    sex?: string;
    phone?: string;
    address?: string;
}) => {
    const response = await axios.put('/api/client/auth/update', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    return response.data;
};


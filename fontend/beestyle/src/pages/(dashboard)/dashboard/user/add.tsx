import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Form, Input, Radio, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

interface UserForm {
  name: string;
  date_of_birth: string;
  sex: string;
  email: string;
  password: string;
  address: string;
}

const AddUser: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Mutation to add a new user
  const { mutate, isLoading: isSubmitting } = useMutation({
    mutationFn: async (userData: UserForm) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/users', userData);
    },
    onSuccess: () => {
      messageApi.success('Thêm người dùng thành công!');
      form.resetFields();
      navigate('/admin/listUser');
    },
    onError: (error: any) => {
      messageApi.error(`Lỗi: ${error.message}`);
    },
  });

  // Handle form submission
  const onFinish = (values: UserForm) => {
    mutate(values);
  };

  if (isSubmitting) {
    return <Spin tip="Đang gửi..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className={`container mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
          <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
            Thêm tài khoản mới
          </h1>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Tên người dùng</span>}
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
            >
              <Input className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Ngày sinh</span>}
              name="date_of_birth"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <Input type="date" className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Giới tính</span>}
              name="sex"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Radio.Group>
                <Radio value="male" className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Nam</Radio>
                <Radio value="female" className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Nữ</Radio>
                <Radio value="other" className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Khác</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Email</span>}
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Địa chỉ</span>}
              name="address"
            >
              <Input className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end space-x-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                >
                  Thêm mới
                </Button>
                <Button
                  onClick={() => navigate('/admin/listUser')}
                  size="large"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-6"
                >
                  Quay lại
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

    </>
  );
};

export default AddUser;

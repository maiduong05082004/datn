import React, { useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

interface BannerForm {
  title: string;
  image_path: string;
  link: string;
}

const UpdateBanners: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onFinish = (values: BannerForm) => {
    setIsSubmitting(true);
    // Add your axios request here
    // axios.post('URL_TO_API', values)
    setTimeout(() => {
      messageApi.success('Thêm banner thành công!');
      form.resetFields();
      setIsSubmitting(false);
      navigate('/admin/listBanners');
    }, 2000); // Mocking async request
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
            Cập nhật banners
          </h1>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Tiêu đề</span>}
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Image</span>}
              name="image_path"
              rules={[{ required: true, message: 'Vui lòng nhập đường dẫn ảnh' }]}
            >
              <Input className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`} />
            </Form.Item>

            <Form.Item
              label={<span className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Liên kết</span>}
              name="link"
              rules={[{ required: true, message: 'Vui lòng nhập liên kết' }]}
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
                  Cập nhật
                </Button>
                <Button
                  onClick={() => navigate('/admin/listBanners')}
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

export default UpdateBanners;

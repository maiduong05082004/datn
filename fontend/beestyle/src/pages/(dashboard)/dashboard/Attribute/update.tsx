import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, message, Card, Select, Spin } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;

const UpdateAttribute: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: attribute, isLoading } = useQuery({
    queryKey: ['attribute', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/attributes/${id}`);
      return response.data;
    },
  });


  const updateAttributeMutation = useMutation({
    mutationFn: async (updatedAttribute: { name: string; attribute_type: number }) => {
      return await axiosInstance.put(
        `http://127.0.0.1:8000/api/admins/attributes/${id}`,
        updatedAttribute
      );
    },
    onSuccess: () => {
      messageApi.success('Cập nhật thuộc tính thành công!');
      queryClient.invalidateQueries({ queryKey: ['attribute'] });
    },
    onError: (error: any) => {
      messageApi.error(
        `Cập nhật thuộc tính thất bại: ${error.response?.data?.message || error.message}`
      );
    },
  });

  const onFinish = (values: { name: string; attribute_type: number }) => {
    updateAttributeMutation.mutate(values);
  };

  if (isLoading) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  }


  return (
    <>
      {contextHolder}
      <div className="min-h-screen p-5">
        <div className="w-full max-w-8xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ ...attribute?.data }}
          >
            <Form.Item
              label="Tên thuộc tính"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính' }]}
            >
              <Input placeholder="Nhập tên thuộc tính" />
            </Form.Item>
            <Form.Item
              label="Phân cấp thuộc tính"
              name="attribute_type"
              rules={[{ required: true, message: 'Vui lòng chọn loại thuộc tính' }]}
            >
              <Select placeholder="Chọn loại thuộc tính">
                <Option value={0}>Cấp bậc cha</Option>
                <Option value={1}>Cấp bậc con</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <div className='flex justify-end space-x-4'>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  onClick={() => navigate('/admin/dashboard/attribute/list')}
                >
                  Back
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateAttribute;

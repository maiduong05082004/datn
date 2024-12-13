import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, message, Card, Select, Spin } from 'antd';
import instance from '@/configs/axios';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

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
      const response = await instance.get(`api/admins/attributes/${id}`);
      return response.data;
    },
  });


  const updateAttributeMutation = useMutation({
    mutationFn: async (updatedAttribute: { name: string; attribute_type: number }) => {
      return await instance.put(
        `api/admins/attributes/${id}`,
        updatedAttribute
      );
    },
    onSuccess: () => {
      toast.success(`Cập Nhật Thuộc Tính Thành Công`)
      queryClient.invalidateQueries({ queryKey: ['attribute'] });
    },
    onError: () => {
      toast.success(`Cập Nhật Thuộc Tính Thất Bại!`)
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
      <ToastContainer />
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
              className='mb-[10px] '
              rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính' }]}
            >
              <Input placeholder="Nhập tên thuộc tính" className='h-10' />
            </Form.Item>
            <Form.Item
              label="Phân cấp thuộc tính"
              name="attribute_type"
              rules={[{ required: true, message: 'Vui lòng chọn loại thuộc tính' }]}
            >
              <Select placeholder="Chọn loại thuộc tính" className='h-10'>
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

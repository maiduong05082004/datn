import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, Select } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

type Props = {};

const AddAttributeGroup = (props: Props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);

  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attributes');
      return response?.data?.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (attributeGroup: any) => {
      return await axiosInstance.post('http://127.0.0.1:8000/api/admins/attribute_groups', attributeGroup);
    },
    onSuccess: () => {
      toast.success('Thêm Nhóm Thuộc Tính Thành Công')
      form.resetFields();
      setSelectedAttributes([]);
    },
    onError: () => {
      toast.error('Thêm Nhóm Thuộc Tính Thất Bại!')
    },
  });

  const handleFinish = (values: any) => {
    const attributeGroup = {
      group_name: values.group_name,
      attribute_id: selectedAttributes,
    };
    mutation.mutate(attributeGroup);
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen">
        <div className="w-full max-w-8xl p-5 rounded-xl">
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              className='mb-[10px] '
              label="Tên Nhóm Biến Thể"
              name="group_name"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhóm biến thể' }]}
            >
              <Input placeholder="Nhập tên nhóm biến thể" className='h-10' />
            </Form.Item>

            <Form.Item label="Thuộc Tính">
              <Select
              className='h-10'
                mode="multiple"
                placeholder="Chọn thuộc tính"
                value={selectedAttributes}
                onChange={(value) => setSelectedAttributes(value)}
                style={{ width: '100%' }}
              >
                {attributes?.map((attr: any) => (
                  <Select.Option key={attr.id} value={attr.id}>
                    {attr.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <div className='flex justify-end space-x-4'>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  onClick={() => navigate('/admin/dashboard/attribute_group/list')}
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

export default AddAttributeGroup;

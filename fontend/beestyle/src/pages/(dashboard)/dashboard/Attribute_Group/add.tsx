import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, message, Space, Divider, Select, Typography, Card } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

type Props = {};

const AddAttributeGroup = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const navigate = useNavigate();

  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');
      return response?.data?.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (attributeGroup: any) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/attribute_groups', attributeGroup);
    },
    onSuccess: () => {
      messageApi.success('Thêm nhóm thuộc tính thành công!');
      form.resetFields();
      setSelectedAttributes([]);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
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
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg">
          <Title level={3} className="text-center mb-8 text-gray-700">
            Thêm Mới Nhóm Thuộc Tính
          </Title>
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Tên Nhóm Biến Thể"
              name="group_name"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhóm biến thể' }]}
            >
              <Input placeholder="Nhập tên nhóm biến thể" />
            </Form.Item>

            <Form.Item label="Thuộc Tính">
              <Select
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

            <Divider />
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
                  onClick={() => navigate('/admin/attribute_group/list')}
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

export default AddAttributeGroup;

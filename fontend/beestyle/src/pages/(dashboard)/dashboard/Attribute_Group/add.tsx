import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, message, Space, Divider, Select, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

type Props = {};

const { Title } = Typography;

const AddAttributeGroup = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);

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
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Thêm Mới Danh Mục
          </h2>
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
              <Button type="primary" htmlType="submit">
                Thêm Nhóm Biến Thể
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddAttributeGroup;

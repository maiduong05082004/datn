import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, message, Divider, Select, Typography } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const UpdateAttributeGroup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const { id } = useParams();

  // Fetch attributes
  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');
      return response?.data?.data;
    },
  });

  // Fetch specific attribute group by ID
  const { data: attributeGroup } = useQuery({
    queryKey: ['attributeGroup', id],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`);
      return response?.data;
    },
  });
  
  useEffect(() => {
    if (attributeGroup) {
      form.setFieldsValue({
        group_name: attributeGroup.variation[0]?.group_name,
      });
      setSelectedAttributes(attributeGroup.variation[0]?.attributes.map((attr: any) => attr.id) || []);
    }
  }, [attributeGroup, form]);
  

  const mutation = useMutation({
    mutationFn: async (updatedGroup: any) => {
      return await axios.put(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`, updatedGroup);
    },
    onSuccess: () => {
      messageApi.success('Cập nhật nhóm thuộc tính thành công!');
      form.resetFields();
      setSelectedAttributes([]);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  // Handle form submission
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
          <Title level={2} className="text-center mb-8">Cập Nhật Danh Mục</Title>
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
                onChange={setSelectedAttributes}
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
              <Button type="primary" htmlType="submit">Cập Nhật Nhóm Biến Thể</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateAttributeGroup;

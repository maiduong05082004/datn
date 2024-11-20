import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, message, Divider, Select, Typography } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const UpdateAttributeGroup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch attributes
  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attributes');
      return response?.data?.data;
    },
  });

  // Fetch specific attribute group by ID
  const { data: attributeGroup } = useQuery({
    queryKey: ['attributeGroup', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`);
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
      return await axiosInstance.put(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`, updatedGroup);
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
      <div className="min-h-screen p-5">
        <div className="w-full max-w-8x">
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
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateAttributeGroup;

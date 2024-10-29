import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, message, Space, Divider } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

interface Attribute {
  name: string;
  values: string;
}

type Props = {};

const AddAttributeGroup = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [attributes, setAttributes] = useState<Attribute[]>([{ name: '', values: '' }]);

  const { mutate } = useMutation({
    mutationFn: async (attributeGroup: any) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/attribute_groups', attributeGroup);
    },
    onSuccess: () => {
      messageApi.success('Thêm danh mục thành công!');
      form.resetFields();
      setAttributes([{ name: '', values: '' }]);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const attributeGroup = {
      group_name: values.name,
      attributes: attributes.map((attr, index) => ({
        name: attr.name,
        attribute_type: 1, // Hoặc bạn có thể xác định type phù hợp từ form
        attribute_values: attr.values.split(',').map((value, idx) => ({
          id: idx + 1, // Bạn có thể cần xác định cách tạo `id` hợp lý nếu API yêu cầu
          value: value.trim(),
        })),
      })),
    };
    
    console.log(attributeGroup); // Debug xem dữ liệu có đúng không trước khi gửi
    mutate(attributeGroup);
  };
  
  

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', values: '' }]);
  };

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = {
      ...newAttributes[index],
      [field]: value,
    };
    setAttributes(newAttributes);
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-3xl bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Thêm Mới Nhóm Thuộc Tính
          </h2>
          <Form
            form={form}
            name="attribute_group_form"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <Form.Item
              label={<span className="font-medium text-gray-700">Tên nhóm thuộc tính</span>}
              name="name"
              rules={[{ required: true, message: 'Tên nhóm thuộc tính là bắt buộc' }]}
            >
              <Input
                placeholder="Nhập tên nhóm thuộc tính"
                size="large"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </Form.Item>

            <Divider>Thuộc Tính</Divider>
            {attributes.map((attr, index) => (
              <Space key={index} direction="vertical" className="w-full">
                <Form.Item
                  label={`Tên thuộc tính ${index + 1}`}
                  required
                  className="font-medium text-gray-700"
                >
                  <Input
                    placeholder="Tên thuộc tính"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    size="large"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </Form.Item>
                <Form.Item
                  label="Giá trị thuộc tính (cách nhau bằng dấu phẩy)"
                  required
                  className="font-medium text-gray-700"
                >
                  <Input
                    placeholder="Nhập các giá trị, ví dụ: S, M, L"
                    value={attr.values}
                    onChange={(e) => handleAttributeChange(index, 'values', e.target.value)}
                    size="large"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </Form.Item>
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={handleAddAttribute}
              className="w-full mt-4 py-2 font-semibold text-indigo-600 border border-indigo-400"
            >
              Thêm thuộc tính
            </Button>

            <Form.Item className="text-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Thêm Nhóm Thuộc Tính
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddAttributeGroup;

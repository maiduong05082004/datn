import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, message, Space, Divider, Select, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

interface Attribute {
  name: string;
  attribute_type: number;
  attribute_values: { id: number; value: string }[];
}

type Props = {};

const { Title } = Typography;

const AddAttributeGroup = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: '', attribute_type: 1, attribute_values: [{ id: 1, value: '' }] },
  ]);

  const { mutate } = useMutation({
    mutationFn: async (attributeGroup: any) => {
      return await axios.post('http://127.0.0.1:8000/api/admins/attribute_groups', attributeGroup);
    },
    onSuccess: () => {
      messageApi.success('Thêm nhóm thuộc tính thành công!');
      form.resetFields();
      setAttributes([{ name: '', attribute_type: 1, attribute_values: [{ id: 1, value: '' }] }]);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
      messageApi.error(errorMessage);
    },
  });

  const onFinish = (values: any) => {
    const attributeGroup = {
      group_name: values.name,
      attributes: attributes.map((attr) => ({
        name: attr.name,
        attribute_type: attr.attribute_type,
        attribute_values: attr.attribute_values,
      })),
    };

    console.log(attributeGroup); // Debug xem dữ liệu có đúng không trước khi gửi
    mutate(attributeGroup);
  };

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { name: '', attribute_type: 1, attribute_values: [{ id: attributes.length + 1, value: '' }] },
    ]);
  };

  const handleAttributeChange = (index: number, field: string, value: any) => {
    const updatedAttributes = [...attributes];
    if (field === 'name') {
      updatedAttributes[index].name = value;
    } else if (field === 'attribute_type') {
      updatedAttributes[index].attribute_type = value;
    }
    setAttributes(updatedAttributes);
  };

  const handleAddAttributeValue = (index: number) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].attribute_values.push({ id: updatedAttributes[index].attribute_values.length + 1, value: '' });
    setAttributes(updatedAttributes);
  };

  const handleAttributeValueChange = (attrIndex: number, valueIndex: number, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attrIndex].attribute_values[valueIndex].value = value;
    setAttributes(updatedAttributes);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
      {contextHolder}
      <Title level={2} className="text-center text-blue-700 mb-8">Thêm Nhóm Thuộc Tính</Title>
      <Form form={form} onFinish={onFinish} layout="vertical" className="space-y-8">
        <Form.Item
          label="Tên nhóm thuộc tính"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhóm thuộc tính' }]}
        >
          <Input className="w-full p-3 border border-gray-300 rounded-md" />
        </Form.Item>

        {attributes.map((attribute, index) => (
          <div key={index} className="p-6 border border-gray-300 rounded-md mb-6 bg-white">
            <Divider orientation="left" plain>Thuộc tính {index + 1}</Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="Tên thuộc tính"
                value={attribute.name}
                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <Select
                value={attribute.attribute_type}
                onChange={(value) => handleAttributeChange(index, 'attribute_type', value)}
                style={{ width: '100%' }}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <Select.Option value={0}>Màu Sắc</Select.Option>
                <Select.Option value={1}>Kích Thước</Select.Option>
              </Select>
              {attribute.attribute_values.map((attrValue, valueIndex) => (
                <Input
                  key={valueIndex}
                  placeholder="Giá trị thuộc tính"
                  value={attrValue.value}
                  onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              ))}
              <Button type="dashed" onClick={() => handleAddAttributeValue(index)} className="w-full mt-3 border-blue-600 text-blue-600">
                Thêm giá trị thuộc tính
              </Button>
            </Space>
          </div>
        ))}

        <Button type="dashed" onClick={handleAddAttribute} className="w-full mb-6 border-blue-600 text-blue-600">
          Thêm thuộc tính
        </Button>

        <Button type="primary" htmlType="submit" className="w-full bg-blue-700 text-white py-3">
          Thêm nhóm thuộc tính
        </Button>
      </Form>
    </div>
  );
};

export default AddAttributeGroup;

import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, Select } from 'antd';
import instance from '@/configs/axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


const UpdateAttributeGroup = () => {
  const [form] = Form.useForm();
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch attributes
  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => {
      const response = await instance.get('api/admins/attributes');
      return response?.data?.data;
    },
  });

  const { data: attributeGroup } = useQuery({
    queryKey: ['attributeGroup', id],
    queryFn: async () => {
      const response = await instance.get(`api/admins/attribute_groups/${id}`);
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
      return await instance.put(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`, updatedGroup);
    },
    onSuccess: () => {
      toast.success('Cập Nhật Nhóm Thuộc Tính Thành Công')
      form.resetFields();
      setSelectedAttributes([]);
    },
    onError: () => {
      toast.error('Cập Nhật Nhóm Thuộc Tính Thất Bại!')
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
      <div className="min-h-screen p-5">
        <div className="w-full max-w-8x">
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            {/* Tên Nhóm Biến Thể */}
            <Form.Item
              label="Tên Nhóm Biến Thể"
              name="group_name"
              className="mb-[10px]"
              rules={[
                { required: true, message: 'Vui lòng nhập tên nhóm biến thể' },
                { min: 3, message: 'Tên nhóm biến thể phải có ít nhất 3 ký tự' },
                { max: 50, message: 'Tên nhóm biến thể không được vượt quá 50 ký tự' },
                { pattern: /^[a-zA-Z0-9\s]+$/, message: 'Tên nhóm chỉ được chứa chữ cái, số và khoảng trắng' },
              ]}
            >
              <Input placeholder="Nhập tên nhóm biến thể" className="h-10" />
            </Form.Item>

            {/* Thuộc Tính */}
            <Form.Item
              label="Thuộc Tính"
              name="attributes"
              rules={[
                { required: true, message: 'Vui lòng chọn ít nhất một thuộc tính' },
              ]}
            >
              <Select
                className="h-10"
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

            {/* Nút hành động */}
            <div className="flex justify-end space-x-4">
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

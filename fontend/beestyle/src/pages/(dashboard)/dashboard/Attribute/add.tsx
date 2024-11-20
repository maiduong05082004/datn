import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, message, Card, Select } from 'antd';
import axiosInstance from '@/configs/axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddAttribute: React.FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const { mutate } = useMutation({
        mutationFn: async (newAttribute: { name: string; attribute_type: number }) => {
            return await axiosInstance.post('http://127.0.0.1:8000/api/admins/attributes', newAttribute);
        },
        onSuccess: () => {
            messageApi.success('Thêm thuộc tính thành công!');
            form.resetFields();
        },
        onError: (error: any) => {
            messageApi.error(
                `Thêm thuộc tính thất bại: ${error.response?.data?.message || error.message}`
            );
        },
    });

    const onFinish = (values: { name: string; attribute_type: number }) => {
        mutate(values);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-5">
                <div className="w-full max-w-8xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
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

export default AddAttribute;
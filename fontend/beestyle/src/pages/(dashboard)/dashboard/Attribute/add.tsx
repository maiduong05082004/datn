import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, message, Card, Select } from 'antd';
import axiosInstance from '@/configs/axios';
import React from 'react';

const { Option } = Select;

const AddAttribute: React.FC = () => {
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
            <div className="min-h-screen flex items-center justify-center p-8">
                <Card className="w-full max-w-7xl p-10 rounded-xl shadow-lg">
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
                            <Button className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6' type="primary" htmlType="submit">
                                Thêm thuộc tính
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default AddAttribute;
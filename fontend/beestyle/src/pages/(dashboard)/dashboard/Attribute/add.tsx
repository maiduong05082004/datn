import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, message, Card, Select } from 'antd';
import instance from '@/configs/axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const { Option } = Select;

const AddAttribute: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { mutate } = useMutation({
        mutationFn: async (newAttribute: { name: string; attribute_type: number }) => {
            return await instance.post('api/admins/attributes', newAttribute);
        },
        onSuccess: () => {
            toast.success('Thêm Thuộc Tính Thành Công')
            form.resetFields();
        },
        onError: () => {
            toast.error('Thêm Thuộc Tính Thất Bại!')
        },
    });

    const onFinish = (values: { name: string; attribute_type: number }) => {
        mutate(values);
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen p-5">
                <div className="w-full max-w-8xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        {/* Tên thuộc tính */}
                        <Form.Item
                            label="Tên thuộc tính"
                            name="name"
                            className="mb-[10px]"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên thuộc tính' },
                                { min: 3, message: 'Tên thuộc tính phải có ít nhất 3 ký tự' },
                                { max: 50, message: 'Tên thuộc tính không được vượt quá 50 ký tự' },
                                { pattern: /^[a-zA-Z0-9\s]+$/, message: 'Tên thuộc tính chỉ được chứa chữ cái, số và khoảng trắng' },
                            ]}
                        >
                            <Input placeholder="Nhập tên thuộc tính" className="h-10" />
                        </Form.Item>

                        {/* Phân cấp thuộc tính */}
                        <Form.Item
                            label="Phân cấp thuộc tính"
                            name="attribute_type"
                            rules={[
                                { required: true, message: 'Vui lòng chọn loại thuộc tính' },
                                {
                                    type: 'enum',
                                    enum: [0, 1],
                                    message: 'Giá trị không hợp lệ',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại thuộc tính" className="h-10">
                                <Option value={0}>Cấp bậc cha</Option>
                                <Option value={1}>Cấp bậc con</Option>
                            </Select>
                        </Form.Item>

                        {/* Nút hành động */}
                        <Form.Item>
                            <div className="flex justify-end space-x-4">
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button onClick={() => navigate('/admin/dashboard/attribute/list')}>
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
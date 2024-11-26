import React from 'react';
import axiosInstance from '@/configs/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormProps } from 'react-hook-form';

const { Title } = Typography;

type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
};

const UpdateAttributeValues: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: attributeUpdate , isLoading, isError } = useQuery({
        queryKey: ['attributeUpdate', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/attribute_values/${id}`);
            return response.data;
        },
    });

    if (isError) {
        messageApi.error('Lỗi khi tải dữ liệu thuộc tính');
        return <div>Error loading data</div>;
    }

    const { mutate } = useMutation({
        mutationFn: async (data: { attribute_id: number; values: string[] }) => {
            return await axiosInstance.put(`http://127.0.0.1:8000/api/admins/attribute_values/${id}`, data);
        },
        onSuccess: () => {
            messageApi.success('Cập nhật giá trị thuộc tính thành công');
            queryClient.invalidateQueries({ queryKey: ['attributes'] });
            form.resetFields();
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        },
    });

    const onFinish = (values: any) => {
        mutate(values)
    };
    

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-5">
                <div className="w-full max-w-8xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="space-y-6"
                        initialValues={{ ...attributeUpdate }}
                    >
                        <Form.Item
                            label={<span className="text-gray-700">Giá trị</span>}
                            name="value"
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
                        >
                            <Input
                                placeholder="Nhập giá trị"
                                size="large"
                                className="rounded-md"
                            />
                        </Form.Item>

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

export default UpdateAttributeValues;

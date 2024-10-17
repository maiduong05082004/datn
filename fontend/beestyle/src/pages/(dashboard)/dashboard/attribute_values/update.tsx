import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho Attribute
type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
    created_at: string | null;
    updated_at: string | null;
};

const UpdateAttributeValues = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [selectedAttribute, setSelectedAttribute] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Lấy danh sách thuộc tính
    const { data: attributeList, isLoading, error } = useQuery({
        queryKey: ['attributes'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');  
            return response.data.data;  
        },
    });

    // Mutation để thêm giá trị thuộc tính
    const { mutate } = useMutation({
        mutationFn: async (attributes: any) => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/admins/attribute_values', attributes, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return response.data;
            } catch (error) {
                throw new Error('Thêm giá trị thuộc tính thất bại');
            }
        },
        onSuccess: () => {
            messageApi.success('Thêm giá trị thuộc tính thành công');
            form.resetFields();
            queryClient.invalidateQueries({
                queryKey: ['attributes'],
            });
        },
        onError: (error: any) => {
            messageApi.error(`Có lỗi xảy ra: ${error.message}`);
        },
    });

    // Hàm xử lý khi submit form
    const onFinish = (values: any) => {
        console.log("Success:", values);
        // Chuẩn bị payload với selectedAttribute và các giá trị đã nhập
        const payload = {
            attribute_id: selectedAttribute,
            values: values.values.map((value: { value: string }) => ({
                value: value
            }))
        };
        mutate(payload);
    };
    

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    if (error) return <div>Có lỗi xảy ra: {(error as Error).message}</div>;

    return (
        <>
            {contextHolder}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
                <div className="w-full max-w-7xl">
                    <Card bordered={false} className="shadow-lg p-8 bg-white rounded-lg">
                        <Title level={3} className="text-center mb-8">
                            Thêm mới giá trị thuộc tính
                        </Title>

                        <Form onFinish={onFinish} layout="vertical" form={form} name="basic">
                            <Form.Item
                                label="Chọn thuộc tính"
                                name="attribute"
                                rules={[{ required: true, message: 'Vui lòng chọn thuộc tính!' }]}
                            >
                                <Select
                                    placeholder="Chọn một thuộc tính"
                                    onChange={setSelectedAttribute}
                                    value={selectedAttribute}
                                    allowClear
                                    size="large"
                                >
                                    {Array.isArray(attributeList) && attributeList.length > 0 ? (
                                        attributeList.map((attribute: Attribute) => (
                                            <Select.Option key={attribute.id} value={attribute.id}>
                                                {attribute.name}
                                            </Select.Option>
                                        ))
                                    ) : (
                                        <Select.Option disabled>Không có thuộc tính nào</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>

                            {/* Form.List để nhập các giá trị thuộc tính */}
                            <Form.List name="values">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field) => (
                                            <Row gutter={16} key={field.key}>
                                                <Col span={20}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'value']}
                                                        rules={[{ required: true, message: 'Vui lòng nhập giá trị thuộc tính!' }]}
                                                    >
                                                        <Input placeholder="Nhập giá trị thuộc tính" size="large" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <Button
                                                        type="link"
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => remove(field.name)}
                                                        danger
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                                size="large"
                                                className="bg-blue-50 hover:bg-blue-100"
                                            >
                                                Thêm giá trị
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <Form.Item>
                                <div className="flex space-x-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="mt-4 bg-black"
                                        size="large"
                                    >
                                        Thêm mới
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/admin/listAttributeValues')}
                                        className="mt-4"
                                        size="large"
                                    >
                                        Quay lại
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default UpdateAttributeValues;

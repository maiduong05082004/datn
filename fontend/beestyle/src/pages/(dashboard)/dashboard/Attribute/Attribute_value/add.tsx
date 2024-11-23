import React from 'react';
import axiosInstance from '@/configs/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
};

const AddAttributeValues: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: attributeList, isLoading, error } = useQuery({
        queryKey: ['attributes'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attributes');
            return response.data.data;
        },
    });
    

    const { mutate } = useMutation({
        mutationFn: async (data: { attribute_id: number; values: string[] }) => {
            return await axiosInstance.post('http://127.0.0.1:8000/api/admins/attribute_values', data);
        },
        onSuccess: () => {
            messageApi.success('Thêm giá trị thuộc tính thành công');
            queryClient.invalidateQueries({ queryKey: ['attributes'] });
            form.resetFields(); 
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        },
    });

    // Xử lý submit form
    const onFinish = (values: any) => {
        const payload = {
            attribute_id: values.attribute,
            values: values.values.map((item: { value: string }) => item.value.trim()),
        };
        mutate(payload);
    };

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
    if (error) return <div className="text-center text-red-500">Không thể tải dữ liệu</div>;

    return (
        <>
            {contextHolder}
            <div className="min-h-screen p-5">
                <div className="w-full max-w-8xl">
                    <div className="">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            className="space-y-6"
                        >
                            <Form.Item
                                label={<span className="text-gray-700">Chọn thuộc tính</span>}
                                name="attribute"
                                rules={[{ required: true, message: 'Vui lòng chọn thuộc tính!' }]}
                            >
                                <Select
                                    placeholder="Chọn một thuộc tính"
                                    size="large"
                                    allowClear
                                    className="rounded-md"
                                >
                                    {attributeList?.map((attribute: Attribute) => (
                                        <Select.Option key={attribute.id} value={attribute.id}>
                                            {attribute.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.List name="values">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field) => (
                                            <Row gutter={16} key={field.key} className="items-center">
                                                <Col span={20}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'value']}
                                                        rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
                                                    >
                                                        <Input
                                                            placeholder="Nhập giá trị"
                                                            size="large"
                                                            className="rounded-md"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} className="flex justify-center">
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
                                                className="border-gray-300 rounded-md"
                                            >
                                                Thêm giá trị
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <Form.Item>
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
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
            </div>
        </>
    );
};

export default AddAttributeValues;

import React from 'react';
import axiosInstance from '@/configs/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
    values: { value_id: number; value: string }[];
};

const UpdateAttributeValues: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch specific attribute values
    const { data: attributevalue, isLoading, error } = useQuery({
        queryKey: ['attributevalue', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/attribute_values/${id}`);
            console.log('Dữ liệu trả về từ API attributevalue:', response.data);
            return response?.data?.data;
        },
    });
    
    if (attributevalue) {
        console.log('Dữ liệu attributevalue:', attributevalue);
    } else {
        console.log('attributevalue không tồn tại hoặc chưa lấy được');
    }
    

    // Fetch all attributes to populate the select options
    const { data: attributeList } = useQuery({
        queryKey: ['attributes'],
        queryFn: async () => {
            const response = await axiosInstance.get('http://127.0.0.1:8000/api/admins/attribute_values');
            return response?.data?.data;
        },
    })
    console.log(attributeList);


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

    // Submit form handler
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="w-full max-w-8xl">
                    <Card bordered={false} className="shadow-lg rounded-xl p-8 bg-white">
                        <Title level={3} className="text-center mb-6 text-gray-700">
                            Thêm mới giá trị thuộc tính
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={attributevalue ? { ...attributevalue } : undefined}
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
                                    {attributeList?.map((attribute: any) => (
                                        <Select.Option key={attribute.attribute_id} value={attribute.attribute_id}>
                                            {attribute.attribute_name}
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
                                        size="large"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6"
                                    >
                                        Thêm mới
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/admin/listattribute_value')}
                                        size="large"
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-6"
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

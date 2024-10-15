import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card, Space } from 'antd';
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

// Hàm lấy danh sách thuộc tính từ API
const fetchAttributes = async (): Promise<Attribute[]> => {
    const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');
    return response.data.data;
};

// Hàm thêm giá trị thuộc tính qua API
const addAttributeValues = async (data: any): Promise<any> => {
    const response = await axios.post('http://127.0.0.1:8000/api/admins/attribute_values', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const AddAttributeValues: React.FC = () => {
    const [selectedAttribute, setSelectedAttribute] = useState<number | ''>(''); // Thuộc tính đã chọn
    const navigate = useNavigate(); // Để điều hướng sau khi thêm thành công
    const queryClient = useQueryClient(); // Để làm mới danh sách thuộc tính sau khi thêm giá trị thành công

    // Sử dụng react-query để lấy danh sách thuộc tính
    const { data: attributeList, isLoading, error } = useQuery('attributes', fetchAttributes);

    // Sử dụng react-query để thực hiện thao tác thêm giá trị thuộc tính
    const mutation = useMutation(addAttributeValues, {
        onSuccess: () => {
            alert('Giá trị thuộc tính đã được thêm thành công');
            queryClient.invalidateQueries('attributes'); // Làm mới danh sách thuộc tính
            navigate('/admin/listAttributeValues'); // Chuyển hướng sau khi thành công
        },
        onError: (error: any) => {
            console.error('Lỗi chi tiết từ API:', error.response?.data?.errors || error.response?.data || error.message);
            alert(`Có lỗi xảy ra: ${JSON.stringify(error.response?.data?.errors || error.response?.data || error.message)}`);
        },
    });

    // Gửi dữ liệu đến API khi form được submit
    const onFinish = (values: any) => {
        if (!selectedAttribute) {
            alert('Vui lòng chọn thuộc tính.');
            return;
        }

        const payload = {
            attribute_id: selectedAttribute,
            values: values.values.reduce((acc: any, curr: string, index: number) => {
                acc[`value_${index + 1}`] = curr;
                return acc;
            }, {}),
        };

        mutation.mutate(payload);
    };

    // Kiểm tra nếu có lỗi trong quá trình fetch dữ liệu
    if (error) {
        return <div>Không thể tải danh sách thuộc tính: {error instanceof Error ? error.message : 'Lỗi không xác định'}</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
            <div className="w-full max-w-7xl">
                <Card bordered={false} className="shadow-lg p-8 bg-white rounded-lg">
                    <Title level={3} className="text-center mb-8">
                        Thêm mới giá trị thuộc tính
                    </Title>

                    <Form onFinish={onFinish} layout="vertical">
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
                                loading={isLoading}
                                size="large"
                            >
                                {Array.isArray(attributeList) && attributeList.length > 0 ? (
                                    attributeList.map((attribute) => (
                                        <Select.Option key={attribute.id} value={attribute.id}>
                                            {attribute.name}
                                        </Select.Option>
                                    ))
                                ) : (
                                    <Select.Option disabled>Không có thuộc tính nào</Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.List name="values" rules={[{ required: true, message: 'Vui lòng thêm ít nhất một giá trị!' }]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Row gutter={16} key={field.key}>
                                            <Col span={20}>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name]}
                                                    fieldKey={[field.fieldKey]}
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
                            <div className="flex space-x-4"> {/* Khoảng cách giữa các button */}
                                <button
                                    type="submit"
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Thêm mới
                                </button>
                                <button
                                    onClick={() => navigate('/admin/listAttributeValues')} // Chuyển hướng về trang danh sách
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default AddAttributeValues;

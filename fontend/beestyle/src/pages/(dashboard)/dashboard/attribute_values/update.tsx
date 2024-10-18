import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
    created_at: string | null;
    updated_at: string | null;
};

const fetchAttributes = async (): Promise<Attribute[]> => {
    const response = await axios.get('http://127.0.0.1:8000/api/admins/attributes');
    return response.data.data;
};

const fetchAttributeById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/admins/attribute_groups/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Lỗi khi lấy thuộc tính:', error);
        throw error; // Để có thể xử lý lỗi ở nơi gọi
    }
};

const addAttributeValues = async (data: any): Promise<any> => {
    const response = await axios.post('http://127.0.0.1:8000/api/admins/attribute_groups/', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const UpdateAttributeValues: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedAttribute, setSelectedAttribute] = useState<number | undefined>(undefined);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = Form.useFormInstance();

    const { data: attributeList, isLoading: isLoadingAttributes, error: errorAttributes } = useQuery('attributes', fetchAttributes);
    const { data: attributeData, isLoading: isLoadingAttributeData, error: errorAttributeData } = useQuery(
        ['attribute', id],
        () => fetchAttributeById(Number(id)),
        { enabled: !!id }
    );

    const mutation = useMutation(addAttributeValues, {
        onSuccess: () => {
            alert('Giá trị thuộc tính đã được cập nhật thành công');
            queryClient.invalidateQueries('attributes');
            navigate('/admin/listAttributeValues');
        },
        onError: (error: any) => {
            console.error('Lỗi chi tiết từ API:', error.response?.data?.errors || error.response?.data || error.message);
            alert(`Có lỗi xảy ra: ${JSON.stringify(error.response?.data?.errors || error.response?.data || error.message)}`);
        },
    });

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

        console.log('Payload gửi lên:', payload); // Logging payload
        mutation.mutate(payload);
    };

    useEffect(() => {
        if (attributeData) {
            form.setFieldsValue({
                attribute: attributeData.attribute_id,
                values: Object.values(attributeData.values || {}),
            });
            setSelectedAttribute(attributeData.attribute_id);
        }
    }, [attributeData, form]);

    useEffect(() => {
        if (id) {
            queryClient.refetchQueries(['attribute', id]); // Tải lại dữ liệu khi ID thay đổi
        }
    }, [id, queryClient]);

    if (errorAttributes) {
        return <div>Không thể tải danh sách thuộc tính: {errorAttributes instanceof Error ? errorAttributes.message : 'Lỗi không xác định'}</div>;
    }

    if (errorAttributeData) {
        return <div>Không thể tải thuộc tính: {errorAttributeData instanceof Error ? errorAttributeData.message : 'Lỗi không xác định'}</div>;
    }

    if (isLoadingAttributeData || isLoadingAttributes) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
            <div className="w-full max-w-7xl">
                <Card bordered={false} className="shadow-lg p-8 bg-white rounded-lg">
                    <Title level={3} className="text-center mb-8">
                        Cập nhật giá trị thuộc tính
                    </Title>

                    <Form form={form} onFinish={onFinish} layout="vertical">
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
                                loading={isLoadingAttributes}
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
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    Cập nhật
                                </button>
                                <button
                                    onClick={() => navigate('/admin/listAttributeValues')}
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

export default UpdateAttributeValues;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Typography, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho Attribute và các giá trị
type Attribute = {
    id: number;
    name: string;
    attribute_type: number;
    created_at: string | null;
    updated_at: string | null;
};

type AttributeValue = {
    id: number;
    value: string;
};

// Hàm lấy chi tiết thuộc tính và giá trị từ API
const fetchAttributeDetails = async (id: number): Promise<{ attribute: Attribute; values: AttributeValue[] }> => {
    const response = await axios.get(`http://127.0.0.1:8000/api/admins/attributes/${id}`);
    return response.data;
};

// Hàm cập nhật giá trị thuộc tính qua API
const updateAttributeValues = async ({ id, data }: { id: number; data: any }): Promise<any> => {
    const response = await axios.put(`http://127.0.0.1:8000/api/admins/attribute_values/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const UpdateAttributeValues: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedAttribute, setSelectedAttribute] = useState<number | ''>(''); // Thuộc tính đã chọn

    // Sử dụng react-query để lấy chi tiết thuộc tính
    const { data, isLoading, error } = useQuery(['attributeDetails', id], () => fetchAttributeDetails(Number(id)), {
        enabled: !!id, // Chỉ fetch khi có ID
    });

    // Sử dụng react-query để thực hiện thao tác cập nhật giá trị thuộc tính
    const mutation = useMutation(updateAttributeValues, {
        onSuccess: () => {
            alert('Giá trị thuộc tính đã được cập nhật thành công');
            queryClient.invalidateQueries(['attributeDetails', id]); // Làm mới dữ liệu
            navigate('/admin/listAttributeValues'); // Điều hướng quay lại danh sách
        },
        onError: (error: any) => {
            console.error('Lỗi chi tiết từ API:', error.response?.data?.errors || error.response?.data || error.message);
            alert(`Có lỗi xảy ra: ${JSON.stringify(error.response?.data?.errors || error.response?.data || error.message)}`);
        },
    });

    // Đổ dữ liệu ra form khi có dữ liệu
    useEffect(() => {
        if (data && data.attribute) {
            form.setFieldsValue({
                attribute: data.attribute.name,
                values: data.values.map((value) => value.value),
            });
            setSelectedAttribute(data.attribute.id);
        }
    }, [data, form]);

    // Xử lý khi submit form
    const onFinish = (values: any) => {
        if (!selectedAttribute) {
            alert('Vui lòng chọn thuộc tính.');
            return;
        }

        // Chuyển đổi mảng các giá trị thành đối tượng với các khóa value_1, value_2,...
        const payload = {
            attribute_id: selectedAttribute,
            values: values.values.reduce((acc: any, curr: string, index: number) => {
                acc[`value_${index + 1}`] = curr; // Sử dụng các khóa value_1, value_2,...
                return acc;
            }, {}),
        };

        console.log('Payload cập nhật:', payload); // Kiểm tra payload
        mutation.mutate({ id: Number(id), data: payload });
    };

    // Kiểm tra nếu đang tải dữ liệu hoặc có lỗi
    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Không thể tải dữ liệu: {error instanceof Error ? error.message : 'Có lỗi xảy ra'}</div>;

    // Kiểm tra nếu không có thuộc tính hoặc dữ liệu thiếu
    if (!data || !data.attribute) {
        return <div>Không có dữ liệu thuộc tính để hiển thị</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-7xl">
                <Title level={2} className="text-center mb-8">
                    Cập nhật giá trị thuộc tính
                </Title>

                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Card bordered={false} className="shadow-lg">
                        <Form.Item label="Chọn thuộc tính" name="attribute" rules={[{ required: true, message: 'Vui lòng chọn thuộc tính!' }]}>
                            <Select placeholder="Chọn một thuộc tính" value={selectedAttribute} disabled>
                                {data && (
                                    <Select.Option key={data.attribute.id} value={data.attribute.id}>
                                        {data.attribute.name}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.List name="values">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Form.Item key={field.key} label={`Giá trị ${field.name + 1}`}>
                                            <Row gutter={16}>
                                                <Col span={20}>
                                                    <Form.Item {...field} name={[field.name]} fieldKey={[field.fieldKey]} noStyle>
                                                        <Input placeholder="Nhập giá trị thuộc tính" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4}>
                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm giá trị
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Card>
                </Form>
            </div>
        </div>
    );
};

export default UpdateAttributeValues;

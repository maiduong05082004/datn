import React, { useState, useEffect } from 'react';
import axiosInstance from '@/configs/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UpdateAttributeValues: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: attributeUpdate, isLoading, isError } = useQuery({
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

    useEffect(() => {
        if (attributeUpdate && attributeUpdate.image_path) {
            setFileList([
                {
                    uid: '-1',
                    name: 'image.jpg',
                    status: 'done',
                    url: attributeUpdate.image_path,
                },
            ]);
        }
    }, [attributeUpdate]);

    const { mutate } = useMutation({
        mutationFn: async (data: FormData) => {
            // Sử dụng PUT request để cập nhật
            return await axiosInstance.post(
                `http://127.0.0.1:8000/api/admins/attribute_values/${id}`,
                data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    params: { _method: 'PUT' },
                }
            );
        },
        onSuccess: () => {
            messageApi.success('Cập nhật giá trị thuộc tính thành công');
            queryClient.invalidateQueries({ queryKey: ['attributeUpdate'] });
            setFileList([]);
            setLoading(false);
        },
        onError: (error: any) => {
            messageApi.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        },
    });

    const { mutate: deleteImage } = useMutation({
        mutationFn: async () => {
            return await axiosInstance.delete(`/api/admins/attribute_values/${id}/image`);
        },
        onSuccess: () => {
            messageApi.success('Xóa ảnh thành công!');
            setFileList([]);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || `Lỗi: ${error.message}`;
            messageApi.error(errorMessage);
        },
    });

    const handleFileChange = (info: any) => {
        setFileList(info.fileList);
    };

    const onFinish = (values: any) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('value', values.value);
        if (fileList.length > 0) {
            formData.append('image_file', fileList[0].originFileObj);
        }
        mutate(formData);
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
                                className="h-10"
                            />
                        </Form.Item>

                        <Form.Item label="Ảnh thuộc tính" name="image_path">
                            <Upload
                                listType="picture"
                                onChange={handleFileChange}
                                beforeUpload={() => false}
                                fileList={fileList}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                            </Upload>
                            {fileList.length > 0 && (
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => deleteImage()}
                                    style={{ marginTop: '10px' }}
                                >
                                    Xóa ảnh
                                </Button>
                            )}
                        </Form.Item>

                        <Form.Item>
                            <div className="flex justify-end space-x-4">
                                <Button type="primary" htmlType="submit" loading={loading}>
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
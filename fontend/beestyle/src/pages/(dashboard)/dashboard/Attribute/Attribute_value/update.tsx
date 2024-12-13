import React, { useState, useEffect } from 'react';
import instance from '@/configs/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';

const UpdateAttributeValues: React.FC = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: attributeUpdate, isLoading } = useQuery({
        queryKey: ['attributeUpdate', id],
        queryFn: async () => {
            const response = await instance.get(`api/admins/attribute_values/${id}`);
            return response.data;
        },
    });
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
            return await instance.post(
                `api/admins/attribute_values/${id}`,
                data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    params: { _method: 'PUT' },
                }
            );
        },
        onSuccess: () => {
            toast.success('Cập Nhật Giá Trị Thuộc Tính Thành Công')
            queryClient.invalidateQueries({ queryKey: ['attributeUpdate'] });
            setFileList([]);
            setLoading(false);
        },
        onError: () => {
            toast.error('Cập Nhật Giá Trị Thành Công!')
        },
    });

    const { mutate: deleteImage } = useMutation({
        mutationFn: async () => {
            return await instance.delete(`/api/admins/attribute_values/${id}/image`);
        },
        onSuccess: () => {
            toast.success('Xóa Ảnh Thành Công')
            setFileList([]);
        },
        onError: () => {
            toast.error('Xóa Ảnh Thất Bại!')
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
            <ToastContainer />
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

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Modal, Button, Tag, Typography, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type AttributeValue = {
    id: number;
    value: string;
};

type AttributeDetail = {
    attribute_id: number;
    attribute_name: string;
    attribute_type: number;
    values: AttributeValue[];
};

const fetchAttributeDetail = async (id: string) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/admins/attribute_values/${id}`);
        return response.data[id]; 
    } catch (error) {
        console.error('Error fetching attribute detail:', error);
        throw error;
    }
};

const DetailAttributeValues: React.FC<{ id: string; closeModal: () => void }> = ({ id, closeModal }) => {
    const { data, isLoading, isError, error } = useQuery<AttributeDetail>(
        ['attributeDetail', id],
        () => fetchAttributeDetail(id),
        {
            retry: 2,
            refetchOnWindowFocus: false,
        }
    );

    if (isLoading) {
        return (
            <Modal visible={true} footer={null} onCancel={closeModal}>
                <Spin size="large" />
                <p>Đang tải chi tiết...</p>
            </Modal>
        );
    }

    if (isError) {
        return (
            <Modal visible={true} footer={null} onCancel={closeModal}>
                <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px' }} />
                <p>Đã xảy ra lỗi: {error instanceof Error ? error.message : 'Lỗi không xác định'}</p>
            </Modal>
        );
    }

    if (!data) {
        return (
            <Modal visible={true} footer={null} onCancel={closeModal}>
                <p>Không tìm thấy dữ liệu chi tiết cho thuộc tính này.</p>
            </Modal>
        );
    }

    return (
        <Modal
            title={`Chi Tiết Thuộc Tính: ${data.attribute_name}`}
            visible={true}
            onCancel={closeModal}
            footer={[
                <Button key="close" onClick={closeModal}>
                    Đóng
                </Button>,
            ]}
        >
            <div>
                <Title level={4}>Loại Thuộc Tính</Title>
                <Text>{data.attribute_type}</Text>
                <div style={{ marginTop: '20px' }}>
                    <Title level={5}>Danh sách Giá trị:</Title>
                    <div>
                        {data.values.map((value) => (
                            <Tag key={value.id} color="blue">
                                {value.value}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DetailAttributeValues;

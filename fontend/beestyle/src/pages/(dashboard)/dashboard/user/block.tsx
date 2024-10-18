import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Popconfirm, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type User = {
    id: number;
    name: string;
    birthDate: string;
    gender: string;
    email: string;
    address: string;
    providerName: string;
};

const BlockUser: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    const blockedUsers: User[] = [
        {
            id: 1,
            name: 'Người dùng 1',
            birthDate: '1990-01-01',
            gender: 'male',
            email: 'user1@example.com',
            address: 'Hà Nội',
            providerName: 'Google',
        },
        // Bạn có thể thêm dữ liệu người dùng tại đây nếu cần
    ];

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthDate',
            key: 'birthDate',
            width: '20%',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: '20%',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_: any, user: User) => (
                <Space size="middle">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/updateUser/${user.id}`)}
                    />
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc muốn xóa người dùng này không?"
                        onConfirm={() => console.log('Xóa người dùng', user.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                    <Button type="link" onClick={() => handleViewDetails(user)}>
                        Xem chi tiết
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="w-full mx-auto items-center justify-center px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/addUser')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Thêm người dùng
                    </Button>
                </div>
                <Table
                    dataSource={blockedUsers}
                    columns={columns}
                    rowKey={(record) => record.id}
                    bordered
                    pagination={{
                        pageSize: 7,
                        showTotal: (total) => `Tổng ${total} người dùng`,
                    }}
                    className="w-full"
                />
            </div>

            {selectedUser && (
                <Modal
                    title={`Chi tiết người dùng: ${selectedUser.name}`}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsModalOpen(false)}>
                            Đóng
                        </Button>,
                    ]}
                >
                    <p><strong>ID:</strong> {selectedUser.id}</p>
                    <p><strong>Tên:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Ngày sinh:</strong> {selectedUser.birthDate}</p>
                    <p><strong>Giới tính:</strong> {selectedUser.gender}</p>
                    <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
                    <p><strong>Nhà cung cấp:</strong> {selectedUser.providerName}</p>
                </Modal>
            )}
        </>
    );
};

export default BlockUser;

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Spin, message, Button, Popconfirm, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type User = {
    id: number;
    name: string;
    email: string;
};

const ListUsers: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    // Fetch all users
    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/admins/users/');
            return response.data;
        },
    });

    // Mutation to delete user
    const { mutate: deleteUser } = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`http://127.0.0.1:8000/api/admins/users/${id}`);
        },
        onSuccess: () => {
            messageApi.success('Đã xóa người dùng thành công');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
            messageApi.error(errorMessage);
        },
    });

    // Open modal to show user details
    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // Define table columns
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
            width: '30%',  // Dành nhiều không gian hơn cho tên người dùng
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '40%',  // Email chiếm nhiều không gian để không bị cắt chữ
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '20%',
            render: (_: any, user: User) => (
                <Space size="middle" className="flex justify-around">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/updateUser/${user.id}`)}
                    />
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc muốn xóa người dùng này không?"
                        onConfirm={() => deleteUser(user.id)}
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

    // Render loading state
    if (isLoading) {
        return <Spin tip="Đang tải người dùng..." className="flex justify-center items-center h-screen" />;
    }

    return (
        <>
            {contextHolder}
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
                    dataSource={users}
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

            {/* Modal hiển thị chi tiết */}
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
                </Modal>
            )}
        </>
    );
};

export default ListUsers;

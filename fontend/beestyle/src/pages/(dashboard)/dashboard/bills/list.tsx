import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Popconfirm, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type Bill = {
  id: number;
  code_orders: string;
  user_id: number;
  email_receiver: string;
  note: string;
  status_bill: string;
  payment_type: string;
  canceled_at: string | null;
  subtotal: number;
  total: number;
  promotion_id: number | null;
};

const ListBills: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBill, setSelectedBill] = React.useState<Bill | null>(null);

  // Dữ liệu mẫu cho UI
  const bills: Bill[] = [
    {
      id: 1,
      code_orders: 'BILL001',
      user_id: 101,
      email_receiver: 'user@example.com',
      note: 'Giao nhanh',
      status_bill: 'Đã thanh toán',
      payment_type: 'Thẻ tín dụng',
      canceled_at: null,
      subtotal: 500000,
      total: 550000,
      promotion_id: null,
    },
    // Thêm hóa đơn khác nếu cần
  ];

  // Mở modal để xem chi tiết
  const handleViewDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  // Định nghĩa cột bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Mã hóa đơn',
      dataIndex: 'code_orders',
      key: 'code_orders',
      width: '15%',
    },
    {
      title: 'Người nhận',
      dataIndex: 'email_receiver',
      key: 'email_receiver',
      width: '20%',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: '15%',
      render: (total: number) => `${total.toFixed(2)} VND`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_bill',
      key: 'status_bill',
      width: '15%',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      render: (_: any, bill: Bill) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/updateBill/${bill.id}`)}
          />
          <Popconfirm
            title="Xóa hóa đơn"
            description="Bạn có chắc muốn xóa hóa đơn này không?"
            onConfirm={() => console.log('Xóa hóa đơn', bill.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="link"
            onClick={() => navigate(`/admin/detailBill/${bill.id}`)}
          >
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
            onClick={() => navigate('/admin/addBill')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Thêm hóa đơn
          </Button>
        </div>
        <Table
          dataSource={bills}
          columns={columns}
          rowKey={(record) => record.id}
          bordered
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} hóa đơn`,
          }}
          className="w-full"
        />
      </div>
    </>
  );
};

export default ListBills;

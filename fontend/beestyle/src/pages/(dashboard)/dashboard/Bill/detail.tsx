import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Table } from 'antd';

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

const DetailBill: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Dữ liệu mẫu
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
  ];

  const bill = bills.find((b) => b.id === Number(id));

  if (!bill) {
    return <div>Hóa đơn không tồn tại.</div>;
  }

  // Dữ liệu cho bảng
  const dataSource = [
    {
      key: '1',
      id: bill.id,
      code_orders: bill.code_orders,
      user_id: bill.user_id,
      email_receiver: bill.email_receiver,
      note: bill.note || 'Không có ghi chú',
      status_bill: bill.status_bill,
      payment_type: bill.payment_type,
      canceled_at: bill.canceled_at ? bill.canceled_at : 'Chưa hủy',
      subtotal: `${bill.subtotal.toFixed(2)} VND`,
      total: `${bill.total.toFixed(2)} VND`,
      promotion_id: bill.promotion_id ? bill.promotion_id : 'Không có',
    },
  ];

  const columns = [
    {
      title: 'ID Hóa đơn',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Mã hóa đơn',
      dataIndex: 'code_orders',
      key: 'code_orders',
      width: 150,
    },
    {
      title: 'Người dùng',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
    },
    {
      title: 'Người nhận',
      dataIndex: 'email_receiver',
      key: 'email_receiver',
      width: 200,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_bill',
      key: 'status_bill',
      width: 150,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment_type',
      key: 'payment_type',
      width: 150,
    },
    {
      title: 'Ngày hủy',
      dataIndex: 'canceled_at',
      key: 'canceled_at',
      width: 150,
    },
    {
      title: 'Tổng phụ',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 150,
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      key: 'total',
      width: 150,
    },
    {
      title: 'Mã khuyến mãi',
      dataIndex: 'promotion_id',
      key: 'promotion_id',
      width: 150,
    },
  ];

  return (
    <div className="p-6">
      <Card title={`Chi tiết hóa đơn: ${bill.code_orders}`} bordered={false}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          rowKey="key"
          scroll={{ x: 1500 }}  // Tăng giá trị cuộn ngang cho phù hợp với nhiều cột
        />
      </Card>

      <Button
        type="primary"
        onClick={() => navigate('/admin/listBills')}
        className="mt-4"
      >
        Quay lại
      </Button>
    </div>
  );
};

export default DetailBill;

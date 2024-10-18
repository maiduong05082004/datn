import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Popconfirm, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type Order = {
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
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Sample data for UI demonstration
  const orders: Order[] = [
    {
      id: 1,
      code_orders: 'ORD001',
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
    // Add more orders here
  ];

  // Open modal to show order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Define table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Mã đơn hàng',
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
    // {
    //   title: 'Hành động',
    //   key: 'action',
    //   width: '20%',
    //   render: (_: any, order: Order) => (
    //     <Space size="middle" className="flex justify-around">
    //       <Button
    //         type="default"
    //         icon={<EditOutlined />}
    //         onClick={() => navigate(`/admin/updateOrder/${order.id}`)}
    //       />
    //       <Popconfirm
    //         title="Xóa đơn hàng"
    //         description="Bạn có chắc muốn xóa đơn hàng này không?"
    //         // Thêm logic xóa nếu cần
    //         okText="Có"
    //         cancelText="Không"
    //       >
    //         <Button type="primary" danger icon={<DeleteOutlined />} />
    //       </Popconfirm>
    //       <Button type="link" onClick={() => handleViewDetails(order)}>
    //         Xem chi tiết
    //       </Button>
    //     </Space>
    //   ),
    // },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      render: (_: any, order: Order) => (
          <Space size="middle">
              <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/admin/updateOrer/${order.id}`)}
              />
              <Popconfirm
                  title="Xóa đơn hàng"
                  description="Bạn có chắc muốn xóa đơn hàng này không?"
                  onConfirm={() => console.log('Xóa đơn hàng', order.id)}
                  okText="Có"
                  cancelText="Không"
              >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
              </Popconfirm>
              <Button type="link" onClick={() => handleViewDetails(order)}>
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
            onClick={() => navigate('/admin/addOrder')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Thêm đơn hàng
          </Button>
        </div>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey={(record) => record.id}
          bordered
          pagination={{
            pageSize: 7,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
          className="w-full"
        />
      </div>

      {/* Modal hiển thị chi tiết */}
      {selectedOrder && (
        <Modal
          title={`Chi tiết đơn hàng: ${selectedOrder.code_orders}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>,
          ]}
        >
          <p><strong>ID:</strong> {selectedOrder.id}</p>
          <p><strong>Mã đơn hàng:</strong> {selectedOrder.code_orders}</p>
          <p><strong>Người nhận:</strong> {selectedOrder.email_receiver}</p>
          <p><strong>Ghi chú:</strong> {selectedOrder.note}</p>
          <p><strong>Trạng thái:</strong> {selectedOrder.status_bill}</p>
          <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_type}</p>
          <p><strong>Tổng phụ:</strong> {selectedOrder.subtotal.toFixed(2)} VND</p>
          <p><strong>Tổng cộng:</strong> {selectedOrder.total.toFixed(2)} VND</p>
          <p><strong>Mã khuyến mãi:</strong> {selectedOrder.promotion_id || 'Không có'}</p>
          <p><strong>Ngày hủy:</strong> {selectedOrder.canceled_at || 'Chưa hủy'}</p>
        </Modal>
      )}
    </>
  );
};

export default ListBills;

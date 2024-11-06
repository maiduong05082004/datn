import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Table, Spin, Carousel, Card } from 'antd';

const DetailBill: React.FC = () => {
  const { id } = useParams();
  const { data: detailBill, isLoading } = useQuery({
    queryKey: ['detailbill', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  }

  const dataSource = detailBill?.bill_detail.map((item: any, index: number) => ({
    key: index,
    productName: item.name,
    price: parseFloat(item.price).toLocaleString() + ' đ',
    color: item.attribute_value_color,
    size: item.attribute_value_size,
    quantity: item.quantity,
    discount: item.discount + '%',
    totalAmount: parseFloat(item.total_amount).toLocaleString() + ' đ',
    images: item.variation_images,
  })) || [];

  const columns = [
    {
      title: 'Sản Phẩm',
      key: 'productName',
      render: (record: any) => (
        <div className="flex items-center gap-4">
          <div className="w-[200px] h-[200px]">
            <Carousel autoplay className="rounded-lg shadow-lg">
              {record.images && record.images.length > 0 ? (
                record.images.map((image: string, index: number) => (
                  <div key={index} className="flex justify-center items-center">
                    <img
                      src={image}
                      alt={`Product Variation ${index + 1}`}
                      className="w-[200px] h-[200px] object-cover rounded-md border border-gray-200"
                    />
                  </div>
                ))
              ) : (
                <img
                  src="https://via.placeholder.com/100"
                  alt="No Product Image"
                  className="w-24 h-24 object-cover rounded-md border border-gray-200"
                />
              )}
            </Carousel>

          </div>
          <div>
            <p className="font-semibold text-lg">{record.productName}</p>
            <p className="text-gray-600">Màu: {record.color} | Size: {record.size}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text: string) => <span className="text-blue-600 font-semibold">{text}</span>,
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number) => <span className="text-gray-800 font-semibold">{text}</span>,
    },
    {
      title: 'Giảm Giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (text: string) => <span className="text-green-500 font-semibold">{text}</span>,
    },
    {
      title: 'Thành Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text: string) => <span className="text-red-500 font-bold">{text}</span>,
    },
  ];

  return (
    <div className="w-[95%] mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Chi Tiết Đơn Hàng: <span className="text-blue-600">{detailBill?.code_orders}</span></h2>
      <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-lg"><strong>Người Nhận:</strong> {detailBill?.full_name}</p>
          <p className="text-lg"><strong>Địa Chỉ:</strong> {detailBill?.address_line}, {detailBill?.ward}, {detailBill?.district}, {detailBill?.city}</p>
          <p className="text-lg"><strong>Email:</strong> {detailBill?.email_receiver}</p>
          <p className="text-lg"><strong>Số Điện Thoại:</strong> {detailBill?.phone_number}</p>
          <p className="text-lg"><strong>Ghi Chú:</strong> {detailBill?.note}</p>
          <p className="text-lg"><strong>Hình Thức Thanh Toán:</strong> {detailBill?.payment_type_description}</p>
          <p className="text-lg"><strong>Trạng Thái Đơn Hàng:</strong> <span className="text-red-500">{detailBill?.status_description}</span></p>
          <p className="text-lg"><strong>Ngày Đặt Hàng:</strong> {detailBill?.order_date} {detailBill?.order_time}</p>
          <p className="text-lg"><strong>Tổng Phụ:</strong> {parseFloat(detailBill?.subtotal).toLocaleString()} đ</p>
          <p className="text-lg font-bold"><strong>Tổng Cộng:</strong> {parseFloat(detailBill?.total).toLocaleString()} đ</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">Khuyến Mãi:</p>
          <ul className="list-disc list-inside pl-4">
            {detailBill?.promotions?.map((promotion: any, index: number) => (
              <li key={index} className="text-lg">
                <strong>{promotion.code}:</strong> {promotion.description} - Giảm {promotion.discount_amount}%
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Table dataSource={dataSource} columns={columns} bordered pagination={false} className="mt-8 rounded-lg shadow-md" />
    </div>
  );
};

export default DetailBill;

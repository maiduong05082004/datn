import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios';
import { Table, Spin, Carousel } from 'antd';

const DetailBill: React.FC = () => {
  const { id } = useParams();
  const token = "4bd9602e-9ad5-11ef-8e53-0a00184fe694"
  const { data: detailBill, isLoading } = useQuery({
    queryKey: ['detailbill', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const { mutate: fetchDistrict, data: district } = useMutation({
    mutationFn: async (districtId: string) => {
      const response = await axiosInstance.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        { district_id: districtId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });

  const { mutate: fetchWard, data: ward } = useMutation({
    mutationFn: async ({ districtId, wardId }: { districtId: string; wardId: string }) => {
      const response = await axiosInstance.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
        {
          district_id: districtId,
          ward_id: wardId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });
  

  const { mutate: fetchProvince, data: province } = useMutation({
    mutationFn: async (provinceId: string) => {
      const response = await axiosInstance.post(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        { province_id: provinceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    },
  });
  console.log(province);
  

  useEffect(() => {
    if (token && detailBill?.district) {
      fetchDistrict(detailBill.district);
    }
    if (token && detailBill?.district && detailBill?.ward) {
      fetchWard({ districtId: detailBill.district, wardId: detailBill.ward });
    }
    if (token && detailBill?.city) {
      fetchProvince(detailBill.city);
    }
  }, [detailBill, fetchDistrict, fetchWard, fetchProvince, token]);

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
    <div className="px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Chi Tiết Đơn Hàng: <span className="text-blue-600">{detailBill?.code_orders}</span>
      </h2>
      <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 via-white to-gray-100 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Người Nhận:</strong> {detailBill?.full_name}</p>
          <p className="text-lg text-gray-800 font-medium">
            <strong className="text-blue-600">Địa Chỉ:</strong> {detailBill?.address_line}, {ward?.data?.ward_name}, {district?.data?.district_name}, {province?.data?.province_name}
          </p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Email:</strong> {detailBill?.email_receiver}</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Số Điện Thoại:</strong> {detailBill?.phone_number}</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Ghi Chú:</strong> {detailBill?.note}</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Hình Thức Thanh Toán:</strong> {detailBill?.payment_type_description}</p>
          <p className="text-lg text-gray-800 font-medium">
            <strong className="text-blue-600">Trạng Thái Đơn Hàng:</strong> <span className={`text-lg font-semibold ${detailBill?.status_description === 'Đã hủy đơn hàng' ? 'text-red-500' : 'text-green-500'}`}>{detailBill?.status_description}</span>
          </p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Ngày Đặt Hàng:</strong> {detailBill?.order_date} {detailBill?.order_time}</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Tổng Phụ:</strong> {parseFloat(detailBill?.subtotal).toLocaleString()} đ</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Phí Vận Chuyển:</strong> {parseFloat(detailBill?.shipping_fee).toLocaleString()} đ</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Giảm Giá Đã Áp Dụng:</strong> {parseFloat(detailBill?.discounted_amount).toLocaleString()} đ</p>
          <p className="text-lg text-gray-800 font-medium"><strong className="text-blue-600">Giảm Giá Phí Vận Chuyển:</strong> {parseFloat(detailBill?.discounted_shipping_fee).toLocaleString()} đ</p>
          <p className="text-lg font-bold text-gray-900"><strong className="text-blue-700">Tổng Cộng:</strong> {parseFloat(detailBill?.total).toLocaleString()} đ</p>
        </div>
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-inner">
          <p className="text-xl font-bold text-blue-800 mb-4">Khuyến Mãi Đã Áp Dụng:</p>
          <ul className="list-disc list-inside pl-4 text-lg text-gray-700 space-y-2">
            {detailBill?.promotions?.map((promotion: any, index: number) => (
              <li key={index}>
                <strong className="text-indigo-600">{promotion.code}:</strong> {promotion.description} - Giảm {promotion.discount_amount}%
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

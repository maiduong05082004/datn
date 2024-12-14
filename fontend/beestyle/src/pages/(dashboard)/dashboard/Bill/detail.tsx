import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Spin, Carousel } from 'antd';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import instance from '@/configs/axios';

interface TCheckout {
  full_name: string;
  address_line: string;
  city: string;
  district: string;
  ward: string;
  phone_number: string;
  paymentMethod: string;
  is_default: boolean;
}

const DetailBill: React.FC = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const { setValue, formState: { errors }, watch } = useForm<TCheckout>({
    defaultValues: {
      full_name: "",
      address_line: "",
      city: "",
      district: "",
      ward: "",
      phone_number: "",
      is_default: false,
    },
  });

  // Fetch dữ liệu chi tiết đơn hàng
  const { data: detailBill, isLoading } = useQuery({
    queryKey: ['detailbill', id],
    queryFn: async () => {
      const response = await instance.get(`api/admins/orders/show_detailorder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ['provinces '],
    queryFn: async () => {
      const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
        }
      });
      return response.data;
    },
  });

  const cityId = detailBill?.city;

  const { data: districts } = useQuery({
    queryKey: ['districts', cityId],
    queryFn: async () => {
      const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
        headers: { token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694' }
      });
      return response.data;
    },
  });

  useEffect(() => {
    setValue("district", '');
  }, [watch("city")]);
  const provinceName = provinces?.data?.find((p: any) => p.ProvinceID === parseInt(detailBill?.city))?.ProvinceName || "Không có tỉnh";
  const districtName = districts?.data?.find((d: any) => d.DistrictID === parseInt(detailBill?.district))?.DistrictName || "Không có quận";

  if (isLoading) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  }

  const dataSource = detailBill?.bill_detail?.map((item: any, index: number) => ({
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
            <p className="font-semibold text-lg text-black">{record.productName}</p>
            <p className="text-gray-600">Màu: {record.color} | Size: {record.size}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text: string) => <span className="text-black font-semibold">{text}</span>,
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number) => <span className="text-black font-semibold">{text}</span>,
    },
    {
      title: 'Giảm Giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (text: string) => <span className="text-black font-semibold">{text}</span>,
    },
    {
      title: 'Thành Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text: string) => <span className="text-red-500 font-bold">{text}</span>,
    },
  ];
  const DetailRow = ({ label, value, icon }: { label: any, icon: any, value: any }) => (
    <div className="flex items-center space-x-3">
      <span className="text-[18px]">{icon}</span>
      <div>
        <p className="text-[16px] text-gray-500">{label}</p>
        <p className={`font-medium ${value === 'Đang Xử Lý Đơn Hàng' ? 'text-green-500' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  );

  const FinancialRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value} đ</span>
    </div>
  );

  return (
    <div className=" mx-auto p-5">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4 border-l-4 border-blue-500">
        <h2 className="text-[18px] font-bold text-gray-800">
          Đơn Hàng:
          <span className="text-blue-500 ml-2">{detailBill?.code_orders}</span>
        </h2>
        <p className="text-gray-500 text-[16px]">Chi tiết đơn hàng của bạn</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Thông Tin Khách Hàng</h3>
          <div className="space-y-3">
            <DetailRow
              label="Người Nhận"
              value={detailBill?.full_name}
              icon="👤"
            />
            <DetailRow
              label="Địa Chỉ"
              value={`${detailBill?.address_line}, ${districtName}, ${provinceName}`}
              icon="🏠"
            />
            <DetailRow
              label="Email"
              value={detailBill?.email_receiver}
              icon="✉️"
            />
            <DetailRow
              label="Số Điện Thoại"
              value={detailBill?.phone_number}
              icon="📱"
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Chi Tiết Đơn Hàng</h3>
          <div className="space-y-3">
            <DetailRow
              label="Hình Thức Thanh Toán"
              value={detailBill?.payment_type_description}
              icon="💳"
            />
            <DetailRow
              label="Trạng Thái"
              value={detailBill?.status_bill === 'pending' ? 'Đang Xử Lý Đơn Hàng' : detailBill?.status_bill}
              icon="🚚"
            />
            <DetailRow
              label="Ngày Đặt Hàng"
              value={`${detailBill?.order_date} ${detailBill?.order_time}`}
              icon="📅"
            />
            <DetailRow
              label="Ghi Chú"
              value={detailBill?.note || 'Không có ghi chú'}
              icon="📝"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
          className="w-full"
        />
      </div>

      {detailBill?.promotions?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border">
          <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Khuyến Mãi Đã Áp Dụng</h3>
          <ul className="space-y-2">
            {detailBill.promotions.map((promotion: any, index: number) => (
              <li key={index} className="flex items-center space-x-3 text-gray-700">
                <span className="text-green-500">🎁</span>
                <span className='text-[16px]'>
                  <strong>{promotion.code}:</strong> {promotion.description} - Giảm {promotion.discount_amount}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 border">
        <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Chi Tiết Thanh Toán</h3>
        <div className="grid md:grid-cols-2 gap-4 text-[16px]">
          <FinancialRow
            label="Tổng Phụ"
            value={parseFloat(detailBill?.subtotal).toLocaleString()}
          />
          <FinancialRow
            label="Phí Vận Chuyển"
            value={parseFloat(detailBill?.shipping_fee).toLocaleString()}
          />
          <FinancialRow
            label="Giảm Giá"
            value={parseFloat(detailBill?.discounted_amount).toLocaleString()}
          />
          <div className="md:col-span-2 mt-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-[18px] font-bold text-gray-800">Tổng Cộng</span>
              <span className="text-2xl font-bold text-red-500">
                {parseFloat(detailBill?.total).toLocaleString()} đ
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DetailBill;

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Spin, Carousel } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

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


const Detailship: React.FC = () => {
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
      const response = await axios.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`, {
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

  //   const columns = [
  //     {
  //       title: 'Sản Phẩm',
  //       key: 'productName',
  //       render: (record: any) => (
  //         <div className="flex items-center gap-4">
  //           <div className="w-[200px] h-[200px]">
  //             <Carousel autoplay className="rounded-lg shadow-lg">
  //               {record.images && record.images.length > 0 ? (
  //                 record.images.map((image: string, index: number) => (
  //                   <div key={index} className="flex justify-center items-center">
  //                     <img
  //                       src={image}
  //                       alt={`Product Variation ${index + 1}`}
  //                       className="w-[200px] h-[200px] object-cover rounded-md border border-gray-200"
  //                     />
  //                   </div>
  //                 ))
  //               ) : (
  //                 <img
  //                   src="https://via.placeholder.com/100"
  //                   alt="No Product Image"
  //                   className="w-24 h-24 object-cover rounded-md border border-gray-200"
  //                 />
  //               )}
  //             </Carousel>
  //           </div>
  //           <div>
  //             <p className="font-semibold text-lg">{record.productName}</p>
  //             <p className="text-gray-600">Màu: {record.color} | Size: {record.size}</p>
  //           </div>
  //         </div>
  //       ),
  //     },
  //     {
  //       title: 'Giá',
  //       dataIndex: 'price',
  //       key: 'price',
  //       render: (text: string) => <span className="text-blue-600 font-semibold">{text}</span>,
  //     },
  //     {
  //       title: 'Số Lượng',
  //       dataIndex: 'quantity',
  //       key: 'quantity',
  //       render: (text: number) => <span className="text-gray-800 font-semibold">{text}</span>,
  //     },
  //     {
  //       title: 'Giảm Giá',
  //       dataIndex: 'discount',
  //       key: 'discount',
  //       render: (text: string) => <span className="text-green-500 font-semibold">{text}</span>,
  //     },
  //     {
  //       title: 'Thành Tiền',
  //       dataIndex: 'totalAmount',
  //       key: 'totalAmount',
  //       render: (text: string) => <span className="text-red-500 font-bold">{text}</span>,
  //     },
  //   ];

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-100">
  <h2 className="text-3xl font-bold text-blue-600 mb-6">
    Đơn Hàng: <span className="text-blue-600">{detailBill?.code_orders}</span>
  </h2>

  {/* Phần thông tin đơn hàng */}
  <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Người Nhận:</strong> {detailBill?.full_name}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Địa Chỉ:</strong> {`${detailBill?.address_line}, ${districtName}, ${provinceName}`}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Email:</strong> {detailBill?.email_receiver}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Số Điện Thoại:</strong> {detailBill?.phone_number}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Ghi Chú:</strong> {detailBill?.note}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Hình Thức Thanh Toán:</strong> {detailBill?.payment_type_description}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Trạng Thái Đơn Hàng:</strong>
            <span className={`ml-2 text-lg font-semibold ${detailBill?.status_description === 'Đã hủy đơn hàng' ? 'text-red-500' : 'text-green-500'}`}>
              {detailBill?.status_description}
            </span>
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Ngày Đặt Hàng:</strong> {detailBill?.order_date} {detailBill?.order_time}
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Tổng Phụ:</strong> {parseFloat(detailBill?.subtotal).toLocaleString()} đ
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Phí Vận Chuyển:</strong> {parseFloat(detailBill?.shipping_fee).toLocaleString()} đ
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Giảm Giá Đã Áp Dụng:</strong> {parseFloat(detailBill?.discounted_amount).toLocaleString()} đ
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <strong className="text-gray-800">Giảm Giá Phí Vận Chuyển:</strong> {parseFloat(detailBill?.discounted_shipping_fee).toLocaleString()} đ
          </p>
          <p className="text-lg font-bold text-gray-800">
            <strong className="text-gray-800">Tổng Cộng:</strong>
            <span className="text-red-500 ml-2">{parseFloat(detailBill?.total).toLocaleString()} đ</span>
          </p>
        </div>
      </div>

  {/* Phần khuyến mãi */}
  <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <p className="text-xl font-bold text-gray-800 mb-4">Khuyến Mãi Đã Áp Dụng:</p>
        <ul className="list-disc list-inside pl-4 text-lg text-gray-700 space-y-2">
          {detailBill?.promotions?.map((promotion: any, index: number) => (
            <li key={index}>
              <strong className="text-gray-800">{promotion.code}:</strong> {promotion.description} - Giảm {promotion.discount_amount}%
            </li>
          ))}
        </ul>
      </div>
</div>


  );
};

export default Detailship;

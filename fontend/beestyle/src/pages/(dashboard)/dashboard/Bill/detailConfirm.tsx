import instance from '@/configs/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Carousel, message, Modal, Spin, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
// import ChatRealTime from '../ChatRealTime/chatrealtime';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import UpdateAddress from './updateAddress';



const DetailConfirm = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setVisible(true); // Mở Modal
  };

  const closeModal = () => {
    setVisible(false); // Đóng Modal
  };

  const { id } = useParams();

  const { data: detailConfirm, isLoading } = useQuery({
    queryKey: ['detailbill', id],
    queryFn: async () => {
      return instance.get(`/api/admins/orders/show_detailorder/${id}`);
    },
  });

  const DetailRow = ({ label, value, icon }: { label: any, icon: any, value: any }) => (
    <div className="flex items-center space-x-3">
      <span className="text-[18px]">{icon}</span>
      <div>
        <p className="text-[16px] text-gray-500">{label}</p>
        <p className={`font-medium ${value === 'Chờ Lấy Hàng' ? 'text-yellow-500' : 'text-gray-800'}`}>{value}</p>
      </div>
    </div>
  );

  const FinancialRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value} đ</span>
    </div>
  );

  const dataSource = detailConfirm?.data.bill_detail.map((item: any, index: number) => ({
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

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return await instance.post(`/api/admins/orders/update_order/${id}`, { status });
    },
    onSuccess: () => {
      toast.success('Trạng thái đơn hàng đã được cập nhật thành công.');
      navigate('/admin/dashboard/bill/list')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.');
    },
  });

  const handleAssignShipping = () => {
    if (id) {
      updateStatusMutation.mutate('shipped');
    }
  };


  const { setValue, watch } = useForm<any>({});

  useEffect(() => {
    if (detailConfirm) {
      setValue("district", detailConfirm?.data.district);
    }
  }, [detailConfirm, setValue]);

  const { data: province } = useQuery({
    queryKey: ['province'],
    queryFn: async () => {
      return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694', // replace with your API key
        }
      });
    },
  });

  const { data: district } = useQuery({
    queryKey: ['district'],
    queryFn: async () => {
      return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
        }
      });
    },
  });

  const districtId: any = watch('district');
  const district_id = parseInt(districtId)
  const { data: ward } = useQuery({
    queryKey: ['ward', districtId],
    queryFn: async () => {
      return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
        params: { district_id },
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
        }
      });
    },
    enabled: !!districtId,
  });

  const LocationDisplay = ({ wardId, districtId, provinceId }: any) => {
    const wardName = ward?.data.data.find((item: any) => item.WardCode === wardId);
    const districtName = district?.data.data.find((item: any) => item.DistrictID === parseInt(districtId));
    const provinceName = province?.data.data.find((item: any) => item.ProvinceID === parseInt(provinceId));
    return (
      <>
        {wardName?.WardName},&nbsp;
        {districtName?.DistrictName},&nbsp;
        {provinceName?.ProvinceName}
      </>
    );
  };

  if (isLoading)
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <div className="flex min-h-screen pb-20 p-5">
        <div className={`${visible ? 'w-[100%]' : 'w-full'} transition-all duration-300`}>
          <div className="bg-white shadow-md rounded-lg p-6 mb-4 border-l-4 border-blue-500">
            <h2 className="text-[18px] font-bold text-gray-800">
              Thông Tin Đơn Hàng
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <div className='flex justify-between border-b pb-2 mb-4'>
                <div>
                  <h3 className="text-[18px] font-semibold text-gray-700 ">Thông Tin Khách Hàng</h3>
                </div>
                <div>
                  <Button onClick={openModal}>Cập Nhật Địa Chỉ</Button>
                </div>
              </div>
              <div className="space-y-3">
                <DetailRow
                  label="Người Nhận"
                  value={detailConfirm?.data.full_name}
                  icon="👤"
                />
                <DetailRow
                  label="Địa Chỉ"
                  value={
                    <>
                      {detailConfirm?.data.address_line},{' '}
                      <LocationDisplay
                        wardId={detailConfirm?.data.ward}
                        districtId={detailConfirm?.data.district}
                        provinceId={detailConfirm?.data.city}
                      />
                    </>
                  }
                  icon="🏠"
                />
                <DetailRow
                  label="Email"
                  value={detailConfirm?.data.email_receiver}
                  icon="✉️"
                />
                <DetailRow
                  label="Số Điện Thoại"
                  value={detailConfirm?.data.phone_number}
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
                  value={detailConfirm?.data.payment_type_description}
                  icon="💳"
                />
                <DetailRow
                  label="Trạng Thái"
                  value={detailConfirm?.data.status_bill === 'processed' ? 'Chờ Lấy Hàng' : detailConfirm?.data.status_bill}
                  icon="🚚"
                />


                <DetailRow
                  label="Ngày Đặt Hàng"
                  value={`${detailConfirm?.data.order_date} ${detailConfirm?.data.order_time}`}
                  icon="📅"
                />
                <DetailRow
                  label="Ghi Chú"
                  value={detailConfirm?.data.note || 'Không có ghi chú'}
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
          {detailConfirm?.data.promotions?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 border">
              <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Khuyến Mãi Đã Áp Dụng</h3>
              <ul className="space-y-2">
                {detailConfirm?.data.promotions.map((promotion: any, index: number) => (
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
          <div className="bg-white rounded-lg shadow-md p-6 border ">
            <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Chi Tiết Thanh Toán</h3>
            <div className="grid md:grid-cols-2 gap-4 text-[16px]">
              <FinancialRow
                label="Tổng Phụ"
                value={parseFloat(detailConfirm?.data.subtotal).toLocaleString()}
              />
              <FinancialRow
                label="Phí Vận Chuyển"
                value={parseFloat(detailConfirm?.data.shipping_fee).toLocaleString()}
              />
              <FinancialRow
                label="Giảm Giá"
                value={parseFloat(detailConfirm?.data.discounted_amount).toLocaleString()}
              />
              <div className="md:col-span-2 mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[18px] font-bold text-gray-800">Tổng Cộng</span>
                  <span className="text-2xl font-bold text-red-500">
                    {parseFloat(detailConfirm?.data.total).toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <UpdateAddress closeModal={closeModal} visible={visible} />
      </div >

      <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 py-4 flex items-center justify-around shadow-lg">
        <div>
          <p className="text-sm font-medium text-gray-700">Cần thanh toán:</p>
          <span className="text-lg font-bold text-black">
            {parseFloat(detailConfirm?.data.total || 0).toLocaleString()} đ
          </span>
        </div>

        <div className="flex space-x-3">
          <div className="flex space-x-3">
            <Button
              type="primary"
              className="rounded-md px-4 w-[150px] transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleAssignShipping}
            >
              Vận Chuyển
            </Button>
            <Button
              type="default"
              className="rounded-md px-4 w-[150px] transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => navigate('/admin/dashboard/bill/list')}
            >
              Quay Lại
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default DetailConfirm;

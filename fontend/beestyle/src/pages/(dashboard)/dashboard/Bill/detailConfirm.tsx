import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Spin, Select } from 'antd';
import { useForm } from 'react-hook-form';
import { BoxPlotFilled, CloseOutlined, DropboxOutlined, EnvironmentOutlined, HomeOutlined, InboxOutlined, MenuOutlined, MessageOutlined } from '@ant-design/icons';

const { Option } = Select;

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

const DetailConfirm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const navigate = useNavigate();

  const openChatDrawer = () => {
    setVisible(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setNewMessage('');
  };

  const { id } = useParams();
  const token = localStorage.getItem('token');
  const { setValue, watch } = useForm<TCheckout>({
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

  const { data: detailConfirm, isLoading } = useQuery({
    queryKey: ['detailbill', id],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const cityId = detailConfirm?.city;

  const { data: districts } = useQuery({
    queryKey: ['districts', cityId],
    queryFn: async () => {
      const response = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
        headers: { token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694' }
      });
      return response.data;
    },
  });

  const { data: ward } = useQuery({
    queryKey: ['ward'],
    queryFn: async () => {
      return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
        }
      });
    },
  });


  useEffect(() => {
    setValue("district", '');
  }, [watch("city")]);
  const provinceName = provinces?.data?.find((p: any) => p.ProvinceID === parseInt(detailConfirm?.city))?.ProvinceName || "Không có tỉnh";
  const districtName = districts?.data?.find((d: any) => d.DistrictID === parseInt(detailConfirm?.district))?.DistrictName || "Không có quận";

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <div className="flex min-h-screen pb-20 px-5">
        <div className={`${visible ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <div className="bg-white shadow-md flex items-center justify-between px- py-2">
            <div className="flex items-center px-5">
              <MenuOutlined className="text-xl mr-4 cursor-pointer" />
              <h2 className="text-xl font-bold text-gray-800">Đơn Hàng</h2>
            </div>

            <div className="flex-grow px-4">
              <Input
                placeholder="Mã đơn / Mã vận chuyển / Tên / Địa chỉ / Số điện thoại / Ghi chú"
                className="w-full rounded-full border-gray-300 shadow-sm px-4 py-2 text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center space-x-4">
              <HomeOutlined className="text-2xl cursor-pointer" onClick={() => navigate('/home')} />
              <div className="p-2 rounded-full cursor-pointer hover:bg-gray-200">
                <MessageOutlined className="text-2xl text-gray-800" onClick={openChatDrawer} />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg mb-4">
            <div className="flex items-center justify-between mb-4 p-4 border-b bg-slate-100">
              <div className="flex items-center gap-2">
                <InboxOutlined style={{ fontSize: '1.5rem', color: '#333' }} />
                <h3 className="text-lg font-bold">Thông Tin</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white">
              <p className="text-base text-black">
                <strong className="text-black">Người Nhận:</strong> {detailConfirm?.name || 'Không có thông tin'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Địa Chỉ:</strong> {detailConfirm?.address_line || 'Không có thông tin'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Email người nhận:</strong> {detailConfirm?.email_receiver || 'Không có thông tin'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Số Điện Thoại:</strong> {detailConfirm?.phone_number || 'Không có thông tin'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Ghi Chú:</strong> {detailConfirm?.note || 'Không có ghi chú'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Hình Thức Thanh Toán:</strong> {detailConfirm?.payment_type_description || 'Không có thông tin'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Ngày Đặt Hàng:</strong> {detailConfirm?.order_date && detailConfirm?.order_time ? `${detailConfirm.order_date} ${detailConfirm.order_time}` : 'Không có thông tin'}
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Tổng Phụ:</strong> {parseFloat(detailConfirm?.subtotal || 0).toLocaleString()} đ
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Phí Vận Chuyển:</strong> {parseFloat(detailConfirm?.shipping_fee || 0).toLocaleString()} đ
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Giảm Giá Đã Áp Dụng:</strong> {parseFloat(detailConfirm?.discounted_amount || 0).toLocaleString()} đ
              </p>
              <p className="text-base text-black">
                <strong className="text-black">Giảm Giá Phí Vận Chuyển:</strong> {parseFloat(detailConfirm?.discounted_shipping_fee || 0).toLocaleString()} đ
              </p>
              <p className="text-lg font-bold text-black md:col-span-2">
                <strong className="text-black">Tổng Cộng:</strong> <span className="text-red-500">{parseFloat(detailConfirm?.total || 0).toLocaleString()} đ</span>
              </p>
            </div>

            <div className="mt-4 p-4 bg-slate-100 shadow-sm">
              <p className="text-lg font-bold text-black mb-3">Khuyến Mãi Đã Áp Dụng:</p>
              <ul className="list-disc list-inside pl-3 text-base text-black space-y-1">
                {detailConfirm?.promotions?.length > 0 ? (
                  detailConfirm?.promotions?.map((promotion: any, index: number) => (
                    <li key={index}>
                      <strong className="text-black">{promotion.code}:</strong> {promotion.description} - Giảm {promotion.discount_amount}%
                    </li>
                  ))
                ) : (
                  <li>Không có khuyến mãi áp dụng</li>
                )}
              </ul>
            </div>
          </div>
          <div className="bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4 p-4 border-b bg-slate-100">
              <div className="flex items-center gap-2">
                <EnvironmentOutlined style={{ fontSize: '1.5rem', color: '#333' }} />
                <h3 className="text-lg font-bold">Nhận hàng</h3>
              </div>
              <Select
                className='h-[38px]'
                placeholder="Chọn địa chỉ"
                style={{ width: 150 }}
                defaultValue={detailConfirm?.address || 'Chọn địa chỉ'}
              >
                <Option value="address1">Địa chỉ 1</Option>
                <Option value="address2">Địa chỉ 2</Option>
              </Select>
            </div>
            <div className="flex items-center justify-between mb-4 p-4 border-b">
              <label className="font-medium text-gray-700">Dự kiến nhận hàng</label>
              <Input
                className='h-[38px]'
                type="date"
                placeholder="Chọn ngày"
                style={{ width: 150 }}
              />
            </div>
            <div className='p-5'>
              <div className='flex justify-center gap-5 pb-5'>
                <div className='w-[50%]'>
                  <Input className='h-[38px]' value={detailConfirm?.full_name} placeholder='Người Nhận' />
                </div>
                <div className='w-[50%]'>
                  <Input className='h-[38px]' value={detailConfirm?.phone_number} placeholder='Số Điện Thoại' />
                </div>
              </div>
              <div className='pb-5'>
                <Input className='h-[38px]' value={detailConfirm?.address_line} placeholder='Địa Chỉ' />
              </div>
              <div className='flex justify-center w-[100%] gap-2'>
                <div className='w-full'>
                  <Select className='w-full h-[38px]' defaultValue={detailConfirm?.city || 'Chọn tỉnh'}>
                    <Option value="city">{detailConfirm?.city || 'Không có tỉnh'}</Option>
                  </Select>
                </div>
                <div className='w-full '>
                  <Select className='w-full h-[38px]' defaultValue={detailConfirm?.district || 'Chọn quận'}>
                    <Option value="district">{detailConfirm?.district || 'Không có quận'}</Option>
                  </Select>
                </div>
                <div className='w-full '>
                  <Select className='w-full h-[38px]' defaultValue={detailConfirm?.ward || 'Chọn quận'}>
                    <Option value="ward">{detailConfirm?.ward || 'Không có quận'}</Option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Phần Vận chuyển */}
            <div className="flex items-center justify-between mb-4 p-4 border-b bg-slate-100 mt-5">
              <div className="flex items-center gap-2">
                <DropboxOutlined style={{ fontSize: '1.5rem', color: '#333' }} />
                <h3 className="text-lg font-bold">Vận chuyển</h3>
              </div>
              <Select
                className='h-[38px]'
                placeholder="Đơn vị Vận Chuyển"
                style={{ width: 150 }}
                defaultValue="Đơn vị VC"
              >
                {/* Các tùy chọn đơn vị vận chuyển */}
                <Option value="vc1">Đơn vị VC 1</Option>
                <Option value="vc2">Đơn vị VC 2</Option>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
              <div>
                <label>Mã vận đơn</label>
                <Input className='h-[38px]' value={detailConfirm?.tracking_code || 'Chưa có mã vận đơn'} disabled />
              </div>
              <div>
                <label>Phí vận chuyển</label>
                <Input className='h-[38px]' value={`${parseFloat(detailConfirm?.shipping_fee || '0').toLocaleString()} đ`} disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Phần chat realtime, chiếm 1/3 nếu chat mở */}
        {visible && (
          <div className="w-1/3 p-6 border-l border-gray-200 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Chat Realtime</h3>
              <CloseOutlined
                className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => setVisible(false)}
              />
            </div>
            <div className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded-lg mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-2`}>
                  <p
                    className={`${index % 2 === 0 ? 'bg-blue-200 text-left' : 'bg-green-200 text-right'} p-2 rounded-lg max-w-xs`}
                  >
                    {message}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-grow rounded-lg mr-2"
              />
              <Button
                type="primary"
                onClick={handleSendMessage}
                className="rounded-lg"
              >
                Gửi
              </Button>
            </div>
          </div>
        )}

      </div >
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 p-4 flex items-center justify-around shadow-lg z-50">
        {/* Thông tin cần thanh toán */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-700">Cần thanh toán:</p>
          <span className="text-lg font-bold text-black">{parseFloat(detailConfirm?.total || 0).toLocaleString()} đ</span>
        </div>

        {/* Thông tin COD */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-red-500">COD:</p>
          <span className="text-lg font-bold text-red-500">{parseFloat(detailConfirm?.cod || 0).toLocaleString()} đ</span>
        </div>

        <div className="flex space-x-3">
          <Button type="primary" className="rounded-md px-4">Bàn Giao Đơn Vị Vận Chuyển</Button>
        </div>
      </div>

    </>
  );
}

export default DetailConfirm;

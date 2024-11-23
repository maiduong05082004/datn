import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Spin, Select } from 'antd';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import {
  CloseOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  MenuOutlined,
  MessageOutlined,
} from '@ant-design/icons';

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
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<TCheckout>({
    defaultValues: {
      full_name: '',
      address_line: '',
      city: '',
      district: '',
      ward: '',
      phone_number: '',
      is_default: false,
    },
  });

  const { data: detailConfirm, isLoading } = useQuery({
    queryKey: ['detailbill', id],
    queryFn: async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/admins/orders/show_detailorder/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
  });

  const assignShippingMutation = useMutation({
    mutationFn: async (billId: string) => {
      const addressData = getValues();
      await axiosInstance.post(
        `http://127.0.0.1:8000/api/admins/orders/ghn-create/${billId}`,
        addressData
      );
    },
    onSuccess: () => {
      toast.success('Đã bàn giao đơn hàng cho đơn vị vận chuyển thành công.');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Không thể bàn giao đơn hàng cho đơn vị vận chuyển.';
      toast.error(errorMessage);
    },
  });

  const handleAssignShipping = () => {
    if (id) {
      assignShippingMutation.mutate(id);
    }
  };

  const { data: province, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ['province'],
    queryFn: async () => {
      return await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: {
            token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
          },
        }
      );
    },
  });

  const cityId: any = watch('city');
  const { data: district } = useQuery({
    queryKey: ['district', cityId],
    queryFn: async () => {
      return await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          params: { province_id: parseInt(cityId) },
          headers: {
            token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
          },
        }
      );
    },
    enabled: !!cityId,
  });

  const districtId: any = watch('district');
  const { data: ward } = useQuery({
    queryKey: ['ward', districtId],
    queryFn: async () => {
      return await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        {
          params: { district_id: parseInt(districtId) },
          headers: {
            token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
          },
        }
      );
    },
    enabled: !!districtId,
  });

  useEffect(() => {
    setValue('district', '');
  }, [cityId, setValue]);

  useEffect(() => {
    setValue('ward', '');
  }, [districtId, setValue]);

  if (isLoading)
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <ToastContainer />
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
              <MessageOutlined className="text-2xl cursor-pointer" onClick={openChatDrawer} />
            </div>
          </div>

          <div className="bg-white shadow-lg mb-4">
            <div className="w-full p-5">
              <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-4">Thông Tin Sản Phẩm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {detailConfirm?.bill_detail?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
                  >
                    <div className="w-full md:w-2/3 md:ml-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.name}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                        <p><strong>Giá:</strong> {parseFloat(item.price).toLocaleString()} đ</p>
                        <p><strong>Màu sắc:</strong> {item.attribute_value_color}</p>
                        <p><strong>Kích cỡ:</strong> {item.attribute_value_size}</p>
                        <p><strong>Số lượng:</strong> {item.quantity}</p>
                        <p className="col-span-2 mt-3"><strong>Tổng tiền:</strong> <span className="text-lg font-bold text-red-500">{parseFloat(item.total_amount).toLocaleString()} đ</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="mb-4">
                <label>Tỉnh / Thành</label>
                {isLoadingProvinces ? (
                  <p>Đang tải tỉnh/thành...</p>
                ) : (
                  <select {...register('city')} className="w-full border rounded p-2">
                    <option value="" disabled>-- Chọn Tỉnh / Thành --</option>
                    {province?.data?.data.map((item: any) => (
                      <option key={item.ProvinceID} value={item.ProvinceID}>
                        {item.ProvinceName}
                      </option>
                    ))}
                  </select>
                )}
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
              </div>

              <div className="mb-4">
                <label>Quận / Huyện</label>
                {district?.data && (
                  <select {...register('district')} className="w-full border rounded p-2">
                    <option value="" disabled>-- Chọn Quận / Huyện --</option>
                    {district.data.data.map((item: any) => (
                      <option key={item.DistrictID} value={item.DistrictID}>
                        {item.DistrictName}
                      </option>
                    ))}
                  </select>
                )}
                {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
              </div>

              <div className="mb-4">
                <label>Phường / Xã</label>
                {ward?.data && (
                  <select {...register('ward')} className="w-full border rounded p-2">
                    <option value="" disabled>-- Chọn Phường / Xã --</option>
                    {ward.data.data.map((item: any) => (
                      <option key={item.WardCode} value={item.WardCode}>
                        {item.WardName}
                      </option>
                    ))}
                  </select>
                )}
                {errors.ward && <p className="text-red-500 text-sm">{errors.ward.message}</p>}
              </div>
            </div>
          </div>
        </div>

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
                    className={`${index % 2 === 0 ? 'bg-blue-200 text-left' : 'bg-green-200 text-right'
                      } p-2 rounded-lg max-w-xs`}
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
              <Button type="primary" onClick={handleSendMessage} className="rounded-lg">
                Gửi
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 py-4 flex items-center justify-around shadow-lg">
        <div>
          <p className="text-sm font-medium text-gray-700">Cần thanh toán:</p>
          <span className="text-lg font-bold text-black">
            {parseFloat(detailConfirm?.total || 0).toLocaleString()} đ
          </span>
        </div>

        <div className="flex space-x-3">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md px-4 w-[200px] transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAssignShipping}
          >
            Bàn Giao Đơn Vị Vận Chuyển
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailConfirm;

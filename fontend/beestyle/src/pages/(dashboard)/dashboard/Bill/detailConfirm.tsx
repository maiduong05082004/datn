import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Spin, Select, message, Table, Carousel, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import {
  EnvironmentOutlined,
  MenuOutlined,
  MessageOutlined,
} from '@ant-design/icons';
// import ChatRealTime from '../ChatRealTime/chatrealtime';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const { Option } = Select;
type Props = {
  isCheckAddresses: boolean
  idAddresses: any
  setCheckAddresses: Dispatch<SetStateAction<boolean>>
  setUpdateAddresses: Dispatch<SetStateAction<boolean>>
  isUpdateAddresses: boolean
}
interface TCheckout {
  full_name: string;
  address_line: string;
  city: string;
  district: string;
  ward: string;
  phone_number: string;
  is_default: boolean;
}

const checkoutSchema = Joi.object({
  full_name: Joi.string().required().min(5).max(30).messages({
    'any.required': 'Tên người nhận là bắt buộc',
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên người nhận phải có ít nhất 5 ký tự',
    'string.max': 'Tên người nhận không được quá 50 ký tự',
  }),
  phone_number: Joi.string()
    .required()
    .min(10)
    .max(15)
    .pattern(/^[0-9]+$/)
    .messages({
      'any.required': 'Số điện thoại là bắt buộc',
      'string.empty': 'Số điện thoại không được để trống',
      'string.min': 'Số điện thoại phải có ít nhất 10 số',
      'string.max': 'Số điện thoại phải có tối đa 15 số',
      'string.pattern.base': 'Số điện thoại chỉ được chứa các ký tự số',
    }),
  address_line: Joi.string().required().messages({
    'string.empty': 'Địa chỉ không được để trống',
    'any.required': 'Địa chỉ là bắt buộc',
  }),
  city: Joi.string().required().messages({
    'string.empty': 'Tỉnh/thành không được để trống',
    'any.required': 'Tỉnh/thành là bắt buộc',
  }),
  district: Joi.string().required().messages({
    'string.empty': 'Quận/huyện không được để trống',
    'any.required': 'Quận/huyện là bắt buộc',
  }),
  ward: Joi.string().required().messages({
    'string.empty': 'Phường/xã không được để trống',
    'any.required': 'Phường/xã là bắt buộc',
  }),
  is_default: Joi.boolean(),
});


const DetailConfirm = ({ isCheckAddresses, idAddresses, isUpdateAddresses, setCheckAddresses, setUpdateAddresses }: Props) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const openModal = () => {
    setVisible(true); // Mở Modal
  };

  const closeModal = () => {
    setVisible(false); // Đóng Modal
  };


  const { id } = useParams();
  const token = localStorage.getItem('token');
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TCheckout>({
    resolver: joiResolver(checkoutSchema)
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

  const dataSource = detailConfirm?.bill_detail.map((item: any, index: number) => ({
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

  // update địa chỉ
  const renderAddressForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className='w-[100%]'>
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
      <div>
        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>TỈNH / THÀNH</label>
        <select
          {...register('city')}
          onChange={() => setValue("district", '')}
          className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]'
        >
          <option value="" disabled>-- Chọn Tỉnh / Thành --</option>
          {province?.data?.data.map((item: any) => (
            <option key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</option>
          ))}
        </select>
        {errors.city && (
          <span className='italic text-red-500 text-[12px]'>{errors.city.message}</span>
        )}
      </div>
      {/* Quận / Huyện */}
      <div>
        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>QUẬN / HUYỆN</label>
        <select
          {...register('district')}
          onChange={() => setValue("ward", '')}
          className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]'
        >
          <option value="" disabled>-- Chọn Quận / Huyện --</option>
          {district?.data?.data.map((item: any) => (
            <option key={item.DistrictID} value={item.DistrictID}>{item.DistrictName}</option>
          ))}
        </select>
        {errors.district && (
          <span className='italic text-red-500 text-[12px]'>{errors.district.message}</span>
        )}
      </div>
      {/* Phường / Xã */}
      <div>
        <label htmlFor="" className='text-[#868D95] font-[600] text-[13px]'>PHƯỜNG / XÃ</label>
        <select
          {...register('ward')}
          className='border-[#868D95] border-[1px] rounded-[3px] p-[11px] text-[14px] leading-3 w-[100%] mt-[8px]'
        >
          <option value="" disabled>-- Chọn Phường / Xã --</option>
          {ward?.data?.data.map((item: any) => (
            <option key={item.WardCode} value={item.WardCode}>{item.WardName}</option>
          ))}
        </select>
        {errors.ward && (
          <span className='italic text-red-500 text-[12px]'>{errors.ward.message}</span>
        )}
      </div>
      {/* Nút Submit */}
      <div className="flex mt-[20px] justify-end">
        <button type='submit' className='text-white bg-black p-[10px_20px] rounded-[3px] font-[500]'>Cập nhật</button>
      </div>
    </form>
  );

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return await axiosInstance.post(`/api/admins/orders/update_order/${id}`, { status });
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

  const { mutate } = useMutation({
    mutationFn: (addressData: any) => {
      try {
        return axios.put(`http://127.0.0.1:8000/api/client/shippingaddress/${idAddresses.id}`, addressData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        throw new Error('Có lỗi xảy ra');
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Cập nhật địa chỉ thành công'
      }),
        queryClient.invalidateQueries({
          queryKey: ['addresses']
        });
      setTimeout(() => {
        setCheckAddresses(!isCheckAddresses);
        setUpdateAddresses(!isUpdateAddresses);
      })
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật:", error);
      messageApi.open({
        type: 'error',
        content: error.message
      });
    },
  });

  const onSubmit = (data: any) => {
    console.log("Dữ liệu gửi đi:", data);
    mutate(data);
  };


  useEffect(() => {
    if (detailConfirm) {
      setValue("full_name", detailConfirm.full_name);
      setValue("phone_number", detailConfirm.phone_number);
      setValue("address_line", detailConfirm.address_line);
      setValue("city", detailConfirm.city);
      setValue("district", detailConfirm.district);
      setValue("ward", detailConfirm.ward);
      setValue("is_default", detailConfirm.is_default);
    }
  }, [detailConfirm, setValue])

  const { data: province, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ['province'],
    queryFn: async () => {
      return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
        }
      });
    },
  });

  const cityId: any = watch('city');
  console.log(cityId);

  const province_id = parseInt(cityId)
  const { data: district, isLoading: isLoadingDistrict } = useQuery({
    queryKey: ['district', cityId],
    queryFn: async () => {
      return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
        params: { province_id },
        headers: {
          token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
        }
      });
    },
    enabled: !!cityId,
  });


  console.log(district);

  const districtId: any = watch('district');
  const district_id = parseInt(districtId)
  const { data: ward, isLoading: isLoadingWard } = useQuery({
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


  useEffect(() => {
    setValue('district', '');
  }, [cityId, setValue]);

  useEffect(() => {
    setValue('ward', '');
  }, [districtId, setValue]);

  const provinceName =
    Array.isArray(province?.data)
      ? province.data.find((p: { ProvinceID: number }) => p.ProvinceID === Number(detailConfirm?.city))?.ProvinceName || "Không có tỉnh"
      : "Không có tỉnh";

  const districtName =
    Array.isArray(districtId?.data)
      ? districtId.data.find((d: { DistrictID: number }) => d.DistrictID === Number(detailConfirm?.district))?.DistrictName || "Không có quận"
      : "Không có quận";

  if (isLoading)
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      {contextHolder}
      <ToastContainer />
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
                  value={detailConfirm?.full_name}
                  icon="👤"
                />
                <DetailRow
                  label="Địa Chỉ"
                  value={`${detailConfirm?.address_line}, ${districtName}, ${provinceName}`}
                  icon="🏠"
                />
                <DetailRow
                  label="Email"
                  value={detailConfirm?.email_receiver}
                  icon="✉️"
                />
                <DetailRow
                  label="Số Điện Thoại"
                  value={detailConfirm?.phone_number}
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
                  value={detailConfirm?.payment_type_description}
                  icon="💳"
                />
                <DetailRow
                  label="Trạng Thái"
                  value={detailConfirm?.status_bill === 'processed' ? 'Chờ Lấy Hàng' : detailConfirm?.status_bill}
                  icon="🚚"
                />


                <DetailRow
                  label="Ngày Đặt Hàng"
                  value={`${detailConfirm?.order_date} ${detailConfirm?.order_time}`}
                  icon="📅"
                />
                <DetailRow
                  label="Ghi Chú"
                  value={detailConfirm?.note || 'Không có ghi chú'}
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
          {detailConfirm?.promotions?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 border">
              <h3 className="text-[18px] font-semibold text-gray-700 border-b pb-2 mb-4">Khuyến Mãi Đã Áp Dụng</h3>
              <ul className="space-y-2">
                {detailConfirm.promotions.map((promotion: any, index: number) => (
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
                value={parseFloat(detailConfirm?.subtotal).toLocaleString()}
              />
              <FinancialRow
                label="Phí Vận Chuyển"
                value={parseFloat(detailConfirm?.shipping_fee).toLocaleString()}
              />
              <FinancialRow
                label="Giảm Giá"
                value={parseFloat(detailConfirm?.discounted_amount).toLocaleString()}
              />
              <div className="md:col-span-2 mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[18px] font-bold text-gray-800">Tổng Cộng</span>
                  <span className="text-2xl font-bold text-red-500">
                    {parseFloat(detailConfirm?.total).toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Cập Nhật Địa Chỉ"
          visible={visible}
          onCancel={closeModal}
          footer={null}
        >
          {renderAddressForm()}
        </Modal>
      </div >

      <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 py-4 flex items-center justify-around shadow-lg">
        <div>
          <p className="text-sm font-medium text-gray-700">Cần thanh toán:</p>
          <span className="text-lg font-bold text-black">
            {parseFloat(detailConfirm?.total || 0).toLocaleString()} đ
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

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoadingPage from '../../loading/loadPage'
import LoadingDetail from '../../loading/loadDetail'

type Props = {}

const OrderDetail = (props: Props) => {

    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const { oderId } = useParams()

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: detail, isLoading: isLoadingOrderDetail } = useQuery({
        queryKey: ['orderDetail', oderId],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/products/showDetailOrder/${oderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
        },
    })

    useEffect(() => {
        if (detail) {
            setDistrictId(detail?.data.district);
        }
    }, [detail]);

    // Lấy tỉnh/thành phố
    const { data: province, isLoading: isLoadingProvinces } = useQuery({
        queryKey: ['province'],
        queryFn: async () => {
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694', // replace with your API key
                }
            });
        },
    });

    // Lấy quận/huyện
    const { data: district, isLoading: isLoadingDistrict } = useQuery({
        queryKey: ['district'],
        queryFn: async () => {
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
        }
    });

    // Lấy phường/xã
    const { data: ward, isLoading: isLoadingWard } = useQuery({
        queryKey: ['ward', districtId],
        queryFn: async () => {
            if (!districtId) return;
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                params: { district_id: districtId },
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

    if (isLoadingOrderDetail) return <LoadingPage />

    return (
        <div className="">
            <div className="">
                <div className="">
                    <div className="border-b-[8px] border-[#F0F0F0] -mx-[15px] p-[15px] text-[18px] font-[700] lg:border-t-0 lg:border-b-black lg:border-b-[3px]">Thông tin sản phẩm đặt hàng</div>
                    <div className="p-[15px] lg:border-t-0 -mx-[15px] border-b-[#e8e8e8] border-b-[1px] *:font-[700] flex justify-between">
                        <div className="">{detail?.data.code_orders}</div>
                        <div className="">Hủy đơn hàng</div>
                    </div>
                    <div className="grid gap-4 grid-cols-4 lg:gap-5 lg:grid-cols-12 py-[15px] border-b-[1px] border-b-[#e8e8e8] -mx-[15px] px-[15px]">
                        {detail?.data.bill_detail.map((item: any, index: any) => (
                            <div key={index + 1} className={`flex justify-between items-center col-span-4 lg:col-span-6`}>
                                <div className='flex'>
                                    <div className='w-[120px]'>
                                        <div
                                            className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${item.variation_images[1]})`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="w-[calc(100%-120px)] pl-[16px] flex flex-col">
                                        <h3 className='text-[15px] mb-[4px] font-[500] text-ellipsis line-clamp-2'>
                                            {item.name}
                                        </h3>
                                        <span className='text-[14px] font-[500]'>BeeStyle / {item.attribute_value_size} / {item.sku}</span>
                                        <span className='text-[14px] font-[500]'>Số lượng: {item.quantity}</span>
                                        <span className='mt-[14px] font-[700]'>{new Intl.NumberFormat('vi-VN').format(item.price) || 0} VND</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-6">
                        <div className="border-t-[8px] border-[#F0F0F0] -mx-[15px] p-[15px] border-b-[1px] text-[18px] font-[700] lg:border-t-0 lg:border-b-black lg:border-b-[3px]">Thành tiền</div>
                        <div className="flex justify-between py-[15px]">
                            <div className="*:text-[#787878] *:block *:text-[15px]">
                                <span>Giá sản phẩm</span>
                                <span className='mt-[10px]'>Phí giao hàng</span>
                                <span className='mt-[10px]'>Giảm giá giao hàng</span>
                                <span className='mt-[10px]'>Giảm giá sản phẩm</span>
                                <span className='mt-[10px]'>Tổng tiền</span>
                            </div>
                            <div className="flex flex-col items-end *:font-[500] *:text-[15px]">
                                <div>{new Intl.NumberFormat('vi-VN').format(detail?.data.subtotal) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(detail?.data.shipping_fee) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(detail?.data.discounted_shipping_fee) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(detail?.data.discounted_amount) || 0} VND</div>
                                <div className='mt-[10px]'>{new Intl.NumberFormat('vi-VN').format(detail?.data.total) || 0} VND</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-6">
                        <div className="border-t-[8px] border-[#F0F0F0] -mx-[15px] p-[15px] border-b-[1px] text-[18px] font-[700] lg:border-t-0 lg:border-b-black lg:border-b-[3px]">Địa chỉ nhận hàng</div>
                        <div className="flex justify-between py-[15px]">
                            <div className="*:text-[#787878] *:block *:text-[15px]">
                                <span>Tên khách hàng</span>
                                <span className='mt-[10px]'>Số điện thoại</span>
                                <span className='mt-[10px]'>Địa chỉ</span>
                            </div>
                            <div className="flex flex-col items-end *:font-[500] *:text-[15px]">
                                <div>{detail?.data.full_name}</div>
                                <div className='mt-[10px]'>{detail?.data.phone_number}</div>
                                <div className='mt-[10px]'>{detail?.data.address_line},&nbsp;
                                    <LocationDisplay
                                        wardId={detail?.data.ward}
                                        districtId={detail?.data.district}
                                        provinceId={detail?.data.city}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
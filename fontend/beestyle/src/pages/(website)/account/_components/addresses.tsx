import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import AddAddresses from "../../checkout/_components/addAddresses"
import UpdateAddresses from "../../checkout/_components/updateAddresses"
import LoadingPage from "../../loading/loadPage"

type Props = {}

const AddressesPage = (props: Props) => {

    const [isAddAddresses, setAddAddresses] = useState<boolean>(false)
    const [isCheckAddresses, setCheckAddresses] = useState<boolean>(false)
    const [isUpdateAddresses, setUpdateAddresses] = useState<boolean>(false)
    const [idAddresses, setIdAddresses] = useState<any>()


    const [messageApi, handleContext] = message.useMessage()
    const queryClient = useQueryClient()

    const { data: addresses, isLoading: isLoadingAddress } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            return await axios.get(`http://127.0.0.1:8000/api/client/shippingaddress`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
        },
    })

    const { mutate } = useMutation({
        mutationFn: (addressId: any) => {
            try {
                return axios.delete(`http://127.0.0.1:8000/api/client/shippingaddress/${addressId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
            } catch (error) {
                throw new Error("Xóa địa chỉ thất bại!!!")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Xóa địa chỉ thành công",
            }),
                queryClient.invalidateQueries({
                    queryKey: ['addresses'],
                })
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            })
        }
    })

    const handleDeleteAddress = (addressId: any) => {
        mutate(addressId)
        console.log(addressId);

    }

    // Lấy tỉnh/thành phố
    const { data: provinceData, isLoading: isLoadingProvinces } = useQuery({
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
    const { data: districtData, isLoading: isLoadingDistrict } = useQuery({
        queryKey: ['district'],
        queryFn: async () => {
            return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                }
            });
        },
    });

    const [wardsMap, setWardsMap] = useState<Record<number, Record<string, string>>>({});
    const fetchWardsByDistrict = async (districtId: number) => {
        if (wardsMap[districtId]) {
            return; // Nếu đã có dữ liệu, không cần gọi lại API
        }
        try {
            const { data } = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
                params: { district_id: districtId },
                headers: {
                    token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
                },
            });

            const wardDictionary = data?.data.reduce((acc: Record<string, string>, ward: any) => {
                acc[ward.WardCode] = ward.WardName;
                return acc;
            }, {});

            setWardsMap((prev) => ({
                ...prev,
                [districtId]: wardDictionary,
            }));
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };
    useEffect(() => {
        addresses?.data?.data.forEach((item: any) => {
            fetchWardsByDistrict(item.district);
        });
    }, [addresses]);

    const getProvinceName = (id: string) => provinceData?.data.data.find((item: any) => item.ProvinceID === parseInt(id))?.ProvinceName || 'Unknown Province';
    const getDistrictName = (id: string) => districtData?.data.data.find((item: any) => item.DistrictID === parseInt(id))?.DistrictName || 'Unknown District';


    if (isLoadingAddress) return (<LoadingPage />)
    return (
        <div className="">
            {handleContext}
            <div className="border-b-[2px] border-b-[#E8E8E8]">
                <div className="lg:border-b-[3px] lg:border-black py-[10px] font-[700] text-[16px] lg:text-[20px] border-[0px]">
                    Địa chỉ giao hàng
                </div>
                {addresses?.data.data.length > 0 ?
                    addresses?.data?.data
                        ?.sort((a: any, b: any) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
                        .map((item: any) => (

                            <div className="border-t-[1px] border-t-[#E8E8E8] py-[16px] lg:py-[24px] lg:px-[12px]">
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        {item?.is_default && (
                                            <div className="py-[5px] w-[70px] text-center rounded-[3px] text-[12px] mt-[5px] text-white bg-black mr-[10px]">Mặc định</div>
                                        )}
                                        <span className='text-[16px] font-[700]'>{item.full_name}</span>
                                    </div>
                                    <div className="flex text-[14px] text-[#787878] font-[500]">
                                        <div onClick={() => { setUpdateAddresses(!isUpdateAddresses), setIdAddresses(item) }} className="cursor-pointer">Cập nhật</div>
                                        {item?.is_default ? "" : (<div onClick={() => handleDeleteAddress(item.id)} className='ml-[12px] cursor-pointer'>Xóa địa chỉ</div>)}
                                    </div>
                                </div>
                                <div className="*:text-[14px] font-[500]">
                                    <div className="mt-[4px] lg:mt-[8px]">Địa chỉ: {item.address_line}, {wardsMap[item.district]?.[item.ward] || "Đang tải..."}, {getDistrictName(item.district)}, {getProvinceName(item.city)}</div>
                                    <div className="mt-[4px] lg:mt-[8px]">Số điện thoại: {item.phone_number}</div>
                                </div>
                            </div>
                        ))
                    :
                    (
                        <div className="w-[100%] py-[130px] flex flex-col items-center">
                            <div className="icon-empty-cart">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="gray" className="size-14">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                </svg>

                            </div>
                            <p className='my-[24px] text-[14px] font-[500] text-[#BCBCBC]'>Không có địa chỉ, vui lòng thêm địa chỉ</p>
                        </div>
                    )
                }
            </div>
            <div onClick={() => setAddAddresses(!isAddAddresses)} className="mt-[24px] flex justify-center cursor-pointer lg:pt-[25px]">
                <span className='border-[1px] border-[#D0D0D0] p-[12px_32px] rounded-[3px] font-[500]'>Thêm địa chỉ giao hàng</span>
            </div>

            <UpdateAddresses isUpdateAddresses={isUpdateAddresses} isCheckAddresses={isCheckAddresses} setUpdateAddresses={setUpdateAddresses} setCheckAddresses={setCheckAddresses} idAddresses={idAddresses} />
            <AddAddresses isCheckAddresses={isCheckAddresses} isAddAddresses={isAddAddresses} setCheckAddresses={setCheckAddresses} setAddAddresses={setAddAddresses} />
        </div>
    )
}

export default AddressesPage
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    isCheckAddresses: boolean
    isAddAddresses: boolean
    isUpdateAddresses: boolean
    setUpdateAddresses: Dispatch<SetStateAction<boolean>>
    setCheckAddresses: Dispatch<SetStateAction<boolean>>
    setAddAddresses: Dispatch<SetStateAction<boolean>>
    setIdAddresses: any
    handleSelectProduct: any
    selectedAddress: any
}
interface AddressForm {
    check: any;
}

const CheckAddresses = ({ selectedAddress, handleSelectProduct, isCheckAddresses, isAddAddresses, isUpdateAddresses, setCheckAddresses, setAddAddresses, setUpdateAddresses, setIdAddresses }: Props) => {

    // debugger    
    const [addressCode, setAddresCode] = useState<any>([])
    const [ward, setWard] = useState<any>([])
    // console.log(ward);

    const getWardName = (WardId: string) => {
        // console.log(WardId);
        
        if (ward) {
            //  const data = ward.find((item: any) => item.WardCode == WardId)
            //  console.log(data);
             
             return ward?.WardName || 'Unknown Ward';
        }
    }
    

    useEffect(() => {
        (async () => {
            if (addressCode) {
                addressCode?.data?.data.map(async (item: any) => {
                    const { data } = await getWard(item.district)                    
                    if(data){
                        const pr = data.find((value: any) => value.WardCode === item.ward)
                        if(pr){
                           
                            setWard(pr);
                            
                            
                        }
    
                    }
    
                })
            }
        }) ();
    }, [])

    // const getWardName = async (WardName: any) => {
    //     if (addressCode) {
    //         addressCode.data.data.map(async (item: any) => {
    //             const { data } = await getWard(item.district)
    //             if(data){
    //                 const pr = data.find((item: any) => item.WardCode === WardName)
    //                 if(pr){
    //                     console.log(pr.WardName);
    //                     return pr?.WardName
    //                 }

    //             }

    //         })
    //     }
    // }


    const getWard = async (districtId: any) => {
        const { data } = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
            params: { district_id: districtId },
            headers: {
                token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
            }
        })
        return data
    }

    const [districtId, setDistrictId] = useState<number | null>(null);

    const token = localStorage.getItem('token')


    const { data: addresses } = useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const data = await axios.get(`http://127.0.0.1:8000/api/client/shippingaddress`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setAddresCode(data)
            return data
        },
    })

    useEffect(() => {
        if (addresses?.data?.data.length === 0) {
            setAddAddresses(true)
            setCheckAddresses(false)
        }
    }, [addresses])


    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<AddressForm>()

    const [idCheck, setIdCheck] = useState<any>()

    useEffect(() => {
        if (selectedAddress) {
            setIdCheck(selectedAddress?.id)
        }
    }, [selectedAddress])

    const onSubmit = (idAddress: any) => {
        handleSelectProduct(idAddress);
        setCheckAddresses(!isCheckAddresses)
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




    // const { data: ward, isLoading: isLoadingWard } = useQuery({
    //     queryKey: ['ward', districtId],
    //     queryFn: async () => {
    //         return await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
    //             params: { district_id: districtId },
    //             headers: {
    //                 token: '4bd9602e-9ad5-11ef-8e53-0a00184fe694',
    //             }
    //         });
    //     },
    //     enabled: !!districtId,
    // });

    // Lookup functions with string conversion
    const getProvinceName = (id: string) => provinceData?.data.data.find((item: any) => item.ProvinceID === parseInt(id))?.ProvinceName || 'Unknown Province';
    const getDistrictName = (id: string) => districtData?.data.data.find((item: any) => item.DistrictID === parseInt(id))?.DistrictName || 'Unknown District';

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

    return (
        <>
            {isCheckAddresses && (
                <div className={`step fixed z-20 flex-col top-0`}>
                    <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 flex top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[400px] max-w-[600px] w-[100%] p-[20px]">
                        <form onSubmit={handleSubmit(onSubmit)} className='w-[100%]'>
                            <h2 className='font-[700] text-[20px]'>Địa chỉ của tôi</h2>
                            <div className="mt-[10px] max-h-[600px] overflow-y-auto">
                                {addresses?.data?.data
                                    ?.sort((a: any, b: any) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
                                    .map((item: any) => (
                                        <div key={item?.id} className="flex py-[15px] border-t-[1px] border-t-[#e8e8e8] items-center">
                                            <div className="w-[20px] mr-[10px]">
                                                <input {...register('check')} value={item.id} defaultChecked={item.id === idCheck} className='' type="radio" />
                                            </div>
                                            <div className="flex justify-between w-[calc(100%-20px)]">
                                                <div className="mr-[20px] w-[calc(100%-90px)]">
                                                    <div className="flex">
                                                        <span className='mr-[10px] pr-[10px] border-r-[1px] border-r-[#787878] font-[500] text-[16px]'>{item.full_name}</span>
                                                        <p className='text-[#787878]'>{item.phone_number}</p>
                                                    </div>
                                                    <div className="mt-[5px]">
                                                        <div className="text-[#787878]"> {item.address_line} ,{wardsMap[item.district]?.[item.ward] || "Đang tải..."}, {getDistrictName(item.district)}, {getProvinceName(item.city)}</div>
                                                        {item?.is_default && (
                                                            <div className="py-[5px] w-[70px] text-center rounded-[3px] text-[12px] mt-[5px] text-white bg-black">Mặc định</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span onClick={() => { setIdAddresses(item); setUpdateAddresses(!isUpdateAddresses); setCheckAddresses(!isCheckAddresses); }} className='cursor-pointer font-[500] w-[90px] text-center'>Cập nhật</span>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                            <div className="cursor-pointer border-[1px] border-black w-[180px] py-[5px] flex justify-center rounded-[3px] mt-[10px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span onClick={() => { setCheckAddresses(!isCheckAddresses); setAddAddresses(!isAddAddresses); }}>Thêm địa chỉ mới</span>
                            </div>
                            <div className="flex mt-[20px] justify-end">
                                {/* <div onClick={() => setCheckAddresses(!isCheckAddresses)} className="cursor-pointer mr-[20px] text-black bg-[#F8F8F8] p-[10px_20px] rounded-[3px] font-[500]">Hủy</div> */}
                                <button type='submit' className='text-white bg-black p-[10px_20px] rounded-[3px] font-[500]'>Xác nhận</button>
                            </div>
                        </form>
                    </div>
                    <div className="block bg-black opacity-[0.7] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
                </div>
            )}
        </>
    )
}

export default CheckAddresses
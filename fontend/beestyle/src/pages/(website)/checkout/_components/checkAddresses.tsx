import React, { Dispatch, SetStateAction } from 'react'

type Props = {
    isCheckAddresses: boolean
    isAddAddresses: boolean
    setCheckAddresses: Dispatch<SetStateAction<boolean>>
    setAddAddresses: Dispatch<SetStateAction<boolean>>
}

const CheckAddresses = ({ isCheckAddresses, isAddAddresses, setCheckAddresses, setAddAddresses }: Props) => {
    return (
        <>
            {isCheckAddresses && (
                <div className={`fixed z-10 flex-col top-0`}>
                    <div className="fixed overflow-hidden rounded-[5px] bg-white z-20 flex top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] min-w-[400px] max-w-[600px] w-[100%] p-[20px]">
                        <form className='w-[100%]'>

                            <h2 className='font-[700] text-[20px]'>Địa chỉ của tôi</h2>
                            <div className="mt-[10px] max-h-[600px] overflow-y-auto">
                                <div className="flex py-[15px] border-t-[1px] border-t-[#787878] items-center">
                                    <div className="w-[20px] mr-[10px]">
                                        <input name="check-addresses" className='' type="radio" />
                                    </div>
                                    <div className="flex justify-between w-[calc(100%-20px)]">
                                        <div className="mr-[20px]">
                                            <div className="flex">
                                                <span className='mr-[10px] pr-[10px] border-r-[1px] border-r-[#787878] font-[500] text-[16px]'>Lê Hoàng Anh</span>
                                                <p className='text-[#787878]'>03484345656</p>
                                            </div>
                                            <div className="mt-[5px]">
                                                <div className="text-[#787878]">Làng Cát, Phường Duy Hải, Thị Xã Duy Tiên, Hà Nam</div>
                                                <div className="py-[5px] w-[70px] text-center rounded-[3px] text-[12px] mt-[5px] text-white bg-black">Mặc định</div>
                                            </div>
                                        </div>
                                        <span className='font-[500] w-[90px] text-center'>Cập nhật</span>
                                    </div>
                                </div>
                                <div className="flex py-[15px] border-t-[1px] border-t-[#787878] items-center">
                                    <div className="w-[20px] mr-[10px]">
                                        <input name="check-addresses" className='' type="radio" />
                                    </div>
                                    <div className="flex justify-between w-[100%]">
                                        <div className="mr-[20px]">
                                            <div className="flex">
                                                <span className='mr-[10px] pr-[10px] border-r-[1px] border-r-[#787878] font-[500] text-[16px]'>Lê Hoàng Anh</span>
                                                <p className='text-[#787878]'>03484345656</p>
                                            </div>
                                            <div className="mt-[5px]">
                                                <div className="text-[#787878]">Làng Cát, Phường Duy Hải, Thị Xã Duy Tiên, Hà Nam</div>
                                            </div>
                                        </div>
                                        <span className='font-[500] w-[90px] text-center'>Cập nhật</span>
                                    </div>
                                </div>

                            </div>
                            <div className="cursor-pointer border-[1px] border-black w-[180px] py-[5px] flex justify-center rounded-[3px] mt-[10px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span onClick={() => { setCheckAddresses(!isCheckAddresses), setAddAddresses(!isAddAddresses) }}>Thêm địa chỉ mới</span>
                            </div>
                            <div className="flex mt-[20px] justify-end">
                                <div onClick={() => setCheckAddresses(!isCheckAddresses)} className="cursor-pointer mr-[20px] text-black bg-[#F8F8F8] p-[10px_20px] rounded-[3px] font-[500]">Hủy</div>
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
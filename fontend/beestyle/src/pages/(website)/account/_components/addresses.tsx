import { useQuery } from "@tanstack/react-query"
import axios from "axios"


type Props = {}

const AddressesPage = (props: Props) => {

    // const { data: addresses } = useQuery({
    //     queryKey: ['addresses'],
    //     queryFn: async () => {
    //         return await axios.get(`http://127.0.0.1:8000/api/client/shippingaddress`)
    //     },        
    // })
    // console.log(addresses);
  return (
    <div className="">
        <div className="border-b-[2px] border-b-[#E8E8E8]">
            <div className="lg:border-b-[3px] lg:border-black py-[10px] font-[700] text-[16px] lg:text-[20px] border-[0px]">
                Địa chỉ giao hàng
            </div>
            
            <div className="border-t-[1px] border-t-[#E8E8E8] py-[16px] lg:py-[24px] lg:px-[12px]">
                <div className="flex justify-between">
                    <div className="">
                        <span className='border-[1px] border-[##E8E8E8] p-[3px_5px] rounded-[2px] text-[12px] mr-[5px]'>Mặc định</span>
                        <span className='text-[16px] font-[700]'>Lê Hoàng Anh</span>
                    </div>
                    <div className="text-[14px] text-[#787878] font-[500]">
                        <a href="">Cập nhật</a>
                        <a href="" className='ml-[12px]'>Xóa địa chỉ</a>
                    </div>
                </div>
                <div className="*:text-[14px] font-[500]">
                    <div className="mt-[4px] lg:mt-[8px]">Địa chỉ: Nam Từ Liêm, Hà Nội</div>
                    <div className="mt-[4px] lg:mt-[8px]">Số điện thoại: 0335677021</div>
                </div>
            </div>


        </div>
        <div className="mt-[24px] flex justify-center lg:pt-[25px]">
            <span className='border-[1px] border-[#D0D0D0] p-[12px_32px] rounded-[3px] font-[500]'>Thêm địa chỉ giao hàng</span>
        </div>
    </div>
  )
}

export default AddressesPage
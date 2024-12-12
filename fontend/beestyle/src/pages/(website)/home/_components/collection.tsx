import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
const Collection = () => {

    const { data: collections, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            return axios.get(`http://127.0.0.1:8000/api/client/home/productcollection`)
        }
    })

    return (
        !isLoading &&
        <section>
            <div className="pt-[40px]">
                <div className="px-[15px] pc:px-[48px]">

                    <div className="mb-[20px] lg:flex lg:justify-between lg:items-center">
                        <h3 className='font-[600] text-[24px] lg:text-[32px]'>BỘ SƯU TẬP</h3>
                    </div>

                    <div className="lg:relative">
                        <div className="-mx-[15px] lg:-mx-[0]">
                            <picture>
                                <img className='w-full lg:hidden' src="https://file.hstatic.net/200000642007/file/750x680_c75ac57407f243fca2808de6faa70524.jpg" alt="" />
                                <img className='w-full hidden lg:block pc:block' src="https://file.hstatic.net/200000642007/file/1614x820_76ccb179b274411685d3d1fbeab117ed.jpg" alt="" />
                            </picture>
                        </div>

                        <div className="w-full lg:absolute top-0 lg:w-[60%] lg:right-0 lg:top-[50%] lg:translate-y-[-50%]">
                            <div className="absolute -mt-[34px] bg-white p-[15px] w-full h-[90px] lg:mb-[15px] lg:h-auto lg:p-[0] lg:bg-transparent">
                                <h5 className='text-[16px] font-[600] lg:text-[18px] lg:mb-[10px]'>YOUNG & HIP</h5>
                                <h4 className='text-[24px] font-[600] lg:text-[40px] lg:leading-[45px]'>#Varsity Collection</h4>
                            </div>

                            <div className="w-[100%] pt-[55px]">
                                <div className="-mx-[15px] lg:-mx-[0] flex gap-2 overflow-x-auto whitespace-nowrap scrollbar">

                                    {collections?.data.data.map((item: any) => (
                                        <div className="w-[38.66%] shrink-0 relative">
                                            <div className="absolute top-[16px] right-[16px]">
                                                <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                    <div className="w-[24px] h-[24px]">
                                                        <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                <picture>
                                                    <div className="pt-[124%] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${item?.variations[0]?.variation_album_images[0]})`, }}></div>
                                                </picture>
                                            </div>
                                            <div className="w-[100%] text-wrap px-[10px] py-[16px] lg:bg-white">
                                                <div className="">
                                                    <h4 className='description2 mb-[5px] text-[14px] font-[600]'>{item.name}</h4>
                                                    <div className="text-[14px] font-[700]">
                                                        <span className=''>{new Intl.NumberFormat('vi-VN').format(item.price)}</span><sup className='underline'>đ</sup>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 justify-start mt-[18px]">
                                                    <div className="w-[12px] h-[12px] rounded-[100%] border-black border-[6px] bg-black"></div>
                                                    <div className="w-[12px] h-[12px] rounded-[100%] border-red-500 border-[6px] bg-red-500"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Collection
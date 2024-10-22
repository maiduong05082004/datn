import { Select, Space } from 'antd'
import ProductsList from './_components/product'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import LoadingPage from '../loading/page'


type Props = {}

const ListPage = (props: Props) => {

    const [filter, setFilter] = useState<boolean>(false)
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);
    const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(false);
    const [isPriceMenuOpen, setIsPriceMenuOpen] = useState(false);

    const { id } = useParams()
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [sizeIds, setSizeIds] = useState<string[]>([]);
    const [priceCheck, setPiceCheck] = useState<string>("");

    console.log(priceCheck);


    const { data: products , isLoading } = useQuery({
        queryKey: ['products', id, categoryIds, sizeIds, priceCheck],
        queryFn: () => {
            return axios.post(`http://127.0.0.1:8000/api/client/categories/${id}`, {sizes: sizeIds.length === 0 ? "" : sizeIds ,category_ids: categoryIds.length === 0 ? "" : categoryIds, price_range: priceCheck })
        }
    })


    const { data: categoryChildren } = useQuery({
        queryKey: ['categoryChildren', id],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories/${id}/children`)
        }
    })

    const { data: color } = useQuery({
        queryKey: ['color'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories/colors`)
        }
    })

    const { data: size } = useQuery({
        queryKey: ['size'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories/${id}/sizes`)
        }
    })

    // console.log(size);






    const toggleSelect = (id: string) => {
        setCategoryIds((prev: any) =>
            prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
        );
    };
    const toggleSize = (id: string) => {
        setSizeIds((prev: any) =>
            prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id]
        );
    };

    // if(isLoading) return (<LoadingPage />)

    return (
        <main>
            {isLoading && <LoadingPage />}
            <div className="my-[15px] text-center flex justify-center lg:my-[30px]">
                <h1 className='text-[24px] font-[650] lg:text-[32px]'>Quần Áo</h1>
            </div>

            <div className="">
                <div className="*:text-[14px] font-[500] leading-5 px-[15px] relative pc:px-[48px]">
                    <div style={{
                        // maxHeight: todo ? '100px' : '',
                        overflow: 'hidden',
                    }} className="">
                        <p className="text-center">
                            Bộ sưu tập&nbsp;
                            <strong>Quần</strong>&nbsp;
                            <strong>Áo MLB</strong>&nbsp;
                            tại MLB Việt Nam - Thời trang thể thao đa dạng.
                        </p>
                        <p className="text-center">
                            &nbsp;
                        </p>
                        <p className="text-center">
                            <strong>MLB Việt Nam</strong>&nbsp;
                            tự hào giới thiệu bộ sưu tập Áo MLB với thiết kế
                            đa dạng từ áo phông, áo hoodie đến áo khoác, sử dụng
                            chất liệu thoáng khí và co giãn để mang đến sự thoải
                            mái và linh hoạt khi bạn vận động. Khám phá bộ sưu tập&nbsp;
                            <strong>Quần</strong>
                            &nbsp;
                            <strong>Áo MLB</strong>
                            &nbsp;
                            và tạo nên phong cách thể thao đẳng cấp và nổi bật.
                        </p>
                    </div>
                    <div className="w-full h-full lg:hidden">
                        <div className="absolute h-[100px] w-[100%] bottom-[30px] bg-gradient-to-t from-white to-transparent"></div>

                        <div className="mt-[10px] mb-[20px] text-center bg-white w-full h-full">
                            <span className='cursor-pointer border-b-[#808080] border-b-[1px] pb-[2px] bg-white'>Xem thêm</span>
                            <span className='cursor-pointer border-b-[#808080] border-b-[1px] pb-[2px]'>Rút gọn</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-[15px] py-[10px] mb-[20px] border-t-[##e8e8e8] border-b-[#e8e8e8] border-t-[1px] border-b-[1px] lg:py-[20px] lg:mb-[8px] lg:border-none pc:px-[48px]">
                <div className="block lg:justify-between lg:items-center lg:px-0 lg:flex">

                    <div className="*:text-[12px] *:font-[500] hidden lg:block">
                        <span className='text-[#787878]'>DANH MUC {'>'} </span>
                        <span className='text-[#787878]'>TRANG CHU {'>'} </span>
                        <span>QUAN AO</span>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex cursor-pointer items-center lg:border-[#E8E8E8] lg:border-[1px] lg:px-[16px] lg:py-[10px] lg:rounded-[4px]">
                            <span className='mr-[5px] text-[14px] font-[500] lg:mr-[20px]'>Bộ lọc</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1.33325 2.66699H8.83325" stroke="black" stroke-linecap="square"></path><path d="M12.1665 2.66699L14.6665 2.66699" stroke="black" stroke-linecap="square"></path><path d="M7.1665 9.33301L14.6665 9.33301" stroke="black" stroke-linecap="square"></path><path d="M1.33325 9.33301H3.83325" stroke="black" stroke-linecap="square"></path><ellipse cx="5.49992" cy="9.33366" rx="1.66667" ry="1.66667" stroke="black"></ellipse><ellipse cx="10.4999" cy="2.66667" rx="1.66667" ry="1.66667" stroke="black"></ellipse></svg>
                        </div>

                        <div className="my-[3px] text-[14px] font-[500] lg:ml-[12px]">
                            <Space wrap>
                                <Select
                                    defaultValue="Sắp xếp"
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 'jack', label: 'Jack' },
                                        { value: 'lucy', label: 'Lucy' },
                                        { value: 'Yiminghe', label: 'yiminghe' },
                                        { value: 'disabled', label: 'Disabled', disabled: true },
                                    ]}
                                />
                            </Space>
                        </div>
                    </div>
                </div>
            </div>

            <ProductsList />

            {/* <div className={` fixed max-w-[440px] w-[100%] top-0 right-0 z-20 bg-white flex-col justify-between h-full`}>
                <div className=" bg-white z-20 h-full">
                    <div className="flex justify-between items-center p-[8px_20px] shadow-sm">
                        <h2 className="text-lg font-semibold">Bộ lọc</h2>
                        <div className="flex cursor-pointer w-[40px] h-[40px] justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="black" stroke-width="1.2" stroke-linecap="square" stroke-linejoin="round"></path><path d="M6 6L18 18" stroke="black" stroke-width="1.2" stroke-linecap="square" stroke-linejoin="round"></path></svg>
                        </div>
                    </div>
                    <div className="p-[48px_24px] h-full overflow-y-auto whitespace-nowrap scrollbar">
                        <div className="">
                            <div className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="font-medium">Màu sắc</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                    {isColorMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" stroke-width="1.2" stroke-linecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isColorMenuOpen && (
                                <div className="grid grid-cols-8 gap-6 mt-[26px] mb-[46px]">
                                    <div className="w-6 h-6 bg-black rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-white border rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-red-500 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-gray-400 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-purple-600 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-pink-300 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-yellow-400 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-purple-800 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-green-400 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-pink-100 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-yellow-500 rounded-full cursor-pointer"></div>
                                    <div className="w-6 h-6 bg-black bg-checkered-pattern rounded-full cursor-pointer"></div>
                                </div>
                            )}
                        </div>
                        <div className="mt-[16px]">
                            <div onClick={() => setIsDesignMenuOpen(!isDesignMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="font-medium">Loại sản phẩm</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                {isDesignMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" stroke-width="1.2" stroke-linecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isDesignMenuOpen && (
                                <div className="flex flex-wrap justify-start mt-[26px] mb-[46px] ">
                                    <div className="flex flex-wrap justify-start mb-[46px] ">
                                        {categoryChildren?.data?.categories?.children.map((item: any) => (
                                            item.children.length > 0 ? (
                                                item.children.map((item: any) => (
                                                    <div onClick={() => toggleSelect(item.id)} className={`${
                                                        categoryIds.includes(item.id)
                                                          ? 'bg-black text-white'
                                                          : 'bg-white text-black'
                                                      } cursor-pointer select-none  px-4 py-2 rounded-full border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px] text-[12px]`}>
                                                        {item.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="cursor-pointer select-none bg-white text-black px-4 py-2 rounded-full border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px] text-[12px]">
                                                    {item.name}
                                                </div>
                                            )
                                        ))}

                                    </div>

                                </div>)}
                        </div>
                        <div className="mt-[16px]">
                            <div onClick={() => setIsSizeMenuOpen(!isSizeMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="font-medium">Kích thước</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                {isSizeMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" stroke-width="1.2" stroke-linecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isSizeMenuOpen && (
                                <div className="flex flex-wrap justify-start mt-[26px] mb-[46px] ">
                                    {size?.data?.attributes.map((item: any) => (
                                        item.value.map((value: any, index: any) => (

                                            <div key={index + 1} onClick={() => toggleSize(value)} className={`${
                                                sizeIds.includes(value)
                                                  ? 'bg-black text-white'
                                                  : 'bg-white text-black'}
                                                   cursor-pointer select-none flex justify-center items-center w-[40px] h-[40px] px-4 py-2 border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px]`}>
                                                {value}
                                            </div>
                                        ))
                                    ))}
                                </div>)}
                        </div>
                        <div className="mt-[16px]">
                            <div onClick={() => setIsPriceMenuOpen(!isPriceMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                <h3 className="cursor-pointer select-none  font-medium">Giá</h3>
                                <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                {isPriceMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" stroke-width="1.2" stroke-linecap="square"></path></svg>) :
                                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>)
                                    }
                                </div>
                            </div>
                            {isPriceMenuOpen && (
                                <div className="flex flex-col mt-[26px] mb-[46px] ">
                                    <div className=" cursor-pointer select-none flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("under_1m")} id="under_1m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="under_1m"  className='ml-[10px]'>Dưới 1.000.000 VND</label>
                                    </div>
                                    <div className="flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("1m_to_2m")} id="1m_to_2m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="1m_to_2m" onClick={() => setPiceCheck("1m_to_2m")} className='ml-[10px]'>1.000.000 - 2.000.000 VND</label>
                                    </div>
                                    <div className="flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("2m_to_3m")} id="2m_to_3m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="2m_to_3m" onClick={() => setPiceCheck("2m_to_3m")} className='ml-[10px]'>2.000.000 - 3.000.000 VND</label>
                                    </div>
                                    <div className="flex items-center mb-[5px]">
                                        <input onClick={() => setPiceCheck("above_4m")} id="above_4m" className='w-[20px] h-[20px]' type="radio" name="otp" />
                                        <label htmlFor="above_4m" onClick={() => setPiceCheck("above_4m")} className='ml-[10px]'>Trên 4.000.000 VND</label>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
                <div className="block bg-black opacity-[0.24] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
            </div> */}

        </main>
    )
}

export default ListPage
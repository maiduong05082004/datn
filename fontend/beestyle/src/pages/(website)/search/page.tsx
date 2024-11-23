import { useEffect, useState } from 'react'
import { Select, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import ProductsList from '../list/_components/product'

type Props = {
    isKeySearch: string
}

const SearchPage = ({ isKeySearch }: Props) => {
    const [todo, setTodo] = useState<boolean>(false)
    const [filter, setFilter] = useState<boolean>(false)
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);
    const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(false);
    const [isPriceMenuOpen, setIsPriceMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    console.log(inputValue);

    useEffect(() => {
        if (isKeySearch) {
            setInputValue(isKeySearch)
        }
    }, [isKeySearch])

    const handleSearch = (e: any) => {
        setInputValue(e.target.value)
    }

    const handlerInputSearch = (e: any) => {
        setInputValue(e.target.value)
    }

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchName = queryParams.get('keyword')

    // console.log(searchName);
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ['search', searchName],
        queryFn: async () => {
            return axios.get(`http://127.0.0.1:8000/api/client/home/search?keyword=${searchName}`)
        },
    })

    useEffect(() => {
        if(products) {
            const firstTwoProducts = products?.data.products.slice(0, 8);
            localStorage.setItem("suggest", JSON.stringify(firstTwoProducts));
        }
    }, [])

    console.log(products);
    
    


    return (
        <main>
            <div className="pt-[20px] lg:pt-[110px]">
                <form action="" className="relative px-[15px] w-[100%] max-w-[640px] mx-auto">
                    <input value={inputValue} onChange={(e) => handleSearch(e)} className="h-[48px] border-b-[3px] border-b-black pl-[55px] pr-[15px] w-[100%] outline-none text-[20px] text-black font-[500] leading-8 lg:h-[64px]" placeholder="#Giày MLB Chunky Liner" type="text" name="" id="" />
                    <Link to={`/search?keyword=${inputValue}`} className="bg-transparent absolute bottom-[10px] left-[25px] w-[32px] h-[32px] flex items-center justify-center lg:bottom-[15px]">
                        <div className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                            <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" data-src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" alt="Icon search" width={40} height={40} />
                        </div>
                    </Link>
                </form>
            </div>


            {products?.data?.products.length ? (
                <>
                    <div className="px-[15px] py-[10px] mb-[20px] mt-[30px] border-t-[##e8e8e8] border-b-[#e8e8e8] border-t-[1px] border-b-[1px] lg:py-[20px] lg:mb-[8px] lg:mt-[85px] lg:border-none pc:px-[48px] ">
                        <div className="block lg:justify-between lg:items-center lg:px-0 lg:flex">

                            <div className="*:text-[28px] *:font-[500] hidden lg:block">
                                <span className='text-black flex'>Kết quả tìm kiếm ({products?.data.products.length || 0})</span>
                            </div>

                            <div className="flex justify-between">
                                <div onClick={() => setFilter(!filter)} className="flex cursor-pointer items-center lg:border-[#E8E8E8] lg:border-[1px] lg:px-[16px] lg:py-[10px] lg:rounded-[4px]">
                                    <span className='mr-[5px] text-[14px] font-[500] lg:mr-[20px]'>Bộ lọc</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1.33325 2.66699H8.83325" stroke="black" strokeLinecap="square"></path><path d="M12.1665 2.66699L14.6665 2.66699" stroke="black" strokeLinecap="square"></path><path d="M7.1665 9.33301L14.6665 9.33301" stroke="black" strokeLinecap="square"></path><path d="M1.33325 9.33301H3.83325" stroke="black" strokeLinecap="square"></path><ellipse cx="5.49992" cy="9.33366" rx="1.66667" ry="1.66667" stroke="black"></ellipse><ellipse cx="10.4999" cy="2.66667" rx="1.66667" ry="1.66667" stroke="black"></ellipse></svg>
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

                    <ProductsList products={products} />

                    <div className={`${filter ? "flex" : "hidden"} fixed max-w-[440px] w-[100%] top-0 right-0 z-20 bg-white flex-col justify-between h-full`}>
                        <div className=" bg-white z-20 h-full">
                            <div className="flex justify-between items-center p-[8px_20px] shadow-sm">
                                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                                <div onClick={() => setFilter(!filter)} className="flex cursor-pointer w-[40px] h-[40px] justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="black" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round"></path><path d="M6 6L18 18" stroke="black" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round"></path></svg>
                                </div>
                            </div>
                            <div className="p-[48px_24px] h-full overflow-y-auto whitespace-nowrap scrollbar">
                                <div className="">
                                    <div onClick={() => setIsColorMenuOpen(!isColorMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                        <h3 className="font-medium">Màu sắc</h3>
                                        <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                            {isColorMenuOpen ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>)
                                            }
                                        </div>
                                    </div>
                                    {isDesignMenuOpen && (
                                        <div className="flex flex-wrap justify-start mt-[26px] mb-[46px] ">
                                            <div className="bg-black text-white px-4 py-2 rounded-full mr-[8px] mb-[8px]">
                                                Áo ba lỗ
                                            </div>
                                            <div className="bg-white text-black px-4 py-2 rounded-full border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px]">
                                                Áo ba lỗ
                                            </div>
                                        </div>)}
                                </div>
                                <div className="mt-[16px]">
                                    <div onClick={() => setIsSizeMenuOpen(!isSizeMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                        <h3 className="font-medium">Kích thước</h3>
                                        <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                            {isSizeMenuOpen ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>)
                                            }
                                        </div>
                                    </div>
                                    {isSizeMenuOpen && (
                                        <div className="flex flex-wrap justify-start mt-[26px] mb-[46px] ">
                                            <div className="flex justify-center items-center w-[40px] h-[40px] bg-white text-black px-4 py-2 border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px]">
                                                XL
                                            </div>
                                            <div className="flex justify-center items-center w-[40px] h-[40px] bg-white text-black px-4 py-2 border-[1px] border-[#E8E8E8] mr-[8px] mb-[8px]">
                                                XL
                                            </div>
                                        </div>)}
                                </div>
                                <div className="mt-[16px]">
                                    <div onClick={() => setIsPriceMenuOpen(!isPriceMenuOpen)} className="flex justify-between items-center pb-[16px] border-b-[1px] border-b-[#E8E8E8]">
                                        <h3 className="font-medium">Giá</h3>
                                        <div className="w-[24px] h-[24px] border-[1px] border-[#E8E8E8] rounded-[100%] flex justify-center items-center cursor-pointer">
                                            {isPriceMenuOpen ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L4.75 1.25L8.5 5" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>) :
                                                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>)
                                            }
                                        </div>
                                    </div>
                                    {isPriceMenuOpen && (
                                        <div className="flex flex-col mt-[26px] mb-[46px] ">
                                            <div className="flex items-center mb-[5px]">
                                                <input className='w-[20px] h-[20px]' type="checkbox" />
                                                <label className='ml-[10px]' htmlFor="">Dưới 1.000.000 VND</label>
                                            </div>
                                            <div className="flex items-center mb-[5px]">
                                                <input className='w-[20px] h-[20px]' type="checkbox" />
                                                <label className='ml-[10px]' htmlFor="">1.000.000 - 2.000.000 VND</label>
                                            </div>
                                            <div className="flex items-center mb-[5px]">
                                                <input className='w-[20px] h-[20px]' type="checkbox" />
                                                <label className='ml-[10px]' htmlFor="">2.000.000 - 3.000.000 VND</label>
                                            </div>
                                            <div className="flex items-center mb-[5px]">
                                                <input className='w-[20px] h-[20px]' type="checkbox" />
                                                <label className='ml-[10px]' htmlFor="">Trên 4.000.000 VND</label>
                                            </div>
                                        </div>)}
                                </div>
                            </div>
                        </div>
                        <div className="block bg-black opacity-[0.24] fixed w-[100%] h-[100%] top-0 left-0 z-10"></div>
                    </div>
                </>

            ) : (
                <div className="flex justify-center">
                    <div className="flex flex-col justify-center items-center text-center pt-[80px] pb-[100px] lg:pt-[120px] lg:pb-[140px]">
                        <img className='' width={64} height={64} src="https://file.hstatic.net/200000642007/file/nodata_f5cef3c4919e47f8a881eaaacb1f6a1c.png" alt="Tìm kiếm" />
                        <span className='text-[14px] font-[500] mt-[20px] text-[#BCBCBC]'>
                            Không tìm thấy kết quả cho tìm kiếm của bạn<br />
                            Thử một từ khóa khác
                        </span>
                    </div>
                </div>
            )}

        </main>
    )
}

export default SearchPage
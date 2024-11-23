
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddProductCart from './AddProductCart';

type Props = {}

const Search = ({ isSearch, setIsSearch, setKeySearch }: any) => {

    const [inputValue, setInputValue] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [cartItem, setCartItem] = useState<any>()
    const [activeCart, setActiveCart] = useState<boolean>(false)

    const handlerInputSearch = (e: any) => {
        setInputValue(e.target.value)
    }


    // Lưu lịch sử tìm kiếm vào localStorage
    const saveSearchHistory = (searchTerm: string) => {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (!history.includes(searchTerm)) {
            history.push(searchTerm);
            if (history.length > 10) {
                history.shift(); // Giới hạn lịch sử tìm kiếm chỉ lưu 10 mục
            }
            localStorage.setItem('searchHistory', JSON.stringify(history));
            setSearchHistory(history);
        }
    };

    // Lấy lịch sử tìm kiếm từ localStorage khi component render
    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(storedHistory);
    }, []);

    // Xóa lịch sử tìm kiếm
    const clearSearchHistory = () => {
        localStorage.removeItem('searchHistory');
        setSearchHistory([]);
    };


    const [products, setProducts] = useState<any>(JSON.parse(localStorage.getItem('suggest') || '[]'));

    return (
        <div className={`${isSearch ? "fixed" : "hidden"} p-[15px] top-0 bg-white min-h-[100%] w-[100%] z-30 lg:p-0 lg:min-h-[584px]`}>
            <div className="max-w-[900px] m-[0_auto] py-[56px] relative">

                <div className="">

                    <form action="" className="relative">
                        <input onChange={handlerInputSearch} value={inputValue} className="h-[48px] border-b-[3px] border-b-black px-[15px] w-[100%] outline-none text-[20px] text-black font-[500] leading-8" placeholder="#Giày MLB Chunky Liner" type="text" name="" id="" />
                        <Link to={`/search?keyword=${inputValue}`} onClick={() => { setIsSearch(!isSearch); setInputValue(''); saveSearchHistory(inputValue); setKeySearch(inputValue) }} className="bg-transparent absolute bottom-[10px] right-[15px] w-[32px] h-[32px] flex items-center justify-center">
                            <div className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" data-src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" alt="Icon search" width={24} height={24} />
                            </div>
                        </Link>
                    </form>

                    <div className="">
                        <div className="mt-[40px]">
                            <div className="mb-[12px] flex items-center">
                                <h4 className="font-[700] text-[16px] leading-6">Lịch sử tìm kiếm</h4>
                                <span onClick={clearSearchHistory} className="ml-[8px] text-[#787878] font-[500] leading-5 underline cursor-pointer text-[12px]">Xóa hết</span>
                            </div>
                            <ul className="flex items-center flex-wrap *:rounded-[18px]">

                                {searchHistory.map((item, index) => (
                                    <li key={index} className="border-[1px] border-[#E8E8E8] p-[7px_12px] m-[0_5px_5px_0] cursor-pointer hover:text-white hover:bg-black leading-5 flex"><Link to={`/search?keyword=${item}`} onClick={() => { setIsSearch(!isSearch); }} className="text-[14px] font-[500] outline-none">{item}</Link></li>
                                ))}

                            </ul>
                        </div>

                        <div className="hidden lg:flex mt-[40px]">

                            <div className="w-[30%]">
                                <div className="text-[16px] font-[700] flex mb-[16px]">Cụm từ tìm kiếm phổ biến</div>
                                <div className="">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img width={40} height={40} src="https://file.hstatic.net/200000642007/file/quan_jogger_mlb_de554aa3f7204b22a80d7796dc044761.png" alt="" />
                                            <div className="*:text-[14px] ml-[12px] flex">
                                                <span className="font-[700]">1</span>
                                                <span className="ml-[12px] font-[500]">Quần Jogger</span>
                                            </div>
                                        </div>
                                        <div className="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="2" viewBox="0 0 6 2" fill="none"> <path d="M5.24219 1.66406V0.331055H0.757812V1.66406H5.24219Z" fill="#787878"></path> </svg>
                                        </div>
                                    </div>
                                    <div className="mt-[12px] flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img width={40} height={40} src="https://file.hstatic.net/200000642007/file/quan_jogger_mlb_de554aa3f7204b22a80d7796dc044761.png" alt="" />
                                            <div className="*:text-[14px] ml-[12px] flex">
                                                <span className="font-[700]">1</span>
                                                <span className="ml-[12px] font-[500]">Quần Jogger</span>
                                            </div>
                                        </div>
                                        <div className="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="2" viewBox="0 0 6 2" fill="none"> <path d="M5.24219 1.66406V0.331055H0.757812V1.66406H5.24219Z" fill="#787878"></path> </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-[70%] pl-[50px]">
                                <div className="flex font-[700] text-[16px] mb-[16px]">Sản phẩm gợi ý</div>

                                <div className="grid grid-cols-8 gap-2">
                                    {products.map((item: any) => (
                                        <div className="mb-[30px] col-span-2 relative">
                                            <div onClick={() => {setCartItem(item), setActiveCart(true)}} className="absolute top-[16px] right-[16px]">
                                                <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                    <div className="w-[24px] h-[24px]">
                                                        <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`#`} className="">
                                                <picture>
                                                    <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(${item.variations[0].variation_album_images[0]})` }}></div>
                                                </picture>
                                            </Link>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </div>
                    </div>

                </div>

                <AddProductCart cartItem={cartItem} activeCart={activeCart} setActiveCart={setActiveCart} />

            </div>
            <div onClick={() => setIsSearch(!isSearch)} className="top-[15px] right-[15px] w-[40px] h-[40px] absolute border-[1px] border-[#E8E8E8] flex items-center justify-center rounded-[100%] cursor-pointer lg:top-[48px] lg:right-[48px] lg:w-[56px] lg:h-[56px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"> <path d="M14.6006 1.40002L1.81646 14.6007" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M1.40039 1.53528L14.4637 14.4654" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </svg>
            </div>
        </div>
    )
}

export default Search
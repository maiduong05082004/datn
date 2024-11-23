import Support from "@/pages/(website)/_components/Support";
import EventsAudio from "@/pages/(website)/events/eventsAudio";
import EventsCanvas from "@/pages/(website)/events/eventsCanvas";
import LoadingPage from "@/pages/(website)/loading/loadPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
type Props = {
    isSearch: boolean
    setIsSearch: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ isSearch, setIsSearch }: Props) => {

    const [openCategories, setOpenCategories] = useState<boolean>(false);

    const { data: categorires } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/categories`)
        }
    })

    const token = localStorage.getItem("token")

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', token],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/auth/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
        }
    })

    const { data: carts, isLoading: isLoadingCarts } = useQuery({
        queryKey: ['carts', token],
        queryFn: () => {
            return axios.get(`http://127.0.0.1:8000/api/client/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Truyền token vào header
                }
            })
        },
        enabled: !!token,
    })

    if (isLoadingCarts) { <LoadingPage /> }

    return (
        <>
            <div className="bg-black h-[42px] text-center flex">
                <span className='text-white justify-center flex m-auto text-[11px] font-[600] lg:text-[14px]'>Ưu đãi 5% cho dơnd hàng đầu tiên* | Nhập mã: MLBWELCOM</span>
            </div>
            <header className='py-[8px] h-[57px] sticky top-0 bg-white lg:h-[64px] mt-[0.1px] border-b-[1px] border-b-[##e8e8e8] lg:border-none z-20'>
                <div className="flex text-center justify-center h-[100%] px-[15px] pc:px-[48px]">
                    <div className="flex">
                        <div onClick={() => setOpenCategories(!openCategories)} className="flex items-center lg:hidden">
                            <div className='w-[40px] h-[40px] flex justify-center items-center'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="4" width="12" height="1" rx="0.5" fill="#000"></rect> <rect x="6" y="11" width="12" height="1" rx="0.5" fill="#000"></rect> <rect x="2" y="18" width="12" height="1" rx="0.5" fill="#000"></rect> </svg>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link to={`/`} className='lg:hidden w-[100px] flex justify-center items-center text-center'>
                                <img src="https://res.cloudinary.com/dg4yxsmhs/image/upload/v1730021939/yukhkav8xga7cwvn3jcd.png" alt="" />
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="69.53" height="24" viewBox="0 0 84 24" fill="none"> <path fillRule="evenodd" clip-rule="evenodd" d="M27.6027 0L17.7745 10.585L14.1671 0H6.94734V0.005L5.41862 0L6.33686 2.365L1.14528 19.9L0 24H7.24501L10.6203 12.505L13.1177 18.435H17.8199L23.8036 12.505L20.4283 24H27.7742L34.8224 0H27.6027ZM75.8708 7.25C75.5933 8.195 74.67 9.205 72.6519 9.205H68.0758L69.2261 5.295H73.8022C75.8153 5.295 76.1483 6.305 75.8708 7.25ZM73.5499 16.585C73.2573 17.595 72.2583 18.71 70.2402 18.71H65.2908L66.5269 14.495H71.4814C73.4944 14.495 73.8526 15.575 73.555 16.585H73.5499ZM83.1208 7.04C84.3317 2.895 82.031 0 75.8203 0H61.86L62.7884 2.2L57.1831 21.68L54.7714 24H69.4078C74.7356 24 79.5336 23.5 80.8807 18.915C81.8696 15.545 80.8858 12.69 79.8464 12.08C80.916 11.575 82.3186 9.77 83.1208 7.04ZM41.1896 18.74H51.3709H51.376C51.418 18.7175 51.4112 18.7212 51.3897 18.733C51.2824 18.7916 50.8087 19.0503 54.2568 17.225L52.1984 23.995H30.6853L32.9961 21.69L38.7527 2.32L37.7891 0H46.694L41.1896 18.74Z" fill="black"></path> </svg> */}
                            </Link>
                            <Link to={`/`} className='hidden lg:flex w-[140px] justify-center items-center text-center'>
                                <img src="https://res.cloudinary.com/dg4yxsmhs/image/upload/v1730021939/yukhkav8xga7cwvn3jcd.png" alt="" />
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="84" height="24" viewBox="0 0 84 24" fill="none"> <path fillRule="evenodd" clip-rule="evenodd" d="M27.6027 0L17.7745 10.585L14.1671 0H6.94734V0.005L5.41862 0L6.33686 2.365L1.14528 19.9L0 24H7.24501L10.6203 12.505L13.1177 18.435H17.8199L23.8036 12.505L20.4283 24H27.7742L34.8224 0H27.6027ZM75.8708 7.25C75.5933 8.195 74.67 9.205 72.6519 9.205H68.0758L69.2261 5.295H73.8022C75.8153 5.295 76.1483 6.305 75.8708 7.25ZM73.5499 16.585C73.2573 17.595 72.2583 18.71 70.2402 18.71H65.2908L66.5269 14.495H71.4814C73.4944 14.495 73.8526 15.575 73.555 16.585H73.5499ZM83.1208 7.04C84.3317 2.895 82.031 0 75.8203 0H61.86L62.7884 2.2L57.1831 21.68L54.7714 24H69.4078C74.7356 24 79.5336 23.5 80.8807 18.915C81.8696 15.545 80.8858 12.69 79.8464 12.08C80.916 11.575 82.3186 9.77 83.1208 7.04ZM41.1896 18.74H51.3709H51.376C51.418 18.7175 51.4112 18.7212 51.3897 18.733C51.2824 18.7916 50.8087 19.0503 54.2568 17.225L52.1984 23.995H30.6853L32.9961 21.69L38.7527 2.32L37.7891 0H46.694L41.1896 18.74Z" fill="black"></path> </svg> */}
                            </Link>
                        </div>
                    </div>

                    <div className={`${openCategories ? "" : "hidden lg:block"} fixed top-0 left-0 bg-white w-[100%] h-[100%] z-20 lg:static lg:items-center lg:ml-[30px]`}>
                        <div onClick={() => setOpenCategories(!openCategories)} className="lg:hidden p-[19px_20px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none"><path d="M3 10L18.1667 10" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path><path d="M10 1.83325L1.83334 9.99992L10 18.1666" stroke="black" strokeWidth="1.2" strokeLinecap="square"></path></svg>
                        </div>
                        <nav className="overflow-y-auto h-full lg:h-auto lg:overflow-hidden">
                            <ul className="px-[20px] lg:flex text-[14px] font-[500] lg:text-[17px] lg:font-[700]">
                                {categorires?.data.slice(0, 6).map((item: any, index: any) => (
                                    <li key={index + 1} className="group mb-[10px] lg:m-0">
                                        <h4 className="flex justify-between items-center w-[100%] py-[10px] lg:py-0">
                                            <Link onClick={() => setOpenCategories(false)} to={`categories/${item.id}`} className="w-full flex h-full lg:h-auto hover:text-[#BB9244] lg:hover:border-b-[1px] lg:hover:border-b-black lg:py-[15px] lg:px-[18px]">{item.name}</Link>
                                            <span className="lg:hidden">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </span>
                                        </h4>


                                        {item.name === "GIẢM GIÁ" ? "" : (
                                            <div className={` lg:group-hover:block lg:hidden lg:absolute lg:py-[30px] lg:w-[100%] lg:top-[100%] lg:bg-white lg:left-0 lg:z-10`}>
                                                <div className="lg:flex lg:justify-center lg:max-w-[1200px] lg:m-[0_auto]">
                                                    <ul className={` p-[15px_0px_15px_15px] ml-[15px] mt-[15px] lg:p-0 lg:m-0 lg:flex lg:min-w-[700px] lg:*:text-[14px]`}>
                                                        {item.children_recursive.map((value: any, index: any) => (
                                                            <li key={index + 1} className={`${index == 0 ? "" : "pl-[40px]"} lg:block lg:text-left`}>
                                                                <h4 className="flex justify-between items-center w-[100%] py-[10px] lg:py-0">
                                                                    <Link onClick={() => setOpenCategories(false)} to={`categories/${value.id}`} className="w-full flex lg:mb-[12px]">
                                                                        {value.name}
                                                                    </Link>
                                                                    <span className="lg:hidden">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                        </svg>
                                                                    </span>
                                                                </h4>
                                                                <ul className={` p-[15px_0px_15px_15px] ml-[15px] mt-[15px] lg:p-0 lg:m-0 lg:block lg:*:font-[500] lg:*:text-[#787878]`}>

                                                                    {value.children_recursive.map((values: any, index: any) => (
                                                                        <li key={index + 1} className="flex py-[10px] lg:p-0 lg:mt-[4px]">
                                                                            <Link onClick={() => setOpenCategories(false)} to={`categories/${values.id}`} className="w-full flex">
                                                                                {values.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </li>
                                                        ))}

                                                    </ul>
                                                    <div className="banner-submenu hidden lg:block pl-[45px] ml-[45px] mx-w-[355px] border-l-[1px] border-l-[#eeeeee]">
                                                        <img className="" src={item.image} alt="QUẦN ÁO|APPAREL" width="309" height="309" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="hidden fixed p-[15px] top-0 bg-white min-h-[100%] w-[100%] z-30 lg:p-0 lg:min-h-[584px]">
                        <div className="max-w-[900px] m-[0_auto] py-[56px] relative">

                            <div className="">

                                <form action="" className="relative">
                                    <input className="h-[48px] border-b-[3px] border-b-black px-[15px] w-[100%] outline-none text-[20px] text-black font-[500] leading-8" placeholder="#Giày MLB Chunky Liner" type="text" name="" id="" />
                                    <button className="bg-transparent absolute bottom-[10px] right-[15px] w-[32px] h-[32px] flex items-center justify-center">
                                        <a href="" className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                                            <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" data-src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" alt="Icon search" width={24} height={24} />
                                        </a>
                                    </button>
                                </form>

                                <div className="">
                                    <div className="mt-[40px]">
                                        <div className="mb-[12px] flex items-center">
                                            <h4 className="font-[700] text-[16px] leading-6">Lịch sử tìm kiếm</h4>
                                            <span className="ml-[8px] text-[#787878] font-[500] leading-5 underline cursor-pointer text-[12px]">Xóa hết</span>
                                        </div>
                                        <ul className="flex items-center flex-wrap *:rounded-[18px]">
                                            <li className="border-[1px] border-[#E8E8E8] p-[7px_12px] m-[0_5px_5px_0] cursor-pointer hover:text-white hover:bg-black leading-5 flex"><a className="text-[14px] font-[500] outline-none" href="">Áo</a></li>
                                            <li className="border-[1px] border-[#E8E8E8] p-[7px_12px] m-[0_5px_5px_0] cursor-pointer hover:text-white hover:bg-black leading-5 flex"><a className="text-[14px] font-[500] outline-none" href="">Có cái quần què</a></li>
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
                                                <div className="mb-[30px] col-span-2 relative">
                                                    <div className="absolute top-[16px] right-[16px]">
                                                        <div className="bg-black flex justify-center w-[40px] h-[40px] rounded-[100%] items-center opacity-10">
                                                            <div className="w-[24px] h-[24px]">
                                                                <img src="https:file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link to={`#`} className="">
                                                        <picture>
                                                            <div className="pt-[124%] bg-cover bg-center bg-no-repeat cursor-pointer" style={{ backgroundImage: `url(https://product.hstatic.net/200000642007/product/50mgl_3amtv0841_1_cba086570a904bba927cc1aff81aeaf9_ff0ea9f3163c4b859a158bd043566317_grande.jpg)` }}></div>
                                                        </picture>
                                                    </Link>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className=""></div>

                        </div>
                        <div className="top-[15px] right-[15px] w-[40px] h-[40px] absolute border-[1px] border-[#E8E8E8] flex items-center justify-center rounded-[100%] cursor-pointer lg:top-[48px] lg:right-[48px] lg:w-[56px] lg:h-[56px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"> <path d="M14.6006 1.40002L1.81646 14.6007" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M1.40039 1.53528L14.4637 14.4654" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </svg>
                        </div>
                    </div>


                    <div className="ml-auto grid grid-cols-3 grid-rows-1 lg:grid-cols-4">
                        <div onClick={() => setIsSearch(!isSearch)} className="flex items-center">
                            <div className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" data-src="https://file.hstatic.net/200000642007/file/icon-search_f3577f42c6314038a0636c20100bd8d9.svg" alt="Icon search" width={24} height={24} />
                            </div>
                        </div>
                        <Link to={`${user ? "/carts" : "/signin"}`} className="relative flex items-center col-start-3 lg:col-start-2">
                            <div
                                className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-cart_d075fce117f74a07ae7f149d8943fc33.svg" data-src="https://file.hstatic.net/200000642007/file/icon-cart_d075fce117f74a07ae7f149d8943fc33.svg" alt="Icon cart" width={24} height={24} />
                            </div>
                            {carts ? (
                                <div className={`absolute w-[13px] h-[13px] text-[9px] rounded-[100%] top-[10px] right-[5px] bg-black text-white flex items-center justify-center`}>{carts?.data.total_quantity || 0}</div>
                            ) : ""}
                        </Link>
                        <Link to={`${user ? "/account/wishlist" : "/signin"}`} className="items-center hidden lg:flex col-start-2 row-start-1 lg:col-start-3">
                            <div className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                                <img className=" ls-is-cached lazyloaded" src="	https://file.hstatic.net/200000642007/file/icon-wishlist_86d7262a56ae455fa531e6867655996d.svg" data-src="	https://file.hstatic.net/200000642007/file/icon-wishlist_86d7262a56ae455fa531e6867655996d.svg" alt="Icon cart" width={24} height={24} />
                            </div>
                        </Link>
                        <Link to={`${user ? "/account" : "/signin"}`} className="flex items-center col-start-2 row-start-1 lg:col-start-4">
                            <div className='w-[40px] h-[40px] flex justify-center items-center text-center'>
                                <img className=" ls-is-cached lazyloaded" src="https://file.hstatic.net/200000642007/file/icon-account_5d386c88832c4872b857c0da62a81bbc.svg" data-src="https://file.hstatic.net/200000642007/file/icon-account_5d386c88832c4872b857c0da62a81bbc.svg" alt="Icon account" width={24} height={24} />
                            </div>
                        </Link>
                    </div>
                </div>
                {user ? (<Support />) : ""}
                <EventsAudio />
                <EventsCanvas />
            </header>
        </>
    )
}

export default Header
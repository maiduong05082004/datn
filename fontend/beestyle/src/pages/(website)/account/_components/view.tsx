import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

type Props = {}

const ViewAccount = (props: Props) => {

    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const token = localStorage.getItem('accessToken');

    // Lấy tất cả sản phẩm theo id người dùng
    const { data: order } = useQuery({
        queryKey: ['order'],
        queryFn: () => {
            return axios.get(`http://localhost:8080/api/orders-userId`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Truyền token vào header
                },
            })
        }
    })
    return (
        <div className="flex flex-col">
            <div className="">
                <div className="flex items-center lg:hidden">
                    <div className="mr-[16px] rounded-[100%] w-[72px] h-[72px] overflow-hidden">
                        <img width={72} height={72} src="https://picsum.photos/80" alt="" />
                    </div>
                    <span className='text-[25px] font-[700]'>Lê Hoàng Anh</span>
                </div>
                <div className="bg-purple-500 w-full p-[14px] my-[24px] rounded-[5px] lg:p-[22px_24px] lg:rounded-none lg:my-0">
                    <div className="flex justify-center items-center lg:hidden">
                        <svg className='mr-[10px]' xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"> <path d="M21.5 9.42857L21.5 6L17.5 6" stroke="white" stroke-width="1.2" stroke-linecap="square"></path> <path d="M7.5 6H3.5V9.42857" stroke="white" stroke-width="1.2" stroke-linecap="square"></path> <path d="M7.5 18H3.5V14.5714" stroke="white" stroke-width="1.2" stroke-linecap="square"></path> <path d="M21.5 14.5714L21.5 18L17.5 18" stroke="white" stroke-width="1.2" stroke-linecap="square"></path> <line x1="6" y1="14.5" x2="6" y2="9.5" stroke="white" stroke-linecap="square"></line> <line x1="11" y1="14.5" x2="11" y2="9.5" stroke="white" stroke-linecap="square"></line> <line x1="16" y1="14.5" x2="16" y2="9.5" stroke="white" stroke-linecap="square"></line> <line x1="8.7" y1="14.2" x2="8.7" y2="9.8" stroke="white" stroke-width="1.6" stroke-linecap="square"></line> <line x1="13.7" y1="14.2" x2="13.7" y2="9.8" stroke="white" stroke-width="1.6" stroke-linecap="square"></line> <line x1="18.7" y1="14.2" x2="18.7" y2="9.8" stroke="white" stroke-width="1.6" stroke-linecap="square"></line> </svg>
                        <span className='text-white text-[14px] font-[600]'>Mã vạch thành viên</span>
                    </div>
                    <div className="hidden lg:flex items-center">
                        <div className="mr-[16px] rounded-[100%] w-[72px] h-[72px] overflow-hidden">
                            <img width={72} height={72} src="https://picsum.photos/80" alt="" />
                        </div>
                        <span className='text-[25px] font-[700] lg:text-white'>Lê Hoàng Anh</span>
                    </div>
                </div>
            </div>


            <div className="border-t-[#F8F8F8] border-t-[8px] mt-[24px] lg:border-t-black lg:border-t-[3px]">

                {order?.data.map((item: any) => {
                    const createdAt = item.createdAt;
                    const date = new Date(createdAt);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

                    return (
                        <div key={item._id} className="">
                            <div className="flex items-center p-[16px_20px] border-b-[#dadada] border-b-[1px]">
                                <div className="mr-[12px] font-[700]">{item.orderNumber}</div>
                                <div className="text-[#787878] text-ite[14px] font-[500]">{formattedDate}</div>
                            </div>

                            <div className="-mx-[15px] p-[24px_20px] lg:mx-0">
                                {item.items.map((value: any, index: any) => (
                                    <div key={index + 1} className={`${index === 0 ? "mt-0" : "mt-[24px]"} `}>
                                        <div className='w-[100%] flex'>
                                            <div className='w-[120px]'>
                                                <div
                                                    className="pt-[123%] bg-cover bg-center bg-no-repeat"
                                                    style={{
                                                        backgroundImage: `url(${value.image})`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="w-[calc(100%-120px)] pl-[16px] flex flex-col">
                                                <h3 className='text-[15px] mb-[4px] font-[500]'>
                                                    MLB - Áo sweatshirt unisex cổ bẻ tay dài thời trang
                                                </h3>
                                                <span className='text-[14px] font-[500]'>50CRS / {value.size} / {value.slug}</span>
                                                <span className='text-[14px] font-[500]'>Số lượng: {value.quantity}</span>
                                                <span className='mt-[14px] font-[700]'>{value.price} VND</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                <hr />

                <div className="pt-[24px] lg:flex justify-between lg:pt-[48px]">
                    <div className="py-[24px] flex justify-center border-[1px] border-[#E8E8E8] lg:w-[33.333%]">
                        <Link to={`/account/wishlist`} className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none"> <rect x="0.5" width="64" height="64" rx="32" fill="#F8F8F8"></rect> <g clip-path="url(#icon-account-1)"> <path d="M31.9388 44.7709C32.2501 45.0774 32.7499 45.0774 33.0612 44.7709L43.8308 34.1688C47.1231 30.9277 47.1231 25.6675 43.8308 22.4265C40.7266 19.3705 35.8046 19.2021 32.5 21.921C29.1954 19.2021 24.2734 19.3705 21.1692 22.4265C17.8769 25.6675 17.8769 30.9277 21.1692 34.1688L31.9388 44.7709Z" fill="white" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M30.7578 42.484L41.3885 31.9459C43.9186 29.4379 44.4307 25.687 42.9249 22.6758C43.0426 22.7783 43.1579 22.8849 43.2705 22.9958C46.2444 25.9235 46.2444 30.6702 43.2705 33.5979L32.501 44.2L30.7578 42.484Z" fill="#E8E8E8"></path> <path d="M23.9581 30.8165C22.6364 29.5153 22.6364 27.4057 23.9581 26.1045C24.5664 25.5057 25.3485 25.1824 26.1446 25.1348M26.4335 33.2175L25.8146 32.6172" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="icon-account-1"> <rect width="52" height="52" fill="white" transform="translate(6.5 6)"></rect> </clipPath> </defs> </svg>
                            <span>Wishlist</span>
                        </Link>
                    </div>
                    <div className="py-[24px] flex justify-center border-[1px] border-[#E8E8E8] lg:w-[33.333%]">
                        <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none"> <rect x="0.5" width="64" height="64" rx="32" fill="#F8F8F8"></rect> <g clip-path="url(#icon-account-2)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M36.5058 33.1065H28.4942V27.2031L16.6875 37.165L28.4942 47.1269V41.2236H45.4855V33.1065H40.8798L36.5058 36.797V33.1065Z" fill="#E8E8E8"></path> <path d="M36.5058 33.1065H37.2058C37.2058 32.7199 36.8924 32.4065 36.5058 32.4065V33.1065ZM28.4942 33.1065H27.7942C27.7942 33.4931 28.1076 33.8065 28.4942 33.8065V33.1065ZM28.4942 27.2031H29.1942C29.1942 26.9307 29.0362 26.6831 28.7891 26.5683C28.5421 26.4535 28.2509 26.4925 28.0428 26.6681L28.4942 27.2031ZM16.6875 37.165L16.2361 36.63C16.0785 36.763 15.9875 36.9588 15.9875 37.165C15.9875 37.3712 16.0785 37.567 16.2361 37.7L16.6875 37.165ZM28.4942 47.1269L28.0428 47.6619C28.2509 47.8375 28.5421 47.8765 28.7891 47.7617C29.0362 47.6469 29.1942 47.3993 29.1942 47.1269H28.4942ZM28.4942 41.2236V40.5236C28.1076 40.5236 27.7942 40.837 27.7942 41.2236H28.4942ZM45.4855 41.2236V41.9236C45.8721 41.9236 46.1855 41.6102 46.1855 41.2236H45.4855ZM45.4855 33.1065H46.1855C46.1855 32.7199 45.8721 32.4065 45.4855 32.4065V33.1065ZM40.8798 33.1065V32.4065C40.7145 32.4065 40.5546 32.4649 40.4283 32.5715L40.8798 33.1065ZM36.5058 36.797H35.8058C35.8058 37.0694 35.9638 37.317 36.2109 37.4318C36.4579 37.5466 36.7491 37.5076 36.9572 37.332L36.5058 36.797ZM36.5058 32.4065H28.4942V33.8065H36.5058V32.4065ZM29.1942 33.1065V27.2031H27.7942V33.1065H29.1942ZM28.0428 26.6681L16.2361 36.63L17.1389 37.7L28.9456 27.7381L28.0428 26.6681ZM16.2361 37.7L28.0428 47.6619L28.9456 46.5919L17.1389 36.63L16.2361 37.7ZM29.1942 47.1269V41.2236H27.7942V47.1269H29.1942ZM28.4942 41.9236H45.4855V40.5236H28.4942V41.9236ZM46.1855 41.2236V33.1065H44.7855V41.2236H46.1855ZM45.4855 32.4065H40.8798V33.8065H45.4855V32.4065ZM40.4283 32.5715L36.0544 36.262L36.9572 37.332L41.3312 33.6415L40.4283 32.5715ZM37.2058 36.797V33.1065H35.8058V36.797H37.2058Z" fill="black"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M28.4942 30.8935V27.203L24.1202 30.8935H19.5145V22.7764H36.5058V16.8731L48.3125 26.835L36.5058 36.7969V30.8935H28.4942Z" fill="white"></path> <path d="M28.4942 30.8935H27.7942C27.7942 31.2801 28.1076 31.5935 28.4942 31.5935V30.8935ZM28.4942 27.203H29.1942C29.1942 26.9306 29.0362 26.683 28.7891 26.5682C28.5421 26.4534 28.2509 26.4924 28.0428 26.668L28.4942 27.203ZM24.1202 30.8935V31.5935C24.2855 31.5935 24.4454 31.5351 24.5717 31.4285L24.1202 30.8935ZM19.5145 30.8935H18.8145C18.8145 31.2801 19.1279 31.5935 19.5145 31.5935V30.8935ZM19.5145 22.7764V22.0764C19.1279 22.0764 18.8145 22.3898 18.8145 22.7764H19.5145ZM36.5058 22.7764V23.4764C36.8924 23.4764 37.2058 23.163 37.2058 22.7764H36.5058ZM36.5058 16.8731L36.9572 16.3381C36.7491 16.1625 36.4579 16.1235 36.2109 16.2383C35.9638 16.3531 35.8058 16.6007 35.8058 16.8731H36.5058ZM48.3125 26.835L48.7639 27.37C48.9215 27.237 49.0125 27.0412 49.0125 26.835C49.0125 26.6288 48.9215 26.433 48.7639 26.3L48.3125 26.835ZM36.5058 36.7969H35.8058C35.8058 37.0693 35.9638 37.3169 36.2109 37.4317C36.4579 37.5465 36.7491 37.5075 36.9572 37.3319L36.5058 36.7969ZM36.5058 30.8935H37.2058C37.2058 30.5069 36.8924 30.1935 36.5058 30.1935V30.8935ZM29.1942 30.8935V27.203H27.7942V30.8935H29.1942ZM28.0428 26.668L23.6688 30.3585L24.5717 31.4285L28.9456 27.738L28.0428 26.668ZM19.5145 31.5935H24.1202V30.1935H19.5145V31.5935ZM18.8145 22.7764V30.8935H20.2145V22.7764H18.8145ZM36.5058 22.0764H19.5145V23.4764H36.5058V22.0764ZM35.8058 16.8731V22.7764H37.2058V16.8731H35.8058ZM48.7639 26.3L36.9572 16.3381L36.0544 17.4081L47.8611 27.37L48.7639 26.3ZM36.9572 37.3319L48.7639 27.37L47.8611 26.3L36.0544 36.2619L36.9572 37.3319ZM35.8058 30.8935V36.7969H37.2058V30.8935H35.8058ZM28.4942 31.5935H36.5058V30.1935H28.4942V31.5935Z" fill="black"></path> </g> <defs> <clipPath id="icon-account-2"> <rect width="52" height="52" fill="white" transform="translate(6.5 6)"></rect> </clipPath> </defs> </svg>
                            <span>Hủy/Đổi/Trả</span>
                        </div>
                    </div>
                    <div className="py-[24px] flex justify-center border-[1px] border-[#E8E8E8] lg:w-[33.333%]">
                        <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none"> <rect x="0.5" width="64" height="64" rx="32" fill="#F8F8F8"></rect> <g clip-path="url(#icon-account-3)"> <rect x="18.3" y="25.8" width="28.4" height="21.4" rx="4.2" fill="white" stroke="black" stroke-width="1.6"></rect> <path d="M26.5 25V22.5C26.5 18.9101 29.4101 16 33 16H33.3C36.2257 16 38.6781 18.0265 39.3301 20.7524" stroke="black" stroke-width="1.6" stroke-linecap="round"></path> <circle cx="32.4993" cy="34.3098" r="3.30985" fill="#E8E8E8" stroke="black" stroke-width="1.4" stroke-linecap="square"></circle> <path d="M40.5 46.5V46.5C40.5 43.7386 38.2614 41.5 35.5 41.5H29.5C26.7386 41.5 24.5 43.7386 24.5 46.5V46.5" stroke="black" stroke-width="1.4" stroke-linecap="round"></path> </g> <defs> <clipPath id="icon-account-3"> <rect width="52" height="52" fill="white" transform="translate(6.5 6)"></rect> </clipPath> </defs> </svg>
                            <span>Quản lý tài khoản</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAccount
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    // Load dau trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Hàm xử lý chuyển hướng
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <footer className="mt-10 bg-[#202846] text-[#c4c4c4]">
            <div className="container mx-auto px-4 py-2 text-lg font-semibold">

                <div className="flex justify-between items-center mb-0">
                    <div className="ml-auto flex items-center flex-col">

                        <span className="hover:text-white cursor-pointer text-[16px] ml-auto">EN / VI</span>

                        <div className="flex gap-3 mt-2 ml-auto">
                            <button onClick={() => handleNavigation('/facebook')} className="hover:text-white">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                    alt="Facebook"
                                    className="w-10 h-10"
                                />
                            </button>

                            <button onClick={() => handleNavigation('/instagram')} className="hover:text-white">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                    alt="Instagram"
                                    className="w-10 h-10"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 justify-items-center">

                    {/* Trợ Giúp */}

                    <div>
                        <h3 className="uppercase mb-6 text-white text-[16px]">Trợ Giúp</h3>

                        <ul className="space-y-1">
                            <li><button onClick={() => handleNavigation('/store-locations')} className="hover:text-white text-[14px]">Hệ thống cửa hàng</button></li>
                            <li><button onClick={() => handleNavigation('/contact')} className="hover:text-white text-[14px]">Liên hệ</button></li>
                            <li><button onClick={() => handleNavigation('/loyalty-policy')} className="hover:text-white text-[14px]">Chính sách Loyalty</button></li>
                            <li><button onClick={() => handleNavigation('/privacy-policy')} className="hover:text-white text-[14px]">Chính sách bảo mật</button></li>
                            <li><button onClick={() => handleNavigation('/terms-of-use')} className="hover:text-white text-[14px]">Điều khoản sử dụng</button></li>
                            <li><button onClick={() => handleNavigation('/shipping-policy')} className="hover:text-white text-[14px]">Chính sách vận chuyển, giao hàng</button></li>
                            {/* Thêm vào danh sách các liên kết trong Footer */}
                            <li><button onClick={() => handleNavigation('/payment-policy')} className="hover:text-white text-[14px]">Chính sách thanh toán</button></li>

                            <li><button onClick={() => handleNavigation('/return-policy')} className="hover:text-white text-[14px]">Chính sách đổi trả</button></li>
                            <li><button onClick={() => handleNavigation('/faq')} className="hover:text-white text-[14px]">Câu hỏi thường gặp</button></li>
                        </ul>
                    </div>

                    {/* Thanh Toán */}

                    <div>
                        <h3 className="uppercase mb-6 text-white text-[16px]">Thanh Toán</h3>

                        <ul className="space-y-1">
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-[14px]">Visa / Mastercard / JCB</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-[14px]">ATM / Internet Banking</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-[14px]">Quét mã QR</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-[14px]">Mua trước trả sau</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-[14px]">Ví điện tử</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-[14px]">Thanh toán khi nhận hàng (COD)</button></li>
                        </ul>
                    </div>

                    {/* Giao Hàng */}

                    <div>
                        <h3 className="uppercase mb-2 text-white text-[16px]">Giao Hàng</h3>

                        <ul className="pt-[15px]">
                            <li className="mb-[15px]"><button onClick={() => handleNavigation('/standard-shipping')} className="text-[14px]">Giao hàng tiêu chuẩn</button></li>
                            <li className="mb-[15px]"><button onClick={() => handleNavigation('/maison-now')} className="text-[14px]">Maison NOW</button></li>
                            <img src="https://file.hstatic.net/1000284478/file/icon-bct_c5ff22fa4ca24fd58c49573d2114f8b0.svg" />
                        </ul>

                    </div>
                </div>

                {/* Footer Note */}

                <div className="text-center text-xs mt-10 text-[#a0a0a0]">
                    Bản quyền thuộc về BeeStyle được phân phối độc quyền tại Việt Nam bởi CÔNG TY CỔ PHẦN MAISON RETAIL MANAGEMENT INTERNATIONAL <br />
                    Địa chỉ: 85 Tu Hoàng, Nam Từ Liêm, Hà Nội. <br />
                    Hotline: 0865643858 | Email: beestyle@gmail.com
                </div>
            </div>
        </footer>
    );
};

export default Footer;

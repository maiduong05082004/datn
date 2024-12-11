import { useNavigate } from 'react-router-dom';

type Props = {
    closes: boolean;
    onClick: () => void;
}

const Footer = () => {
    const navigate = useNavigate();

    // Hàm xử lý chuyển hướng
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <footer className="mt-10 bg-[#202846] text-[#c4c4c4]">
            <div className="container mx-auto px-4 py-2 text-lg font-semibold">

                <div className="flex justify-between items-center mb-0">
                    <div className="ml-auto flex items-center flex-col">

                        <span className="hover:text-white cursor-pointer text-2xl ml-auto">EN / VI</span>

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
                        <h3 className="uppercase mb-6 text-white text-2xl">Trợ Giúp</h3>

                        <ul className="space-y-4">
                            <li><button onClick={() => handleNavigation('/store-locations')} className="hover:text-white text-xl">Hệ thống cửa hàng</button></li>
                            <li><button onClick={() => handleNavigation('/contact')} className="hover:text-white text-xl">Liên hệ</button></li>
                            <li><button onClick={() => handleNavigation('/loyalty-policy')} className="hover:text-white text-xl">Chính sách Loyalty</button></li>
                            <li><button onClick={() => handleNavigation('/privacy-policy')} className="hover:text-white text-xl">Chính sách bảo mật</button></li>
                            <li><button onClick={() => handleNavigation('/terms-of-use')} className="hover:text-white text-xl">Điều khoản sử dụng</button></li>
                            <li><button onClick={() => handleNavigation('/shipping-policy')} className="hover:text-white text-xl">Chính sách vận chuyển, giao hàng</button></li>
                            {/* Thêm vào danh sách các liên kết trong Footer */}
                            <li><button onClick={() => handleNavigation('/payment-policy')} className="hover:text-white text-xl">Chính sách thanh toán</button></li>

                            <li><button onClick={() => handleNavigation('/return-policy')} className="hover:text-white text-xl">Chính sách đổi trả</button></li>
                            <li><button onClick={() => handleNavigation('/faq')} className="hover:text-white text-xl">Câu hỏi thường gặp</button></li>
                        </ul>
                    </div>

                    {/* Thanh Toán */}

                    <div>
                        <h3 className="uppercase mb-6 text-white text-2xl">Thanh Toán</h3>

                        <ul className="space-y-4">
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-xl">Visa / Mastercard / JCB</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-xl">ATM / Internet Banking</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-xl">Quét mã QR</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-xl">Mua trước trả sau</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-xl">Ví điện tử</button></li>
                            <li><button onClick={() => handleNavigation('/payment-methods')} className="hover:text-white text-xl">Thanh toán khi nhận hàng (COD)</button></li>
                        </ul>
                    </div>

                    {/* Giao Hàng */}

                    <div>
                        <h3 className="uppercase mb-2 text-white text-2xl">Giao Hàng</h3>

                        <ul className="pt-[15px]">
                            <li className="mb-[15px]"><button onClick={() => handleNavigation('/standard-shipping')} className="text-xl">Giao hàng tiêu chuẩn</button></li>
                            <li className="mb-[15px]"><button onClick={() => handleNavigation('/maison-now')} className="text-xl">Maison NOW</button></li>
                            <img src="https://file.hstatic.net/1000284478/file/icon-bct_c5ff22fa4ca24fd58c49573d2114f8b0.svg" />
                        </ul>

                    </div>
                </div>

                {/* Footer Note */}

                <div className="text-center text-base mt-10 text-[#a0a0a0]">
                    Bản quyền thuộc về BeeStyle được phân phối độc quyền tại Việt Nam bởi CÔNG TY CỔ PHẦN MAISON RETAIL MANAGEMENT INTERNATIONAL <br />
                    Địa chỉ: Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội. | MST: 0313175103 <br />
                    Hotline: 1900996686 | Email: customercare@maisonrmi.com
                </div>
            </div>
        </footer>
    );
};

export default Footer;

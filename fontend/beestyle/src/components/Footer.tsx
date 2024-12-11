type Props = {
    
    closes: boolean;
    onClick: () => void;
}

const Footer = () => {
    return (
        <footer className="mt-10 bg-[#202846] text-[#c4c4c4]">
            <div className="container mx-auto px-4 py-2 text-sm font-semibold">

                {/* Top Section */}
                <div className="flex justify-between items-center mb-0">
                    <div className="ml-auto flex items-center flex-col">

                        <span className="hover:text-white cursor-pointer text-lg ">EN / VI</span>

                        <div className="flex gap-3 mt-2 ml-auto">

                            <a href="#" className="hover:text-white">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                    alt="Facebook"
                                    className="w-8 h-8"
                                />
                            </a>

                            <a href="#" className="hover:text-white">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                    alt="Instagram"
                                    className="w-8 h-8"
                                />
                            </a>
                        </div>
                    </div>
                </div>


                {/* Main Content */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 justify-items-center">

                    {/* Trợ Giúp */}

                    <div>
                        <h3 className="uppercase mb-6 text-white">Trợ Giúp</h3>

                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white">Hệ thống cửa hàng</a></li>
                            <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách Loyalty</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách vận chuyển, giao hàng</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách thanh toán</a></li>
                            <li><a href="#" className="hover:text-white">Chính sách đổi trả</a></li>
                            <li><a href="#" className="hover:text-white">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>

                    {/* Thanh Toán */}

                    <div>
                        <h3 className="uppercase mb-6 text-white ">Thanh Toán</h3>

                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white">Visa / Mastercard / JCB</a></li>
                            <li><a href="#" className="hover:text-white">ATM / Internet Banking</a></li>
                            <li><a href="#" className="hover:text-white">Quét mã QR</a></li>
                            <li><a href="#" className="hover:text-white">Mua trước trả sau</a></li>
                            <li><a href="#" className="hover:text-white">Ví điện tử</a></li>
                            <li><a href="#" className="hover:text-white">Thanh toán khi nhận hàng (COD)</a></li>
                        </ul>
                    </div>

                    {/* Giao Hàng */}

                    <div>
                        <h3 className="uppercase mb-2 text-white ">Giao Hàng</h3>

                        <ul className="pt-[15px]">
                            <li className="mb-[15px]"><a href="">Giao hàng tiêu chuẩn</a></li>
                            <li className="mb-[15px]"><a href="">Maison NOW</a></li>
                            <img src="https://file.hstatic.net/1000284478/file/icon-bct_c5ff22fa4ca24fd58c49573d2114f8b0.svg" />

                        </ul>

                    </div>
                </div>

                {/* Footer Note */}

                <div className="text-center text-xs mt-10 text-[#a0a0a0]">
                    Bản quyền thuộc về MLB Korea được phân phối độc quyền tại Việt Nam bởi CÔNG TY CỔ PHẦN MAISON RETAIL MANAGEMENT INTERNATIONAL <br />
                    Địa chỉ: 189 - 197, Dương Bá Trạc, Phường 1, Quận 8, TP.Hồ Chí Minh | MST: 0313175103 <br />
                    Hotline: 1900 299268 | Email: customercare@maisonrmi.com
                </div>
            </div>
        </footer>

    );

};


export default Footer;


type Props = {
    closes: boolean;
    onClick: () => void;
}

const Footer = () => {
    
    return (
        <>
            <footer className="mt-[45px]">
                <div className="px-[15px] bg-[#202846] text-[#c4c4c4] font-[700]">
                    <div className="text-[14px] py-[10px]">
                        <div className="">EN/VI</div>
                        <div className=""></div>
                    </div>
                    <div className="py-[10px]">
                        <div className="text-[12px] flex">
                            <div className="w-full text-center py-[10px] -mb-[1px] border-solid border-b-[2px] border-[#c4c4c4]">TRỢ GIÚP</div>
                            <div className="w-full text-center py-[10px] -mb-[1px]">THANH TOÁN</div>
                            <div className="w-full text-center py-[10px] -mb-[1px]">GIAO HÀNG</div>
                        </div>
                        <div className="text-[14px] pt-[20px] px-[10px] pb-[10px]">
                            <ul>
                                <li className="mb-[15px]"><a href="">Hệ thống cửa hàng</a></li>
                                <li className="mb-[15px]"><a href="">Liên hệ</a></li>
                                <li className="mb-[15px]"><a href="">Chính sách Loyalty</a></li>
                                <li className="mb-[15px]"><a href="">Chính sách bảo mật</a></li>
                                <li className="mb-[15px]"><a href="">Điều khoản sử dụng</a></li>
                                <li className="mb-[15px]"><a href="">Chính sách vận chuyển, giao hàng</a></li>
                                <li className="mb-[15px]"><a href="">Chính sách thanh toán</a></li>
                                <li className="mb-[15px]"><a href="">Chính sách đổi trả</a></li>
                                <li className="mb-[15px]"><a href="">Câu hỏi thường gặp</a></li>
                            </ul>
                        </div>
                        <div className="text-[12px] mt-[30px] text-center">
                            Bản quyền thuộc về MLB Korea được phân phối độc quyền tại Việt Nam bởi CÔNG TY CỔ PHẦN MAISON RETAIL MANAGEMENT INTERNATIONAL
                            Địa chỉ: 189 - 197, Dương Bá Trạc, Phường 1, Quận 8, TP.Hồ Chí Minh | MST: 0313175103
                            Hotline: 1900 299268 | Email: customercare@maisonrmi.com
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer

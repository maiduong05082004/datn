import React from "react";

const PaymentPolicyPage = () => {

    return (
        <div className="bg-gray-50">

            {/* Banner Section */}
            <div className="relative w-full h-[300px] mb-12">
                
                <img
                    src="https://bizweb.dktcdn.net/thumb/large/100/446/974/products/giay-mlb-chinh-hang-bigball-chunky-logo-ny-mau-kem-3ashbcv4n-50crs-2.jpg?v=1723951477623"
                    alt="Banner"
                    className="w-full h-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-center">
                    <h1 className="text-white text-3xl font-bold mb-4">Chính sách thanh toán</h1>

                    <a href="/" className="text-white text-xl mb-0">
                        Quay về
                    </a>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 py-12 max-w-7xl">

                {/* Section I */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">I. THANH TOÁN ONLINE QUA THẺ TÍN DỤNG/THẺ GHI NỢ VISA, MASTERCARD, JCB</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Toàn bộ hệ thống thanh toán được bảo mật theo Tiêu Chuẩn Quốc Tế PCI-DSS, khách hàng có thể hoàn toàn yên tâm khi thanh toán bằng hình thức trả trước qua thẻ tín dụng/thẻ ghi nợ tại website.
                    </p>

                    <p className="text-lg text-gray-600 mb-4">
                        Toàn bộ hệ thống bảo mật theo Tiêu Chuẩn Quốc Tế PCI-DSS. Xác nhận mã OTP và thiết lập mật khẩu thanh toán 6 số bảo vệ.
                    </p>

                    <p className="text-lg text-gray-600 mb-4">
                        Giao dịch được ghi nhận là thành công khi khách hàng nhận được thông báo từ hệ thống cổng thanh toán Zalopay trả về trạng thái “Giao dịch thành công” (đảm bảo số dư/hạn mức và xác thực khách hàng theo quy định sử dụng của thẻ).
                    </p>
                </div>

                {/* Section II */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">II. THANH TOÁN ONLINE QUA THẺ ATM NỘI ĐỊA</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Khách hàng thanh toán số tiền mua hàng bằng thẻ ATM nội địa của ngân hàng trong nước phát hành có kết nối với cổng thanh toán dưới đây:
                    </p>

                    {/* Bank Logos */}

                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                        {[
                            { name: "vietcombank", logo: "vietcombank.png" },
                            { name: "dongabank", logo: "dongabank.png" },
                            { name: "techcombank", logo: "techcombank.png" },
                            { name: "agribank", logo: "agribank.png" },
                            { name: "bidv", logo: "bidv.png" },
                            { name: "eximbank", logo: "eximbank.png" },
                            { name: "acb", logo: "acb.png" },
                            { name: "sacombank", logo: "sacombank.png" },
                            { name: "maritimebank", logo: "maritimebank.png" },
                            { name: "tpbank", logo: "tpbank.png" },
                            { name: "shb", logo: "shb.png" },
                            { name: "vib", logo: "vib.png" },
                            { name: "vpbank", logo: "vpbank.png" },
                            { name: "mbbank", logo: "mbbank.png" },
                            { name: "seabank", logo: "seabank.png" },
                            { name: "ncb", logo: "ncb.png" },
                            { name: "hdbank", logo: "hdbank.png" },
                            { name: "bacabank", logo: "bacabank.png" },
                            { name: "gpbank", logo: "gpbank.png" },
                            { name: "pgbank", logo: "pgbank.png" },
                            { name: "ocb", logo: "ocb.png" },
                            { name: "vietinbank", logo: "vietinbank.png" },

                        ].map((bank, index) => (

                            <div
                                key={index}
                                className="flex items-center justify-center border border-gray-300 rounded-lg p-2 shadow-sm hover:shadow-md"
                            >
                                <img
                                    src={`/images/${bank.logo}`}
                                    alt={bank.name}
                                    className="w-full h-12 object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <p className="text-lg text-gray-600 mb-4">
                        Ngoài ra, để thanh toán bằng thẻ ngân hàng nội địa, thẻ của khách hàng phải được đăng ký sử dụng tính năng thanh toán trực tuyến, hoặc ngân hàng điện tử của Ngân hàng.
                    </p>

                    <p className="text-lg text-gray-600 mb-4">
                        Giao dịch được ghi nhận là thành công khi khách hàng nhận được thông báo từ hệ thống  trả về trạng thái “Giao dịch thành công” (đảm bảo số dư/hạn mức và xác thực khách hàng theo quy định sử dụng của thẻ). Ngoài ra, Maison sẽ gửi email xác nhận trạng thái thanh toán thành công đến hộp thư khách hàng đã đăng ký tài khoản trên vn.mlb-korea.com.
                    </p>


                </div>

                {/* Section III */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">III. THANH TOÁN ONLINE QUA ỨNG DỤNG QR CODE </h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Ứng dụng thanh toán di động giúp đáp ứng nhu cầu thanh toán của quý khách hàng mà không cần tiền mặt hay qua ngân hàng.

                        Toàn bộ hệ thống bảo mật theo Tiêu Chuẩn Quốc Tế PCI-DSS. Xác nhận mã OTP và thiết lập mật khẩu thanh toán 6 số bảo vệ.

                        Liên kết được nhiều ngân hàng khác nhau trên 1 tài khoản cổng thanh toán. Không cần điền lại thông tin ngân hàng cho những lần thanh toán sau.
                    </p>
                </div>

                {/* Section IV
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">IV. THANH TOÁN BẰNG PAYPAL</h2>
                    <p className="text-lg text-gray-600 mb-4">
                        Được kết nối TLS và HTTPS, chức năng key pinning trên điện thoại cũng như việc tuân thủ tiêu chuẩn PCI giúp thanh toán an toàn hơn.
                    </p>
                </div> */}

                {/* Section V */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">IV. THANH TOÁN QUA VÍ ĐIỆN TỬ   </h2>
                    <p className="text-lg text-gray-600">
                        Ứng dụng thanh toán di động giúp đáp ứng nhu cầu thanh toán của quý khách hàng mà không cần tiền mặt hay qua ngân hàng. Quý khách hàng chỉ cần nạp tiền vào Ví và thanh toán. Toàn bộ hệ thống bảo mật theo Tiêu Chuẩn Quốc Tế PCI-DSS. Xác nhận mã OTP và thiết lập mật khẩu thanh toán 6 số bảo vệ.
                    </p>
                </div>

                {/* Section VI */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">V. THANH TOÁN KHI NHẬN HÀNG (COD)  </h2>
                    <p className="text-lg text-gray-600">
                        COD – Cash on delivery, nghĩa là thanh toán khi nhận hàng. Khi chọn phương thức thanh toán này, khách hàng sẽ trả tiền mặt cho nhân viên giao hàng ngay khi nhận được đơn hàng và đồng kiểm sản phẩm. Maison chấp nhận hình thức thanh toán khi nhận hàng đối với các đơn hàng có giá trí dưới 5 triệu VND và áp dụng cho tất cả các tỉnh thành Maison có thể giao hàng trong lãnh thổ Việt Nam.

                        EN / VI

                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPolicyPage;

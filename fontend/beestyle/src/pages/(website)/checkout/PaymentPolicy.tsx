import React from "react";

const PaymentPolicyPage = () => {
    return (
        <div className="bg-gray-50">
           
            <div className="relative w-full h-[300px] mb-12">
        <img
            src="https://bizweb.dktcdn.net/thumb/large/100/446/974/products/giay-mlb-chinh-hang-bigball-chunky-logo-ny-mau-kem-3ashbcv4n-50crs-2.jpg?v=1723951477623"
            alt="Banner"
            className="w-full h-full object-cover rounded-lg"
        />
       
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-center">
            <h1 className="text-white text-3xl font-bold mb-4">Chính sách thanh toán</h1>
           
            <a
                href="/" 
                className="text-white text-xl mb-0"
            >
                Quay về  
            </a>
           
        </div>
    </div>



            {/* Content Section */}
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">I. THANH TOÁN ONLINE QUA ỨNG DỤNG QR CODE</h2>
                    
                    <p className="text-lg text-gray-600 mb-4">
                        Ứng dụng thanh toán di động giúp đáp ứng nhu cầu thanh toán của quý khách hàng mà không cần tiền mặt hay qua ngân hàng.
                    </p>
                    <p className="text-lg text-gray-600 mb-4">
                        Toàn bộ hệ thống bảo mật theo Tiêu Chuẩn Quốc Tế PCI-DSS. Xác nhận mã OTP và thiết lập mật khẩu thanh toán 6 số bảo vệ.
                    </p>
                    <p className="text-lg text-gray-600 mb-4">
                        Liên kết được nhiều ngân hàng khác nhau trên 1 tài khoản cổng thanh toán. Không cần điền lại thông tin ngân hàng cho những lần thanh toán sau.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">II. THANH TOÁN QUA VÍ ĐIỆN TỬ</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Ứng dụng thanh toán di động giúp đáp ứng nhu cầu thanh toán của quý khách hàng mà không cần tiền mặt hay qua ngân hàng. Quý khách hàng chỉ cần nạp tiền vào Ví và thanh toán. Toàn bộ hệ thống bảo mật theo Tiêu Chuẩn Quốc Tế PCI-DSS. Xác nhận mã OTP và thiết lập mật khẩu thanh toán 6 số bảo vệ.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">III. THANH TOÁN BẰNG PAYPAL</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Được kết nối TLS và HTTPS, chức năng key pinning trên điện thoại cũng như việc tuân thủ tiêu chuẩn PCI có thể giúp việc thanh toán an toàn hơn.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">IV. THANH TOÁN KHI NHẬN HÀNG (COD)</h2>

                    <p className="text-lg text-gray-600">
                        COD – Cash on delivery, nghĩa là thanh toán khi nhận hàng. Khi chọn phương thức thanh toán này, khách hàng sẽ trả tiền mặt cho nhân viên giao hàng ngay khi nhận được đơn hàng và đồng kiểm sản phẩm.BeeStyle Việt Nam chấp nhận hình thức thanh toán khi nhận hàng đối với các đơn hàng có giá trị dưới 5 triệu VND và áp dụng cho tất cả các tỉnh thành BeeStyle Việt Nam có thể giao hàng trong lãnh thổ Việt Nam.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPolicyPage;

import React from "react";

const ShippingPolicyPage = () => {
    return (
        <div className="bg-gray-50">

            <div className="relative w-full h-[300px] mb-12">
                <img
                    src="https://bizweb.dktcdn.net/thumb/large/100/446/974/products/giay-mlb-chinh-hang-bigball-chunky-logo-ny-mau-kem-3ashbcv4n-50crs-2.jpg?v=1723951477623"
                    alt="Banner"
                    className="w-full h-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-center">
                    <h1 className="text-white text-3xl font-bold mb-4">Chính sách vận chuyển và giao hàng</h1>

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
                    <h2 className="text-2xl font-semibold text-gray-800">I. GIAO HÀNG TIÊU CHUẨN</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        BeeStyle Việt Nam phục vụ giao hàng cho Khách hàng trên toàn quốc,
                        ngoại trừ một số khu vực sau: Xã Hoàng Sa (Huyện Hoàng Sa, Đà Nẵng), Xã Trường Sa, Xã Song Tử Tây, Xã Sinh Tồn
                        (Huyện Trường Sa, Khánh Hòa).
                    </p>

                    <p className="text-lg text-gray-600 mb-4">
                        Thời gian phục vụ giao hàng: BeeStyle Việt Nam phục vụ giao hàng trong giờ hành chính thứ 2 đến thứ 7 (trừ Chủ nhật và ngày Lễ, Tết). Trong trường hợp, quý khách đặt hàng sau 18h, thời gian giao hàng sẽ cộng dồn thêm 1 ngày.
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-4">
                        <li className="mb-4">Nội thành HCM và HN: dự kiến giao từ 2-3 ngày (kể từ lúc Nhân Viên Xác Nhận Đơn Hàng Thành Công).</li>
                        <li className="mb-4">Ngoại tỉnh: dự kiến giao hàng từ 3-5 ngày (kể từ lúc Nhân Viên Xác Nhận Đơn Hàng Thành Công).</li>


                    </ul>

                    <p className="text-lg text-gray-600 mb-4">
                        Đơn hàng sẽ được giao đến địa chỉ của khách hàng, ngoại trừ các trường hợp như: khu vực văn phòng hạn chế ra vào, khu vực chung cư/cao tầng (chỉ phục vụ giao tại chân tòa nhà) hoặc bên trong các khu vực hạn chế đi lại (khu vực quân sự, biên giới,…).
                    </p>

                    <p className="text-lg italic text-gray-600 mb-4">
                        Lưu ý: Những đơn hàng dưới 1.000.000đ sẽ tính thêm phí giao hàng. Phí giao hàng có thể thay đổi tùy vào trọng lượng kiện hàng sau khi đóng gói.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">Chính sách đồng kiểm:</h3>

                    <p className="text-lg text-gray-600 mb-4">
                        Nhằm đáp ứng nhu cầu và bảo vệ tối đa quyền lợi khách hàng khi sử dụng dịch vụ, BeeStyle Việt Nam có chính sách đồng kiểm khi giao hàng, quý khách được quyền yêu cầu đồng kiểm khi nhận hàng và ký xác nhận vào biên bản đồng kiểm (nếu có) theo hướng dẫn sau:
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-4">
                        <li className="mb-4">Kiểm tra tình trạng hộp/gói hàng: hàng được đóng gói cẩn thận, bọc nguyên kiện với băng dính; không có dấu hiệu móp, méo hay rách thủng.</li>
                        <li className="mb-4">Kiểm tra sản phẩm: còn nguyên tem mác, đảm bảo khớp về số lượng, màu sắc, tình trạng, chủng loại, kích cỡ đúng với đơn hàng của quý khách. Việc kiểm tra ngoại quan, không bao gồm việc sử dụng thử sản phẩm.</li>
                        <li className="mb-4">Sau khi kiểm tra, nếu không hài lòng với tình trạng sản phẩm được giao, quý khách có thể từ chối nhận hàng.</li>

                    </ul>
                    <p className="font-bold underline">Đối với sản phẩm trang phục và phụ kiện thời trang:</p>

                    <p className="list-disc pl-8 text-lg text-gray-600">Đối với các trường hợp bất khả kháng không thể đồng kiểm khi nhận hàng: Quý Khách vui lòng thực hiện quay video clip khi mở kiện hàng, việc lưu trữ hình ảnh/video sẽ góp phần giải quyết tốt hơn các vấn đề phát sinh về sau.</p>

                    <p className="text-lg italic text-gray-600 mt-4 mb-4">
                        Lưu ý: Sản phẩm online sẽ được đóng gói niêm phong bằng thùng carton thường sẽ không kèm túi giấy.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">II. GIAO HÀNG NHANH 4H - HỎA TỐC</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Khu vực áp dụng giao hàng nhanh: Chỉ áp dụng tại nội thành Hồ Chí Minh và Hà Nội.
                    </p>

                    <p className="text-lg text-gray-600 mb-4">
                        Thời gian giao hàng:
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-4">
                        <li className="mb-4">Đơn hàng đặt trước 17h: sẽ được giao trong vòng từ 2h-4h.</li>
                        <li className="mb-4">Đơn hàng đặt sau 17h: sẽ được giao trước 12h hôm sau.</li>
                    </ul>

                    <p className="text-lg italic text-gray-600 mb-4">
                        Lưu ý: Trường hợp khách hàng cần gấp trong ngày, hãy liên hệ CSKH qua hotline 094.705.9709 hoặc email cskh.mlbkorea@gmail.com để được hỗ trợ giao trước 20h.
                    </p>

                    <p className="text-lg text-gray-600 mt-4">
                        Đơn hàng giao nhanh không có chính sách đồng kiểm. Tuy nhiên nếu đơn hàng có dấu hiệu rách, thủng, Quý khách có thể từ chối nhận hàng và thông báo lại với bộ phận chăm sóc khách hàng của BeeStyle Việt Nam.
                    </p>

                    <p className="text-lg text-gray-600 mt-4">
                        Quý Khách vui lòng thực hiện quay video clip khi mở kiện hàng, việc lưu trữ hình ảnh/video sẽ góp phần giải quyết tốt hơn các vấn đề phát sinh về sau.
                    </p>

                    <p className="text-lg text-gray-600 mt-4 mb-4">
                        Thời gian tiếp nhận khiếu nại đối với đơn hàng vận chuyển HỎA TỐC là 24h tính từ thời điểm hoàn tất giao hàng hoặc từ chối nhận hàng nếu phát hiện nhân viên giao sản phẩm không đủ điều kiện (hư hỏng, đánh tráo, hay bao bì không còn nguyên vẹn..).
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">III. BẤT KHẢ KHÁNG</h2>

                    <p className="text-lg text-gray-600">
                        Trong các trường hợp có phát sinh dịch bệnh (Covid, SARS, …), thiên tai hoặc trong các trường hợp bất khả kháng tại thời điểm phát sinh theo quy định của cơ quan quản lý nhà nước, việc giao hàng sẽ thay đổi theo tình hình thực tế về quy định chuyển phát hàng hoá của nhà nước, BeeStyle Việt Nam được quyền từ chối giao hàng.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;

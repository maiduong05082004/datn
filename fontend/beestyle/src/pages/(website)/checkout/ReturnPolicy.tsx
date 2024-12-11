import React from "react";

const ReturnPolicyPage = () => {
    return (
        <div className="bg-gray-50">

            <div className="relative w-full h-[300px] mb-12">
                <img
                    src="https://bizweb.dktcdn.net/thumb/large/100/446/974/products/giay-mlb-chinh-hang-bigball-chunky-logo-ny-mau-kem-3ashbcv4n-50crs-2.jpg?v=1723951477623" // Thay đổi hình ảnh banner ở đây
                    alt="Banner"
                    className="w-full h-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-center">
                    
                    <h1 className="text-white text-3xl font-bold mb-4">Chính Sách Đổi Trả</h1>

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
                    <h2 className="text-2xl font-semibold text-gray-800">I. Quy định chung</h2>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-4">
                        <li className="mb-4">Áp dụng cho tất cả khách hàng đang sử dụng dịch vụ mua sắm tại website: https://mlbvietnam.vn/mlb . </li>
                        <li className="mb-4">Phạm vi sản phẩm được đổi: Sản phẩm đúng giá trị và sản phẩm giảm giá không quá 20%.</li>
                        <li className="mb-4">Áp dụng trả hàng với các sản phẩm có nguyên nhân từ lỗi do nhà sản xuất. Ngoài ra, không áp dụng trả hàng với bất kỳ lý do nào.</li>
                        <li className="mb-4">Thời hạn đổi hàng: Trong vòng 07 ngày kể từ ngày Quý khách nhận được sản phẩm.</li>
                        <li className="mb-4">Các mặt hàng không áp dụng đổi/ trả hàng: Vớ, khăn, Trang sức, Túi, Balo, Nón, shoescare, khẩu trang.</li>
                        <li className="mb-4">Mỗi sản phẩm chỉ được đổi/ trả 1 lần. Trong trường hợp Quý khách đã đổi hàng và có phát sinh vấn đề về lỗi sản phẩm từ nhà sản xuất, sai hình ảnh, … nếu khách hàng không còn nhu cầu đổi hàng thì BeeStyle Việt Nam sẽ tiến hành hoàn tiền đến tài khoản của quý khách.</li>
                        <li className="mb-4">Giá trị sản phẩm đổi sẽ bằng giá hoặc cao hơn giá trị thanh toán của sản phẩm đã mua hoặc giá của sản phẩm đó trên website bsvietnam.vn tại thời điểm thực hiện đổi/trả (Tùy thuộc giá trị nào thấp hơn) (Lưu ý: Sẽ không bao gồm chi phí giao hàng), phần chênh lệch sau khi đổi sang sản phẩm có giá trị thấp hơn sẽ không được hoàn lại.</li>

                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-bold  text-gray-800">II. Nội dung chính sách</h2>

                    <p className="italic text-xl mb-4">(Tất cả quy trình thực hiện và xử lý đổi/trả, BeeStyle Việt Nam tương tác chính qua email gửi đến Quý khách)</p>

                    <p className="text-2xl font-semibold text-gray-800">
                        1. Trường hợp đổi/trả hàng
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-6">
                        <li className="mb-4">Phát sinh lỗi từ phía bsvietnam.vn, BeeStyle Việt Nam sẽ chịu chi phí vận chuyển đến khách hàng. </li>
                        <li className="mb-4">Phát sinh từ nhu cầu của Quý khách, Quý khách sẽ chịu chi phí vận chuyển hàng hóa về lại cho bsvietnam.vn.</li>
                        <li className="mb-4">Việc đổi trả hàng hóa sẽ tùy thuộc theo quyết định cuối cùng của Ban Quản Lý và sẽ dựa trên mức giá hiện tại trên https://mlbvietnam.vn/mlb tại thời điểm đó hoặc sản phẩm có giá trị tương đương.</li>

                    </ul>
                    <p className="italic text-xl mb-4">Lưu ý: Các trường hợp phản ánh về phát sinh lỗi từ phía khách hàng, thời gian tiếp
                        nhận là 07 ngày tính từ ngày hoàn tất đơn hàng.
                    </p>

                    <p className="text-2xl font-semibold text-gray-800">
                        2. Điều kiện tiếp nhận hàng hóa đổi/trả
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-4">
                        <li className="mb-4">Sản phẩm chưa qua sử dụng, chưa qua giặt ủi/là, không có mùi lạ. </li>
                        <li className="mb-4">Sản phẩm còn nguyên nhãn mác, hộp/bao bì sản phẩm và quà tặng đi kèm (nếu có). </li>
                        <li className="mb-4">Sản phẩm không bị lỗi do quá trình lưu giữ, vận chuyển của người sử dụng. </li>
                        <li className="mb-4">Khách hàng có xác nhận mua hàng tại https://mlbvietnam.vn/mlb. </li>
                        <li className="mb-4">Sau khi BeeStyle Việt Nam thẩm định hàng hóa được thu hồi từ Quý khách, trong trường hợp sản phẩm không đáp ứng được các điều kiện trả hàng, BeeStyle Việt Nam sẽ từ chối giao dịch đổi/trả hàng này, CSKH sẽ liên hệ Quý khách về việc nhận lại sản phẩm hoặc CSKH sẽ hỗ trợ Quý khách chuyển sản phẩm trả lại theo địa chỉ của Quý khách (với trường hợp này, Quý khách sẽ chịu chi phí vận chuyển). </li>
                        <li className="mb-4">Trong trường hợp Quý khách không chấp nhận việc nhận lại sản phẩm: Sản phẩm sẽ được hoàn về cho BeeStyle Việt Nam và BeeStyle Việt Nam sẽ toàn quyền quyết định về sản phẩm này.</li>


                    </ul>
                    <p className="text-2xl font-semibold text-gray-800">
                        3. Địa điểm nhận đổi/ trả
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600 mb-6">
                        <li className="mb-4">CSKH khi tiếp nhận trường hợp đổi/trả sẽ email trực tiếp đến Quý khách về địa chỉ gửi trả hàng. </li>
                        <li className="mb-4">Để được hỗ trợ nhanh và hướng dẫn cụ thể về địa chỉ đổi/trả hàng, khách hàng vui lòng liên hệ số hotline: 094.705.9709. Nhân viên CSKH sẽ hỗ trợ ngay thông tin.</li>
                        <li className="mb-4">Để được hỗ trợ nhanh và hướng dẫn cụ thể về địa chỉ đổi/trả hàng, khách hàng vui lòng liên hệ số hotline: 094.705.9709. Nhân viên CSKH sẽ hỗ trợ ngay thông tin.</li>

                    </ul>

                    <p className="text-2xl font-semibold text-gray-800">
                        Quy trình thực hiện:
                    </p>

                    <p className=" pl-8 text-lg text-gray-600 mb-6">
                        Bước 1: Liên hệ hotline 094.705.9709 hoặc email cskh.mlbkorea@gmail.com nếu Quý khách phát sinh nhu cầu đổi/trả. <br />
                        Bước 2: CSKH tiếp nhận hướng dẫn và hỗ trợ qua email của Quý khách <br />

                        Bước 3: Chuyển sản phẩm cần đổi/ trả <br />

                        Bước 4: Xem xét tình trạng sản phẩm cần đổi/ trả dựa trên *điều kiện trả hàng <br />

                        Bước 5: Xác nhận việc đổi/ trả
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">III. Chính Sách Hoàn Tiền</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Sau khi hoàn tất thủ tục đổi trả, chúng tôi sẽ hoàn tiền cho khách hàng qua phương thức thanh toán đã sử dụng hoặc chuyển khoản ngân hàng.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">IV. Điều Khoản Ngoại Lệ</h2>

                    <p className="text-lg text-gray-600 mb-4">
                        Các sản phẩm sau không áp dụng chính sách đổi trả:
                    </p>

                    <ul className="list-disc pl-8 text-lg text-gray-600">
                        <li className="mb-4">Sản phẩm giảm giá, khuyến mãi đặc biệt.</li>
                        <li className="mb-4">Sản phẩm bị hư hại do lỗi người dùng.</li>
                        <li className="mb-4">Sản phẩm đã qua sử dụng hoặc đã bị thay đổi về hình dạng ban đầu.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;

import React, { useState } from 'react'

type Props = {}

const InfoProduct = (props: Props) => {
    const [ activeInfo, setActiveInfo ] = useState<string>("active_01")
    return (
        <div className="lg:w-[55%] px-[15px] lg:px-0">
            <div className="*:text-[14px] *:font-[600] *:py-[13px] *:px-[15px] overflow-x-auto whitespace-nowrap scrollbar flex ">
                <div onClick={() => setActiveInfo("active_01")} className={`${activeInfo === "active_01" ? "border-b-[3px] border-[black]" : ""} cursor-pointer`}>THÔNG TIN SẢN PHẨM</div>
                <div onClick={() => setActiveInfo("active_02")} className={`${activeInfo === "active_02" ? "border-b-[3px] border-[black]" : ""} cursor-pointer`}>HƯỚNG DẪN BẢO QUẢN</div>
                <div onClick={() => setActiveInfo("active_03")} className={`${activeInfo === "active_03" ? "border-b-[3px] border-[black]" : ""} cursor-pointer`}>TÌM TẠI CỬA HÀNG</div>
                <div onClick={() => setActiveInfo("active_04")} className={`${activeInfo === "active_04" ? "border-b-[3px] border-[black]" : ""} cursor-pointer`}>CHÍNH SÁCH ĐỔI TRẢ</div>
            </div>

            <div className={`${activeInfo === "active_01" ? "" : "hidden"} lg:pt-[20px]`}>
                <p>Varsity Soccer Jersey thuộc bộ sưu tập Varsity
                    như bản tuyên ngôn cho phong cách thời trang cá
                    tính, thời thượng. Nổi bật với kỹ thuật in độc
                    đáo trên nền chất liệu đặc biệt với những đường
                    kẻ sọc màu tương phản, Varsity Soccer Jersey sẵn
                    sàng thay bạn khẳng định phong cách thời trang của
                    mình.</p>
                <p>
                    Thương hiệu: MLB&nbsp;
                    <br />
                    Xuất xứ: Hàn Quốc&nbsp;
                    <br />
                    Giới tính: Unisex&nbsp;
                    <br />
                    Kiểu dáng: Áo thun
                    <br />
                    Màu sắc: Blue, Red, Silver
                    <br />
                    Chất liệu: 35% Cotton, 65% Polyester
                    <br />
                    Hoạ tiết: Trơn một màu
                    <br />
                    Thiết kế:
                </p>
                <ul>
                    <li>Bo viền cổ áo với các đường kẻ sọc màu tương phản</li>
                    <li>Thiết kế chữ số in lớn nổi bật ở mặt trước</li>
                    <li>Chất vải cao cấp, thoáng mát và co giãn thoải mái</li>
                    <li>Đường may tỉ mỉ, chắc chắn</li>
                    <li>Màu sắc hiện đại, trẻ trung dễ dàng phối với nhiều trang phục và phụ kiện khác</li>
                </ul>
                <p>Logo: Chi tiết logo được in ở mặt sau áo<br />
                    Phom áo: Over fit rộng thoải mái
                    <br />
                    Thích hợp mặc trong các dịp: Đi chơi, đi làm,....
                    <br />
                    Xu hướng theo mùa: Sử dụng được tất cả các mùa trong năm
                </p>
            </div>
            <div className={`${activeInfo === "active_02" ? "" : "hidden"}`}>2</div>
            <div className={`${activeInfo === "active_03" ? "" : "hidden"}`}>3</div>
            <div className={`${activeInfo === "active_04" ? "" : "hidden"}`}>4</div>

        </div>
    )
}

export default InfoProduct
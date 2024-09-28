import React from 'react'
type Props = {}
const ListBills = (props: Props) => {
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Hóa đơn</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Mã đơn hàng</th>
                        <th className="py-3 px-4 text-left">User ID</th>
                        <th className="py-3 px-4 text-left">Email người nhận</th>
                        <th className="py-3 px-4 text-left">Ghi chú</th>
                        <th className="py-3 px-4 text-left">Trạng thái đơn hàng</th>
                        <th className="py-3 px-4 text-left">Hình thức thanh toán</th>
                        <th className="py-3 px-4 text-left">Ngày hủy</th>
                        <th className="py-3 px-4 text-left">Tạm tính (VNĐ)</th>
                        <th className="py-3 px-4 text-left">Tổng cộng (VNĐ)</th>
                        <th className="py-3 px-4 text-left">ID khuyến mãi</th>
                    </tr>
                </thead>
                <tbody>
                    
                    <tr className="border-b border-gray-200">
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">PH1</td>
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">abc@gmail.com</td>
                        <td className="py-3 px-4">sjh</td>
                        <td className="py-3 px-4">ĐTT</td>
                        <td className="py-3 px-4">CK</td>
                        <td className="py-3 px-4">KHONG</td>
                        <td className="py-3 px-4">100.000</td>
                        <td className="py-3 px-4">100.000</td>
                        <td className="py-3 px-4">1</td>
                    </tr>
                  
                </tbody>
            </table>
        </div>

    )
}

export default ListBills
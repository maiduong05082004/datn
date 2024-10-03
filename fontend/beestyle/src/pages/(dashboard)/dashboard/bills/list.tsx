import React from 'react'
type Props = {}
const ListBills = (props: Props) => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
  <h3 className="text-2xl font-bold mb-6 text-center">Danh sách Đơn hàng</h3>
  <div className="bg-gray-100 p-6 rounded-md mb-6">
    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="py-3 px-4 text-left">ID</th>
          <th className="py-3 px-4 text-left">Mã đơn hàng</th>
          <th className="py-3 px-4 text-left">User ID</th>
          <th className="py-3 px-4 text-left">Email Người nhận</th>
          <th className="py-3 px-4 text-left">Ghi chú</th>
          <th className="py-3 px-4 text-left">Trạng thái</th>
          <th className="py-3 px-4 text-left">Hình thức thanh toán</th>
          <th className="py-3 px-4 text-left">Ngày hủy</th>
          <th className="py-3 px-4 text-left">Tạm tính</th>
          <th className="py-3 px-4 text-left">Tổng cộng</th>
          <th className="py-3 px-4 text-left">Mã khuyến mãi</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-200">
          <td className="py-3 px-4">1</td>
          <td className="py-3 px-4">ORD123</td>
          <td className="py-3 px-4">123</td>
          <td className="py-3 px-4">example@example.com</td>
          <td className="py-3 px-4">Note here</td>
          <td className="py-3 px-4">Pending</td>
          <td className="py-3 px-4">Credit Card</td>
          <td className="py-3 px-4">2024-09-28 12:00:00</td>
          <td className="py-3 px-4">1000.00</td>
          <td className="py-3 px-4">1100.00</td>
          <td className="py-3 px-4">PROMO123</td>
        </tr>
        <tr className="border-b border-gray-200">
          <td className="py-3 px-4">2</td>
          <td className="py-3 px-4">ORD124</td>
          <td className="py-3 px-4">124</td>
          <td className="py-3 px-4">receiver@example.com</td>
          <td className="py-3 px-4">Another note</td>
          <td className="py-3 px-4">Completed</td>
          <td className="py-3 px-4">PayPal</td>
          <td className="py-3 px-4">N/A</td>
          <td className="py-3 px-4">500.00</td>
          <td className="py-3 px-4">600.00</td>
          <td className="py-3 px-4">PROMO124</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


    )
}

export default ListBills
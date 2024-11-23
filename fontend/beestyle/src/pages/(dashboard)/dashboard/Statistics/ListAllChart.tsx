import React from 'react'
import ListStatistics from './list'
import ListNewPerson from './ListNewPerson'
import ListCustomer from './ListCustomer'
import ListTopSelling from './listtopselling'

type Props = {}

const ListAllChart = (props: Props) => {
  return (
    <div className="p-5 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-6">Thống kê tổng quát</h2>

      {/* Bố cục chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái */}
        <div className="lg:col-span-8 space-y-6">
          {/* Thống kê nhỏ */}


          {/* Biểu đồ tổng quan */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Doanh số tổng</h3>
            {/* Chèn biểu đồ */}
            <ListStatistics />
          </div>

          {/* Biểu đồ sản phẩm bán chạy */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Sản phẩm bán chạy</h3>
            <ListTopSelling />
          </div>
        </div>

        {/* Cột phải */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thống kê đơn hàng */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Đơn hàng trong 7 ngày qua</h3>
            <ListNewPerson />
          </div>

          {/* Biểu đồ khách hàng */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Hành vi khách hàng</h3>
            <ListCustomer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListAllChart

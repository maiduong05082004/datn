import HorizontalBarChart from './_components/HorizontalBarChart'
import InventoryChart from './_components/InventoryChart'
import NewUserStatistics from './_components/NewUserStatistics'
import OrderPerformance from './_components/OrderPerformance'
import RevenueProfitStatistics from './_components/RevenueProfitStatistics'
import Top12LowRatedProducts from './_components/Top12LowRatedProducts'


type Props = {}

const ListAllChart = (props: Props) => {
  return (
    <div className="p-[20px] bg-white h-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 sticky top-0 h-fit">
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-9 bg-gradient-to-r from-purple-500 to-blue-600 p-[20px] rounded-[15px] w-[100%] h-[500px]">
              <RevenueProfitStatistics />
            </div>
            <div className="col-span-9">
              <div className="grid grid-cols-10 gap-4">
                <div className="col-span-5 bg-[#363b67] p-[20px] rounded-[15px]"><HorizontalBarChart /></div>
                <div className="col-span-5 bg-[#363b67] p-[20px] rounded-[15px]"><Top12LowRatedProducts /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-[#363b67] rounded-[15px] w-[100%] h-[260px] p-[20px]">
              <OrderPerformance />
            </div>
            <div className="col-span-3 bg-[#363b67] rounded-[15px] w-[100%] h-[300px] p-[20px]">
              <InventoryChart />
            </div>
            <div className="col-span-3 bg-[#363b67] rounded-[15px] w-[100%] h-[400px] p-[20px]">
              <NewUserStatistics />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListAllChart

import HorizontalBarChart from './_components/HorizontalBarChart'
import InventoryChart from './_components/InventoryChart'
import NewUserStatistics from './_components/NewUserStatistics'
import OrderPerformance from './_components/OrderPerformance'
import RevenueProfitStatistics from './_components/RevenueProfitStatistics'
import Top12LowRatedProducts from './_components/Top12LowRatedProducts'


type Props = {}

const ListAllChart = (props: Props) => (
  // <div className="p-[20px] bg-slate-100 h-auto">
  //   <div className="grid grid-cols-12 gap-4">
  //     <div className="col-span-8 sticky top-0 h-fit">
  //       <div className="grid grid-cols-9 gap-4">
  //         <div className="col-span-9 bg-gradient-to-r from-purple-500 to-blue-600 p-[20px] rounded-[15px] w-[100%] h-[500px]">
  //           <RevenueProfitStatistics />
  //         </div>
  //         <div className="col-span-9">
  //           <div className="grid grid-cols-10 gap-4">
  //             <div className="col-span-10 bg-slate-500 p-[20px] rounded-[15px]"><HorizontalBarChart /></div>
  //             <div className="col-span-10 bg-slate-500 p-[20px] rounded-[15px]"><Top12LowRatedProducts /></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="col-span-4">
  //       <div className="grid grid-cols-3 gap-4">
  //         <div className="col-span-3 bg-slate-500 rounded-[15px] w-[100%] h-[240px] p-[20px]">
  //           <OrderPerformance />
  //         </div>
  //         <div className="col-span-3 bg-slate-500 rounded-[15px] w-[100%] h-[245px] p-[20px]">
  //           <InventoryChart />
  //         </div>
  //         <div className="col-span-3 bg-slate-500 rounded-[15px] w-[100%] h-[400px] p-[20px]">
  //           <NewUserStatistics />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  <div className="grid gap-4 p-[16px] bg-slate-100 h-auto">
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-9">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-[20px] rounded-[15px] w-[100%] mb-[16px] h-[400px] lg:h-[500px]">
          <RevenueProfitStatistics />
        </div>
        <div className="col-span-9 bg-slate-500 rounded-[15px] w-[100%] h-[300px] lg:h-[400px] p-[20px]">
          <NewUserStatistics />
        </div>
      </div>
      <div className="col-span-3 sticky h-fit top-0">
        <div className="bg-slate-500 rounded-[15px] h-[300px] lg:h-[400px] pb-[16px] px-[16px]">
          <OrderPerformance />
        </div>
        {/* <div className="bg-slate-500 rounded-[15px] h-[242px] pb-[20px]">
          <InventoryChart />
        </div> */}
      </div>
    </div>
    <div className="grid grid-cols-12 gap-4">

      <div className="col-span-12 flex">
        <div className="w-[50%] pr-[8px] ">
          <div className="bg-slate-500 p-[20px] rounded-[15px] h-[400px]"><HorizontalBarChart /></div>
        </div>
        <div className="w-[50%] pl-[8px] ">
          <div className="bg-slate-500 p-[20px] rounded-[15px] h-[400px]"><Top12LowRatedProducts /></div>
        </div>
      </div>

    </div>

  </div>
)

export default ListAllChart

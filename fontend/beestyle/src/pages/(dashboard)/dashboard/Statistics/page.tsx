import { useQuery } from '@tanstack/react-query';
import HorizontalBarChart from './_components/HorizontalBarChart';
import InventoryChart from './_components/InventoryChart';
import NewUserStatistics from './_components/NewUserStatistics';
import OrderPerformance from './_components/OrderPerformance';
import RevenueProfitStatistics from './_components/RevenueProfitStatistics';
import Top12LowRatedProducts from './_components/Top12LowRatedProducts';
import instance from '@/configs/axios';
import { useEffect, useState } from 'react';

const ListAllChart = () => {
  const [year, setYear] = useState<any>(0);
  const [month, setMonth] = useState<string | "">(""); // State cho tháng

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const { data: years } = useQuery({
    queryKey: ['years'],
    queryFn: async () => {
      return instance.post(`api/admins/statistics/revenue-and-profit`, {
        summary: true,
        group_by: "year",
      });
    },
  });

  useEffect(() => {
    if (years?.data?.length) {
      setYear(years.data[years?.data?.length - 1]?.period); // Set initial year
    }
  }, [years]);

  return (
    <div className="grid gap-4 p-[16px] bg-slate-100 h-auto">
      <div className="w-full sticky top-0 flex z-10 p-[20px] bg-white justify-between items-center">
        <h1 className="font-[700] text-[18px]">BIỂU ĐỒ THỐNG KÊ</h1>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="blue"
            className="size-6 mr-[10px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          <select
            onChange={handleMonthChange}
            value={month}
            className="rounded-[50px] p-[10px] border-blue-500 border-[2px] font-[600] w-[170px] cursor-pointer mr-[10px]"
          >
            <option disabled>Chọn tháng</option>
            <option value="">Không chọn tháng</option>
            <option value="1">Tháng 1</option>
            <option value="2">Tháng 2</option>
            <option value="3">Tháng 3</option>
            <option value="4">Tháng 4</option>
            <option value="5">Tháng 5</option>
            <option value="6">Tháng 6</option>
            <option value="7">Tháng 7</option>
            <option value="8">Tháng 8</option>
            <option value="9">Tháng 9</option>
            <option value="10">Tháng 10</option>
            <option value="11">Tháng 11</option>
            <option value="12">Tháng 12</option>
          </select>
          <select
            onChange={handleYearChange}
            value={year}
            className="rounded-[50px] p-[10px] border-blue-500 border-[2px] font-[600] w-[170px] cursor-pointer"
          >
            <option disabled>Chọn năm</option>
            {years?.data.map((item: any, index: any) => (
              <option key={index + 1} value={item.period}>
                {item.period}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-[20px] rounded-[15px] w-[100%] mb-[16px] h-[400px] lg:h-[500px]">
            <RevenueProfitStatistics year={year} month={month} />
          </div>
          <div className="col-span-9 bg-slate-500 rounded-[15px] w-[100%] h-[300px] lg:h-[400px] p-[20px]">
            <NewUserStatistics year={year} month={month} />
          </div>
        </div>
        <div className="col-span-3 sticky h-fit top-0">
          <div className="bg-slate-500 rounded-[15px] h-[400px] lg:h-[600px] pb-[16px] px-[16px] pt-[40px]">
            <OrderPerformance year={year} month={month} />
          </div>
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
  );
};

export default ListAllChart;

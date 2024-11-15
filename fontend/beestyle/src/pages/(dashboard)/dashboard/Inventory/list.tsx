import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AxiosInstance from '@/configs/axios';

const fetchObsoleteProducts = async () => {
  const response = await AxiosInstance.post('/api/admins/inventory/');
  return response.data.obsolete_products;
};

const InventoryManagement: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['obsoleteProducts'],
    queryFn: fetchObsoleteProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong</div>;

  // Check if data is an array
  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return <div>Data format is incorrect.</div>;
  }

  return (
    <div className="inventory-management-container p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Báo cáo tồn kho</h1>
      
      {/* Filters */}
      <div className="flex justify-between mb-4">
        <select className="p-2 border border-gray-300 rounded">
          <option>Chi nhánh mặc định</option>
          {/* Add branch options here */}
        </select>
        <select className="p-2 border border-gray-300 rounded">
          <option>Chọn loại sản phẩm</option>
          {/* Add product type options here */}
        </select>
        <select className="p-2 border border-gray-300 rounded">
          <option>Trạng thái phiên bản</option>
          {/* Add status options here */}
        </select>
        <input type="text" className="p-2 border border-gray-300 rounded" placeholder="Nhập tên, mã sản phẩm" />
        <button className="bg-blue-500 text-white p-2 rounded">Xem báo cáo</button>
      </div>

      {/* Table */}
      <table className="inventory-table w-full text-center border-collapse shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4">STT</th>
            <th className="py-3 px-4">Tên sản phẩm</th>
            <th className="py-3 px-4">Mã SKU</th>
            <th className="py-3 px-4">Tồn kho</th>
            <th className="py-3 px-4">Giá trị tồn kho</th>
            <th className="py-3 px-4">Giá vốn</th>
            <th className="py-3 px-4">Tỷ trọng (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product: any, index: number) => (
            <tr key={product.id} className="border-b">
              <td className="py-4 px-4 border border-gray-300">{index + 1}</td>
              <td className="py-4 px-4 border border-gray-300">{product.name}</td>
              <td className="py-4 px-4 border border-gray-300">{product.sku}</td>
              <td className="py-4 px-4 border border-gray-300">{product.stock}</td>
              <td className="py-4 px-4 border border-gray-300">{product.inventory_value}</td>
              <td className="py-4 px-4 border border-gray-300">{product.cost}</td>
              <td className="py-4 px-4 border border-gray-300">{product.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;

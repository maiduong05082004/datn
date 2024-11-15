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

  return (
    <div className="inventory-management-container p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Quản lý tồn kho</h1>
      <table className="inventory-table w-full text-center border-collapse shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Tên sản phẩm</th>
            <th className="py-3 px-4">Giá</th>
            <th className="py-3 px-4">Màu sắc</th>
            <th className="py-3 px-4">Kích thước và số lượng</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((product: any) => (
            <tr key={product.id} className="border-b">
              <td className="py-4 px-4 border border-gray-300">{product.id}</td>
              <td className="py-4 px-4 border border-gray-300">{product.name}</td>
              <td className="py-4 px-4 border border-gray-300">{product.price}</td>
              <td className="py-4 px-4 border border-gray-300">
                {product.remaining_properties.map((prop: any, index: number) => (
                  <div key={index} className="mb-2 text-gray-700 font-medium">
                    {prop.color}
                  </div>
                ))}
              </td>
              <td className="py-4 px-4 border border-gray-300">
                {product.remaining_properties.map((prop: any, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="text-gray-700 font-medium">{prop.color}</div>
                    <ul className="list-none">
                      {prop.sizes.map((size: any, idx: number) => (
                        <li key={idx} className="flex justify-between">
                          <span>{size.size}</span>
                          <span>Số lượng: {size.stock}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;

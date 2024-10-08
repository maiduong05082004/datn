import { useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd';
import axios from 'axios';
import React from 'react'

type Props = {}

const ListProducts = (props: Props) => {
  // const querryClient = useQueryClient();
  // const [messageAPI, contextHolder] = message.useMessage();
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admins/products`);
        return response.data;
      } catch (error) {
        message.error('Lỗi khi lấy danh sách sản phẩm');
      }
    }
  });
console.log(data);

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <div>
        <div className="w-full">
          <h2 className="text-4xl font-bold flex justify-center items-center pt-10 pb-10">Quản Lý sản phẩm</h2>
          <table className="w-[90%] m-auto bg-white border-collapse ">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">STT</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 w-[200px]">Tên sản phẩm</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Tồn kho</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 w-[200px]">Mô tả</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Ngày nhập</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Biến thể</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Hình ảnh</th>
                <th className="py-2 px-4 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((product: any, index: number) => (
                <tr key={index} className="even:bg-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{product.id}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{product.name}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{parseFloat(product.price).toLocaleString()} VND</td>
                  <td className="py-2 px-4 border-b border-gray-300">{product.stock}</td>
                  <td className="py-2 px-4 border-b border-gray-300 truncate max-w-xs">{product.description}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{product.input_day}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{product.category_id}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {product.variations.map((variant: any) => (
                      <div key={variant.id}>
                        {variant.attribute_value.value} ({variant.stock})
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {product.variations[0]?.variation_images[0]?.image_path ? (
                      <img
                        src={`http://localhost:8000/${product.variations[0].variation_images[0].image_path}`}
                        alt="product"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 ">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-600 focus:outline-none">Edit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 transition-all hover:bg-red-600 focus:outline-none">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ListProducts
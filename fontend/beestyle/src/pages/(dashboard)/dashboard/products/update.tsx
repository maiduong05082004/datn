import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {};

const AddProduct = (props: Props) => {
  const [addImages, setAddImages] = useState(false);
  const [variantGroup, setVariantGroup] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(''); // State cho chất liệu
  const [colors, setColors] = useState(['Xanh lá cây', 'Xanh Nước biển']); // Các tùy chọn màu sắc
  const [variants, setVariants] = useState([
    { size: 'S', stock: '', discount: '' },
    { size: 'M', stock: '', discount: '' },
    { size: 'L', stock: '', discount: '' },
    { size: 'XL', stock: '', discount: '' },
    { size: 'XXL', stock: '', discount: '' },
  ]);

  const handleAddImagesChange = () => {
    setAddImages(!addImages);
  };

  const handleVariantGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVariantGroup(e.target.value);
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMaterial(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Thêm sản phẩm mới</h1>
      <form>
        <div className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
          <div className="bg-blue-100 p-4 rounded-t-lg">
            <h4 className="text-lg font-semibold text-blue-800">Thông tin sản phẩm</h4>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium text-gray-700">Tên sản phẩm</label>
              <input type="text" name="name" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block font-medium text-gray-700">Giá sản phẩm</label>
              <input type="text" name="price" id="price" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            <div className="mb-4 flex items-center">
              <label htmlFor="add_images" className="font-medium text-gray-700">Thêm dữ liệu khi không có biến thể</label>
              <input type="checkbox" id="add_images" className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" onChange={handleAddImagesChange} />
            </div>

            {addImages && (
              <div id="image-fields" className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-4">
                  <label htmlFor="stock" className="block font-medium text-gray-700">Số lượng sản phẩm</label>
                  <input type="number" name="stock" id="stock" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="thumbnail_image" className="block font-medium text-gray-700">Hình ảnh đại diện</label>
                  <input type="file" name="thumbnail_image" id="thumbnail_image" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div className="mb-4">
                  <label htmlFor="album_images" className="block font-medium text-gray-700">Album hình ảnh</label>
                  <input type="file" name="album_images[]" id="album_images" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" multiple />
                </div>
              </div>
            )}
          </div>
        </div>

        {!addImages && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-green-100 p-4 rounded-t-lg">
              <h4 className="text-lg font-semibold text-green-800">Biến thể sản phẩm</h4>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="mb-4">
                <label htmlFor="variant_group" className="block font-medium text-gray-700">Chọn nhóm biến thể</label>
                <select id="variant_group" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" value={variantGroup} onChange={handleVariantGroupChange}>
                  <option value="">Chọn nhóm biến thể</option>
                  <option value="Biến thể cho quần áo">Biến thể cho quần áo</option>
                  <option value="Biến thể cho giày">Biến thể cho giày</option>
                  <option value="Biến thể cho phụ kiện">Biến thể cho phụ kiện</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="color" className="block font-medium text-gray-700">Chọn màu sắc</label>
                <select id="color" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" value={selectedColor} onChange={handleColorChange}>
                  <option value="">Chọn màu sắc</option>
                  {colors.map((color, index) => (
                    <option key={index} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Hiển thị các select loại chất liệu khi chọn màu sắc */}
              {selectedColor && (
                <div className="mb-4">
                  <label htmlFor="material" className="block font-medium text-gray-700">Chọn loại chất liệu</label>
                  <select id="material" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" value={selectedMaterial} onChange={handleMaterialChange}>
                    <option value="">Chọn chất liệu</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Vải thô">Vải thô</option>
                  </select>
                </div>
              )}

              {/* Biến thể kích thước */}
              {selectedColor && selectedMaterial && (
                <>
                  {variants.map((variant, index) => (
                    <div key={index} className="mb-4 grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id={`size-${variant.size}`} name="size" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                        <label htmlFor={`size-${variant.size}`} className="block text-gray-700">{variant.size}</label>
                      </div>

                      <input
                        type="number"
                        placeholder="Số lượng"
                        className="border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Giảm giá (%)"
                        className="border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        value={variant.discount}
                        onChange={(e) => handleVariantChange(index, 'discount', e.target.value)}
                      />
                      <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Xóa
                      </button>
                    </div>
                  ))}

                  {/* Hình ảnh đại diện và Album hình ảnh */}
                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">Hình ảnh đại diện cho {selectedColor}</label>
                    <input type="file" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium text-gray-700">Album hình ảnh cho {selectedColor}</label>
                    <input type="file" multiple className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {};

const AddProduct = (props: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }
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
      <h1 className="text-3xl font-bold mb-6 text-center text-white-800">Thêm sản phẩm mới</h1>
      <form>
        <div className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
          <div className="bg-blue-100 p-4 rounded-t-lg">
            <h4 className="text-lg font-semibold text-blue-800">Thông tin sản phẩm</h4>
          </div>
          <div className="p-6 bg-gray-50">
            {/* Slug */}
            <div className="mb-4">
              <label htmlFor="slug" className="block font-medium text-gray-700">Slug</label>
              <input type="text" name="slug" id="slug" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* Tên sản phẩm */}
            <div className="mb-4">
              <label htmlFor="name_product" className="block font-medium text-gray-700">Tên sản phẩm</label>
              <input type="text" name="name_product" id="name_product" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* Giá sản phẩm */}
            <div className="mb-4">
              <label htmlFor="price" className="block font-medium text-gray-700">Giá sản phẩm</label>
              <input type="number" name="price" id="price" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* Số lượng trong kho */}
            <div className="mb-4">
              <label htmlFor="stock" className="block font-medium text-gray-700">Số lượng trong kho</label>
              <input type="number" name="stock" id="stock" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* Mô tả */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-medium text-gray-700">Mô tả</label>
              <input type="text" name="description" id="description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* Nội dung chi tiết */}
            <div className="mb-4">
              <label htmlFor="content" className="block font-medium text-gray-700">Nội dung chi tiết</label>
              <textarea name="content" id="content" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required></textarea>
            </div>

            {/* Lượt xem */}
            <div className="mb-4">
              <label htmlFor="view" className="block font-medium text-gray-700">Lượt xem</label>
              <input type="number" name="view" id="view" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* ID danh mục */}
            <div className="mb-4">
              <label htmlFor="category_id" className="block font-medium text-gray-700">ID danh mục</label>
              <input type="number" name="category_id" id="category_id" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
            </div>

            {/* Các loại checkbox */}
            <div className="grid grid-cols-2 gap-4">
              {/* Loại sản phẩm */}
              <div className="mb-4">
                <label htmlFor="is_type" className="block font-medium text-gray-700">Loại sản phẩm</label>
                <input type="checkbox" name="is_type" id="is_type" className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>

              {/* Sản phẩm hot */}
              <div className="mb-4">
                <label htmlFor="is_hot" className="block font-medium text-gray-700">Sản phẩm hot</label>
                <input type="checkbox" name="is_hot" id="is_hot" className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>

              {/* Hot deal */}
              <div className="mb-4">
                <label htmlFor="is_hot_deal" className="block font-medium text-gray-700">Hot deal</label>
                <input type="checkbox" name="is_hot_deal" id="is_hot_deal" className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>

              {/* Sản phẩm mới */}
              <div className="mb-4">
                <label htmlFor="is_new" className="block font-medium text-gray-700">Sản phẩm mới</label>
                <input type="checkbox" name="is_new" id="is_new" className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>

              {/* Hiển thị trên trang chủ */}
              <div className="mb-4">
                <label htmlFor="is_show_home" className="block font-medium text-gray-700">Hiển thị trên trang chủ</label>
                <input type="checkbox" name="is_show_home" id="is_show_home" className="ml-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
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
            <div className={`bg-green-100 dark:bg-green-900 p-4 rounded-t-lg transition-colors duration-300`}>
              <h4 className={`text-lg font-semibold ${darkMode ? 'text-green-200' : 'text-green-800'} transition-colors duration-300`}>
                Biến thể sản phẩm
              </h4>
            </div>

            <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
              <div className="mb-4">
                <label htmlFor="variant_group" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                  Chọn nhóm biến thể
                </label>
                <select
                  id="variant_group"
                  className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-300`}
                  value={variantGroup}
                  onChange={handleVariantGroupChange}
                >
                  <option value="">Chọn nhóm biến thể</option>
                  <option value="Biến thể cho quần áo">Biến thể cho quần áo</option>
                  <option value="Biến thể cho giày">Biến thể cho giày</option>
                  <option value="Biến thể cho phụ kiện">Biến thể cho phụ kiện</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="color" className={`block font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-300`}>
                  Chọn màu sắc
                </label>
                <select
                  id="color"
                  className={`mt-1 block w-full border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors duration-300`}
                  value={selectedColor}
                  onChange={handleColorChange}
                >
                  <option value="">Chọn màu sắc</option>
                  {colors.map((color, index) => (
                    <option key={index} value={color}>{color}</option>
                  ))}
                </select>
              </div>
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
  )
}

<button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
  Thêm sản phẩm
</button>
      </form >
    </div >
  );
};

export default AddProduct;
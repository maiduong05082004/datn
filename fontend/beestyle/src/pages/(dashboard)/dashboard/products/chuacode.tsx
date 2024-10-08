import React, { useState } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

type Variant = {
  size: string;
  stock: string;
  discount: string;
};

const AddProduct = () => {
  const [productDescription, setProductDescription] = useState('');
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [addImages, setAddImages] = useState<boolean>(false);
  const [variantGroup, setVariantGroup] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [colors, setColors] = useState<string[]>(['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'pink']);
  const [variants, setVariants] = useState<Variant[]>([
    { size: 'S', stock: '', discount: '' },
    { size: 'M', stock: '', discount: '' },
    { size: 'L', stock: '', discount: '' },
    { size: 'XL', stock: '', discount: '' },
    { size: 'XXL', stock: '', discount: '' },
  ]);
  const [showVariants, setShowVariants] = useState<boolean>(true);
  const [variantImages, setVariantImages] = useState<{ [key: string]: string | null }>({});
  const [variantAlbums, setVariantAlbums] = useState<{ [key: string]: string[] }>({});

  const filteredColors = colors.filter(color =>
    color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setMainImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddImagesChange = () => {
    setAddImages(!addImages);
  };

  const handleVariantGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVariantGroup(e.target.value);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setVariants(variants.map(variant => ({ ...variant, stock: '', discount: '' })));
  };

  const toggleVariantForm = () => {
    if (showVariants) {
      toast.info('Bạn đã chọn không thêm biến thể.');
    }
    setShowVariants(!showVariants);
  };

  const handleVariantImageChange = (color: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setVariantImages((prev) => ({ ...prev, [color]: reader.result as string }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleVariantAlbumChange = (color: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const readers = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setVariantAlbums((prev) => ({ ...prev, [color]: results }));
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      productDescription,
      mainImage,
      variants,
      productName: (document.getElementById('productName') as HTMLInputElement).value,
      productPrice: (document.getElementById('productPrice') as HTMLInputElement).value,
      productStock: (document.getElementById('productStock') as HTMLInputElement).value,
      category: (document.getElementById('category') as HTMLSelectElement).value,
      dateAdded: (document.getElementById('dateAdded') as HTMLInputElement).value,
      shortDescription: (document.getElementById('shortDescription') as HTMLTextAreaElement).value,
    };
    console.log('Product data:', formData);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className='border-2 border-gray-300 w-[95%] m-auto rounded-2xl mt-10 mb-10 shadow-lg'>
        <div className='w-[90%] m-auto mt-10'>
          <h2 className='text-4xl font-sans text-center font-bold mb-10 text-gray-800'>Thêm Sản Phẩm</h2>
          <form onSubmit={handleSubmit}>
            <div className="container mx-auto p-6 min-w-full bg-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="productName" className="font-medium text-gray-700">Tên Sản phẩm</label>
                    <input
                      type="text"
                      id="productName"
                      className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="productPrice" className="font-medium text-gray-700">Giá Sản phẩm</label>
                    <input
                      type="text"
                      id="productPrice"
                      className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập giá sản phẩm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="productStock" className="font-medium text-gray-700">Tồn kho</label>
                    <input
                      type="number"
                      id="productStock"
                      className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập số lượng tồn kho"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="category" className="font-medium text-gray-700">Danh mục</label>
                    <select id="category" className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>--Chọn danh mục--</option>
                      <option value={1}>Áo</option>
                      <option value={2}>Quần</option>
                      <option value={3}>Giày</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="dateAdded" className="font-medium text-gray-700">Ngày nhập</label>
                    <input
                      type="date"
                      id="dateAdded"
                      className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="shortDescription" className="font-medium text-gray-700">Mô tả ngắn</label>
                    <textarea
                      id="shortDescription"
                      className="border rounded-lg p-2 h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mô tả ngắn"
                    />
                  </div>

                  <div className='flex justify-between'>
                    <div className="flex flex-col w-[48%]">
                      <label htmlFor="mainImage" className="font-medium text-gray-700">Ảnh đại diện</label>
                      <input
                        type="file"
                        id="mainImage"
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleImageChange}
                      />
                      {mainImage && (
                        <div className="mt-4">
                          <img src={mainImage} alt="Ảnh đại diện" className="w-full h-48 object-cover rounded-lg shadow-md" />
                          <button
                            type="button"
                            className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => setMainImage(null)}
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col w-[48%]">
                      <label className="font-medium text-gray-700">Album hình ảnh</label>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleVariantAlbumChange('default', e)}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {variantAlbums['default'] && variantAlbums['default'].map((image, idx) => (
                        <div key={idx} className="mt-4">
                          <img src={image} alt={`Hình ảnh album`} className="w-full h-48 object-cover rounded-lg shadow-md" />
                          <button
                            type="button"
                            className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => setVariantAlbums((prev) => {
                              const updatedAlbum = prev['default'].filter((_, index) => index !== idx);
                              return { ...prev, default: updatedAlbum };
                            })}
                          >
                            Xóa ảnh album
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-medium mb-2 text-base text-gray-800">Mô tả chi tiết sản phẩm</label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={productDescription}
                      onChange={(_, editor) => {
                        const data = editor.getData();
                        setProductDescription(data);
                      }}
                    />
                  </div>

                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-green-100 p-4 rounded-t-lg flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-green-800">Biến thể sản phẩm</h4>
                      <button type="button" onClick={toggleVariantForm} className="text-blue-500 hover:underline">
                        {showVariants ? 'Không thêm biến thể' : 'Thêm biến thể'}
                      </button>
                    </div>
                    {showVariants && (
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
                          <input
                            type="text"
                            placeholder="Tìm kiếm màu"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          />
                          <div className="grid grid-cols-5 gap-2 mt-2 border-2 border-gray-300 p-5 rounded-md shadow-sm">
                            {filteredColors.map((color, index) => (
                              <div key={index} className="flex items-center cursor-pointer" onClick={() => handleColorChange(color)}>
                                <div
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: color.toLowerCase() }}
                                />
                                <span className="ml-2">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {selectedColor && (
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

                            <div className="mb-4">
                              <div className="flex justify-between">
                                <div className="mb-4">
                                  <label className="block font-medium text-gray-700">Hình ảnh đại diện cho {selectedColor}</label>
                                  <input type="file"
                                    onChange={(e) => handleVariantImageChange(selectedColor, e)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                  />
                                  {variantImages[selectedColor] && (
                                    <div className="mt-4">
                                      <img src={variantImages[selectedColor]} alt={`Hình ảnh đại diện cho ${selectedColor}`} className="w-[280px] h-48 object-cover rounded-lg shadow-md m-auto" />
                                      <button
                                        type="button"
                                        className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        onClick={() => setVariantImages((prev) => ({ ...prev, [selectedColor]: null }))}
                                      >
                                        Xóa ảnh đại diện
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="mb-4">
                                  <label className="block font-medium text-gray-700">Album hình ảnh cho {selectedColor}</label>
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleVariantAlbumChange(selectedColor, e)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                  />
                                  {variantAlbums[selectedColor] && variantAlbums[selectedColor].map((image, idx) => (
                                    <div key={idx} className="mt-4">
                                      <img src={image} alt={`Hình ảnh album cho ${selectedColor}`} className="w-[280px] h-48 object-cover rounded-lg shadow-md" />
                                      <button
                                        type="button"
                                        className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        onClick={() => setVariantAlbums((prev) => {
                                          const updatedAlbum = prev[selectedColor].filter((_, index) => index !== idx);
                                          return { ...prev, [selectedColor]: updatedAlbum };
                                        })}
                                      >
                                        Xóa ảnh album
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </>
  );
};

export default AddProduct;
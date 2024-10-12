import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
  const [colors, setColors] = useState<string[]>([]);
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
  const [attributeGroups, setAttributeGroups] = useState<any[]>([]);
  const [colorImages, setColorImages] = useState<{ [key: string]: string }>({});

  const { data: variant_group, isLoading } = useQuery({
    queryKey: ['variant_group'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/attribute_groups');
      return response?.data?.data; // Return the response
    },
  });
console.log(variant_group[0]);

  // Handle image change for the main product image
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

  // Toggle showing or hiding the variant form
  const toggleVariantForm = () => {
    if (showVariants) {
      toast.info('Bạn đã chọn không thêm biến thể.');
    }
    setShowVariants(!showVariants);
  };

  // Handle variant group change
  const handleVariantGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVariantGroup(e.target.value);
    setSelectedColor(''); // Reset selected color when variant group changes
    setVariants(variants.map(variant => ({ ...variant, stock: '', discount: '' }))); // Reset variants
  };

  // Handle color change and reset variants
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setVariants(variants.map(variant => ({ ...variant, stock: '', discount: '' })));
  };

  // Handle variant image change for each color
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

  // Handle album image change for each color
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

  // Handle form submission
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

  // Loading state while fetching data
  if (isLoading) return <div>Loading....</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className='border-2 border-gray-300 w-[95%] m-auto rounded-2xl mt-10 mb-10 shadow-lg'>
        <div className='w-[90%] m-auto mt-10'>
          <h2 className='text-4xl font-sans text-center font-bold mb-10 text-gray-800'>Thêm Sản Phẩm</h2>
          <form onSubmit={handleSubmit}>
            <div className="container mx-auto p-6 min-w-full bg-white">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
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

                {/* Right Column */}
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
                      <button
                        type="button"
                        onClick={toggleVariantForm}
                        className="text-blue-500 hover:underline"
                      >
                        {showVariants ? 'Không thêm biến thể' : 'Thêm biến thể'}
                      </button>
                    </div>
                    {showVariants && (
                      <div className="p-6 bg-gray-50">
                        {/* Nhóm biến thể */}
                        <div className="mb-4">
                          <label htmlFor="variant_group" className="block font-medium text-gray-700">Chọn nhóm biến thể</label>
                          <select
                            id="variant_group"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            value={variantGroup}
                            onChange={handleVariantGroupChange}
                          >
                            <option value="">Chọn nhóm biến thể</option>
                            {variant_group?.map((group: any) => (
                              <option key={group.group_id} value={group.group_name}>
                                {group.group_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Render các thuộc tính dựa trên nhóm biến thể đã chọn */}
                        {variant_group && variant_group?.data?.data?.filter((group: any) => group.group_name === variant_group)
                          .map((group: any) => (
                            group.attributes.map((attribute: any) => (
                              <div key={attribute.id} className="mb-4">
                                <label className="block font-medium text-gray-700">{attribute.name}</label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                  {attribute.attribute_values.map((value: any) => (
                                    <option key={value.id} value={value.value}>
                                      {value.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))
                          ))}

                        {/* Chọn màu sắc */}
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
                            {colors.filter(color => color.toLowerCase().includes(searchTerm.toLowerCase())).map((color, index) => (
                              <div
                                key={index}
                                className="flex items-center cursor-pointer"
                                onClick={() => handleColorChange(color)}
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                />
                                <span className="ml-2">{color}</span>
                                {selectedColor === color && colorImages[color] && (
                                  <img src={colorImages[color]} alt={color} className="ml-2 w-10 h-10 object-cover" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
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
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AddProduct = () => {
  const [productDescription, setProductDescription] = useState('');
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [variantAlbums, setVariantAlbums] = useState<{ [key: string]: string[] }>({});

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/categories');
      return response.data;
    },
  });

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

  const handleVariantAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setVariantAlbums((prev) => ({ ...prev, default: results }));
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className="border-2 border-gray-300 w-[95%] m-auto rounded-2xl mt-10 mb-10 shadow-lg">
        <div className="w-[90%] m-auto mt-10">
          <h2 className="text-4xl font-sans text-center font-bold mb-10 text-gray-800">Thêm Sản Phẩm</h2>

          <form>
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
                    <select
                      id="category"
                      className="border rounded-lg p-2"
                    >
                      <option value="">--Chọn danh mục--</option>
                      {categories?.map((category: any) => (
                        <optgroup key={category.id} label={category.name}>
                          {category.children_recursive?.map((child: any) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
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

                  <div className="flex justify-between">
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
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col w-[48%]">
                      <label className="font-medium text-gray-700">Album hình ảnh</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleVariantAlbumChange}
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
                            Xóa
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
                      onChange={(_, editor) => setProductDescription(editor.getData())}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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

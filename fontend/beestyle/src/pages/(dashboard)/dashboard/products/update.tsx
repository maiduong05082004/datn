// import React, { useState } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';

// type Variant = {
//   size: string;
//   stock: string;
//   discount: string;
// };

// type VariantForm = {
//   variantGroup: string;
//   selectedColor: string;
//   variants: Variant[];
//   variantImages: { [key: string]: string | null };
//   variantAlbums: { [key: string]: string[] };
// };
// type Category = {
//   id: number;
//   name: string;
//   children_recursive?: Category[];
// };

// type AttributeValue = {
//   id: number;
//   value: string;
// };

// type Attribute = {
//   id: number;
//   name: string;
//   attribute_type: number;
//   attribute_values: AttributeValue[];
// };

// type AttributeGroup = {
//   group_id: number;
//   group_name: string;
//   attributes: Attribute[];
// };


// const AddProduct = () => {
//   const [productDescription, setProductDescription] = useState('');
//   const [mainImage, setMainImage] = useState<string | null>(null);
//   const [variantForms, setVariantForms] = useState<VariantForm[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [activeFormIndex, setActiveFormIndex] = useState<number | null>(null);
//   const [expandedForms, setExpandedForms] = useState<boolean[]>([]);
//   const queryClient = useQueryClient();

//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const response = await axios.get('http://localhost:8000/api/admins/categories');
//       return response.data; // Ensure it returns an array
//     },
//   });


//   const { data: attributeGroups, isLoading } = useQuery<AttributeGroup[]>({
//     queryKey: ['attributeGroups'],
//     queryFn: async () => {
//       const response = await axios.get('http://localhost:8000/api/admins/attribute_groups');
//       return Object.values(response.data.data);
//     },
//   });



//   const handleAddVariantForm = () => {
//     setVariantForms([
//       ...variantForms,
//       {
//         variantGroup: '',
//         selectedColor: '',
//         variants: [],
//         variantImages: {},
//         variantAlbums: {},
//       },
//     ]);
//     setExpandedForms([...expandedForms, true]);
//   };

//   const handleVariantGroupChange = (index: number, value: string) => {
//     const updatedForms = [...variantForms];
//     updatedForms[index].variantGroup = value;
//     setVariantForms(updatedForms);
//   };

//   const handleColorChange = (index: number, color: string) => {
//     setVariantForms((prevForms) => {
//       const updatedForms = [...prevForms];
//       updatedForms[index] = {
//         ...updatedForms[index],
//         selectedColor: color,
//       };
//       return updatedForms;
//     });
//   };


//   const handleVariantChange = (formIndex: number, variantIndex: number, field: keyof Variant, value: string) => {
//     setVariantForms((prevForms) => {
//       const updatedForms = [...prevForms];
//       const updatedVariants = [...updatedForms[formIndex].variants];
//       updatedVariants[variantIndex] = {
//         ...updatedVariants[variantIndex],
//         [field]: value,
//       };
//       updatedForms[formIndex].variants = updatedVariants;
//       return updatedForms;
//     });
//   };



//   const handleImageChange = (index: number, color: string, e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         setVariantForms((prevForms) => {
//           const updatedForms = [...prevForms];
//           updatedForms[index].variantImages[color] = reader.result as string;
//           return updatedForms;
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };


//   const handleAlbumChange = (index: number, color: string, e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       const readers = files.map((file) => {
//         return new Promise<string>((resolve) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.readAsDataURL(file);
//         });
//       });

//       Promise.all(readers).then((results) => {
//         setVariantForms((prevForms) => {
//           const updatedForms = [...prevForms];
//           updatedForms[index].variantAlbums[color] = results;
//           return updatedForms;
//         });
//       });
//     }
//   };

//   const getAttributesForGroup = (groupName: string) => {
//     const group = attributeGroups?.find((group) => group.group_name === groupName);
//     return group ? group.attributes : [];
//   };


//   const toggleFormVisibility = (index: number) => {
//     const updatedExpandedForms = [...expandedForms];
//     updatedExpandedForms[index] = !updatedExpandedForms[index];
//     setExpandedForms(updatedExpandedForms);
//   };

//   const handleActiveFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedIndex = Number(e.target.value);
//     setActiveFormIndex(selectedIndex);
//     const updatedExpandedForms = expandedForms.map((_, idx) => idx === selectedIndex);
//     setExpandedForms(updatedExpandedForms);
//   };

//   const handleRemoveVariantForm = (index: number) => {
//     const updatedForms = variantForms.filter((_, formIndex) => formIndex !== index);
//     const updatedExpandedForms = expandedForms.filter((_, formIndex) => formIndex !== index);
//     setVariantForms(updatedForms);
//     setExpandedForms(updatedExpandedForms);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = {
//       productDescription,
//       mainImage,
//       variants: variantForms,
//       productName: (document.getElementById('productName') as HTMLInputElement).value,
//       productPrice: (document.getElementById('productPrice') as HTMLInputElement).value,
//       productStock: (document.getElementById('productStock') as HTMLInputElement).value,
//       category: (document.getElementById('category') as HTMLSelectElement).value,
//       dateAdded: (document.getElementById('dateAdded') as HTMLInputElement).value,
//       shortDescription: (document.getElementById('shortDescription') as HTMLTextAreaElement).value,
//     };
//     console.log('Product data:', formData);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
//       <div className='border-2 border-gray-300 w-[95%] m-auto rounded-2xl mt-10 mb-10 shadow-lg'>
//         <div className='w-[90%] m-auto mt-10'>
//           <h2 className='text-4xl font-sans text-center font-bold mb-10 text-gray-800'>Thêm Sản Phẩm</h2>

//           <form onSubmit={handleSubmit}>
//             <div className="container mx-auto p-6 min-w-full bg-white">
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex flex-col">
//                     <label htmlFor="productName" className="font-medium text-gray-700">Tên Sản phẩm</label>
//                     <input
//                       type="text"
//                       id="productName"
//                       className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Nhập tên sản phẩm"
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label htmlFor="productPrice" className="font-medium text-gray-700">Giá Sản phẩm</label>
//                     <input
//                       type="text"
//                       id="productPrice"
//                       className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Nhập giá sản phẩm"
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label htmlFor="productStock" className="font-medium text-gray-700">Tồn kho</label>
//                     <input
//                       type="number"
//                       id="productStock"
//                       className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Nhập số lượng tồn kho"
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label htmlFor="category" className="font-medium text-gray-700">Danh mục</label>
//                     <select
//                       id="category"
//                       className="border rounded-lg p-2"
//                     >
//                       <option value="">--Chọn danh mục--</option>
//                       {categories?.map((category: any) => (
//                         <optgroup key={category.id} label={category.name}>
//                           {category.children_recursive?.map((child: any) => (
//                             <option key={child.id} value={child.id}>
//                               {child.name}
//                             </option>
//                           ))}
//                         </optgroup>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="flex flex-col">
//                     <label htmlFor="dateAdded" className="font-medium text-gray-700">Ngày nhập</label>
//                     <input
//                       type="date"
//                       id="dateAdded"
//                       className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   <div className="flex flex-col">
//                     <label htmlFor="shortDescription" className="font-medium text-gray-700">Mô tả ngắn</label>
//                     <textarea
//                       id="shortDescription"
//                       className="border rounded-lg p-2 h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Nhập mô tả ngắn"
//                     />
//                   </div>

//                   {/* Main Image Upload */}
//                   <div className='flex justify-between'>
//                     <div className="flex flex-col w-[48%]">
//                       <label htmlFor="mainImage" className="font-medium text-gray-700">Ảnh đại diện</label>
//                       <input
//                         type="file"
//                         id="mainImage"
//                         className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files[0]) {
//                             const file = e.target.files[0];
//                             const reader = new FileReader();
//                             reader.onload = () => setMainImage(reader.result as string);
//                             reader.readAsDataURL(file);
//                           }
//                         }}
//                       />
//                       {mainImage && (
//                         <div className="mt-4">
//                           <img src={mainImage} alt="Ảnh đại diện" className="w-full h-48 object-cover rounded-lg shadow-md" />
//                           <button
//                             type="button"
//                             className="mt-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                             onClick={() => setMainImage(null)}
//                           >
//                             Xóa
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex flex-col">
//                     <label className="font-medium mb-2 text-base text-gray-800">Mô tả chi tiết sản phẩm</label>
//                     <CKEditor
//                       editor={ClassicEditor}
//                       data={productDescription}
//                       onChange={(_, editor) => setProductDescription(editor.getData())}
//                     />
//                   </div>

//                   <div className="flex flex-col mb-4">
//                     <label className="font-medium text-gray-700">Chọn biến thể</label>
//                     <select
//                       value={activeFormIndex === null ? '' : activeFormIndex}
//                       onChange={handleActiveFormChange}
//                       className="border p-2 rounded-lg"
//                     >
//                       <option value="">Chọn biến thể</option>
//                       {variantForms.map((_, index) => (
//                         <option key={index} value={index}>
//                           Biến thể {index + 1}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <button
//                     type="button"
//                     className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                     onClick={handleAddVariantForm}
//                   >
//                     Thêm biến thể mới
//                   </button>

//                   {variantForms.map((form, formIndex) => (
//                     <div key={formIndex} className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
//                       <div className="bg-green-100 p-4 rounded-t-lg flex justify-between items-center">
//                         <h4 className="text-lg font-semibold text-green-800">
//                           Biến thể sản phẩm {formIndex + 1}
//                         </h4>
//                         <div>
//                           <button
//                             type="button"
//                             className="text-blue-500 hover:underline mr-4"
//                             onClick={() => toggleFormVisibility(formIndex)}
//                           >
//                             {expandedForms[formIndex] ? 'Thu gọn' : 'Mở rộng'}
//                           </button>
//                           <button
//                             type="button"
//                             className="text-red-500 hover:underline"
//                             onClick={() => handleRemoveVariantForm(formIndex)}
//                           >
//                             Xóa
//                           </button>
//                         </div>
//                       </div>

//                       {expandedForms[formIndex] && (
//                         <div className="p-6 bg-gray-50">
//                           {/* Select variant group */}
//                           {formIndex === 0 && (
//                             <div className="mb-4">
//                               <label htmlFor={`variant_group_${formIndex}`} className="block font-medium text-gray-700">
//                                 Chọn nhóm biến thể
//                               </label>
//                               <select
//                                 id={`variant_group_${formIndex}`}
//                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//                                 value={form.variantGroup}
//                                 onChange={(e) => handleVariantGroupChange(formIndex, e.target.value)}
//                               >
//                                 <option value="">Chọn nhóm biến thể</option>
//                                 {attributeGroups?.map((group: AttributeGroup) => (
//                                   <option key={group.group_id} value={group.group_name}>
//                                     {group.group_name}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>
//                           )}

//                           {/* Render attributes based on selected variant group */}
//                           {form.variantGroup === 'Biến thể cho giày dép' && (
//                             <>
//                               <div className="mb-4">
//                                 <label className="block font-medium text-gray-700">Chọn kích thước giày</label>
//                                 {getAttributesForGroup('Biến thể cho giày dép')
//                                   .find((attr) => attr.name === 'Kích Thước giày')
//                                   ?.attribute_values.map((size) => (
//                                     <div key={size.id} className="flex items-center space-x-2">
//                                       <input
//                                         type="checkbox"
//                                         id={`size-${size.value}`}
//                                         name="size"
//                                         className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
//                                         onChange={(e) => handleVariantChange(formIndex, variantIndex, 'size', size.value)}
//                                       />
//                                       <label htmlFor={`size-${size.value}`} className="block text-gray-700">
//                                         {size.value}
//                                       </label>
//                                     </div>
//                                   ))}
//                               </div>

//                               <div className="mb-4">
//                                 <label className="block font-medium text-gray-700">Chọn màu sắc giày</label>
//                                 {getAttributesForGroup('Biến thể cho giày dép')
//                                   .find((attr) => attr.name === 'Màu Sắc')
//                                   ?.attribute_values.map((color) => (
//                                     <div key={color.id} className="flex items-center space-x-2">
//                                       <input
//                                         type="checkbox"
//                                         id={`color-${color.value}`}
//                                         name="color"
//                                         className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
//                                         onChange={(e) => handleVariantChange(formIndex, variantIndex, 'color', color.value)}
//                                       />
//                                       <label htmlFor={`color-${color.value}`} className="block text-gray-700">
//                                         {color.value}
//                                       </label>
//                                     </div>
//                                   ))}
//                               </div>
//                             </>
//                           )}


//                           {/* Rest of the form */}
//                         </div>
//                       )}
//                     </div>
//                   ))}

//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="mt-6 flex justify-center">
//                 <button
//                   type="submit"
//                   className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddProduct;
import React from 'react'

type Props = {}

const update = (props: Props) => {
  return (
    <div>update</div>
  )
}

export default update

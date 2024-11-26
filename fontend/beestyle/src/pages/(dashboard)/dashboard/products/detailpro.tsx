import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Spin, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import AxiosInstance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';

const { Option } = Select;

const DetailProduct: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [content, setContent] = useState<string>('');
  const [attributes, setAttributes] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const { data: UpdateVariant, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['updatevariant', id],
    queryFn: async () => {
      const response = await AxiosInstance.get(`http://localhost:8000/api/admins/products/${id}`);
      return response?.data?.data;
    },
  });

  const { data: variantgroup, isLoading: isLoadingVariantGroup } = useQuery({
    queryKey: ['variantgroup'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://localhost:8000/api/admins/attribute_groups');
      return response?.data?.variation;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://localhost:8000/api/admins/categories');
      return response?.data;
    },
  });

  useEffect(() => {
    if (UpdateVariant && variantgroup) {
      form.setFieldsValue({
        ...UpdateVariant,
        input_day: UpdateVariant.input_day ? moment(UpdateVariant.input_day) : null,
        category_id: UpdateVariant.category_id,
        variant_group: UpdateVariant.group?.id,
      });
      setContent(UpdateVariant.content || '');

      const formattedVariants = UpdateVariant.variations.map((variation: any) => ({
        colorId: variation.attribute_value_image_variant.id,
        colorName: variation.attribute_value_image_variant.value,
        sizes: variation.variation_values.map((value: any) => ({
          sizeId: value.attribute_value_id,
          size: value.value,
          stock: value.stock,
          discount: value.discount,
        })),
        colorImage: variation.attribute_value_image_variant.image_path
          ? [
              {
                name: variation.attribute_value_image_variant.image_path,
                uid: variation.attribute_value_image_variant.image_path,
                status: 'done',
                url: variation.attribute_value_image_variant.image_path,
              },
            ]
          : [],
        albumImages: variation.variation_album_images.map((image: string) => ({
          name: image,
          uid: image,
          status: 'done',
          url: image,
        })),
      }));
      setVariants(formattedVariants);
    }
  }, [UpdateVariant, form, variantgroup]);

  if (isLoadingVariantGroup || isLoadingCategories || isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="flex gap-2">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 w-[70%]">
          <Form form={form} layout="vertical">
            <Form.Item label="Tên sản phẩm" name="name">
              <Input className="border border-gray-300 rounded-md" disabled />
            </Form.Item>

            <Form.Item label="Giá sản phẩm" name="price">
              <InputNumber min={0} style={{ width: '100%' }} className="border border-gray-300 rounded-md" disabled />
            </Form.Item>

            <Form.Item label="Mô tả sản phẩm" name="description">
              <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm ngắn gọn" className="border border-gray-300 rounded-md" disabled />
            </Form.Item>

            <Form.Item label="Nội dung chi tiết" name="content">
              <CKEditor
                editor={ClassicEditor}
                data={content}
                disabled={true} // CKEditor không cho phép chỉnh sửa
              />
            </Form.Item>

            <Form.Item label="Ngày nhập" name="input_day">
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} disabled />
            </Form.Item>

            <Form.Item label="Danh mục" name="category_name">
              <Select placeholder="Chọn danh mục" className="border border-gray-300 rounded-md" disabled>
                {categories?.map((category: any) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className="flex flex-col gap-8 w-[28%]">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-2xl font-semibold mb-4">Biến Thể</h3>
            {variants.map((variant: any, index: number) => (
              <div key={index} className="mb-8 p-6 bg-white">
                <h4 className="text-xl font-semibold mb-4">Biến thể màu: {variant.colorName}</h4>

                <div className="">
                  <div>
                    <h5 className="font-semibold mb-4">Thông tin kích thước:</h5>
                    {variant.sizes.map((size: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 mb-3">
                        <span className="w-20 font-semibold">{size.size}</span>
                        <InputNumber value={size.stock} className="w-24 border border-gray-300 rounded-md" placeholder="Số lượng" disabled />
                        <InputNumber value={size.discount} className="w-24 border border-gray-300 rounded-md" placeholder="Giảm giá (%)" disabled />
                      </div>
                    ))}
                  </div>

                    <div>
                    <h5 className="font-semibold mb-4">Hình ảnh biến thể:</h5>
                    <div className="flex flex-wrap gap-6">
                      {/* Color Image */}
                      <div className="flex flex-col items-center">
                        <div className="mb-2 text-sm font-semibold">Ảnh màu:</div>
                        {variant.colorImage.length > 0 ? (
                          variant.colorImage.map((image: any, imgIndex: number) => (
                            <div
                              key={imgIndex}
                              className="border border-gray-300 rounded-md overflow-hidden shadow-lg"
                            >
                              <img
                                src={image.url}
                                alt="color"
                                className="w-32 h-32 object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                            Không có ảnh
                          </div>
                        )}
                      </div>

                      {/* Album Images */}
                      <div className="flex flex-col items-start">
                        <div className="mb-2 text-sm font-semibold">Album ảnh:</div>
                        <div className="grid grid-cols-3 gap-4">
                          {variant.albumImages.map((image: any, imgIndex: number) => (
                            <div
                              key={imgIndex}
                              className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden shadow-lg"
                            >
                              <img
                                src={image.url}
                                alt="album"
                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;

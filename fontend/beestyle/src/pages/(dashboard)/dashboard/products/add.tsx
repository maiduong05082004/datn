import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Input, Select, Button, Checkbox, InputNumber, Space, Upload, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

interface variantProduct {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  content: string;
  input_day: string;
  category_id: number;
  is_collection: boolean;
  is_hot: boolean;
  is_new: boolean;
  group: variantProductGroup;
  variations: variantProductVariation[];
  images: string[];
}

interface variantProductGroup {
  id: number;
  name: string;
}

interface variantProductVariation {
  id: number;
  stock: number;
  attribute_value_image_variant: AttributeValueImageVariant;
  variation_values: VariationValue[];
  variation_album_images: string[];
}

interface AttributeValueImageVariant {
  id: number;
  value: string;
  image_path: string;
}

interface VariationValue {
  attribute_value_id: number;
  value: string;
  sku: string;
  stock: number;
  price: number;
  discount: number;
}

const AddProduct = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<any>('');

  const { data: variantgroup, isLoading: isLoadingVariantGroup } = useQuery({
    queryKey: ['variantgroup'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/attribute_groups');
      return response?.data;
    },
  });
  
  console.log(variantgroup?.attributes?.map(((attributes : any) => console.log(attributes))));

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/categories');
      return response?.data;
    },
  });



  const onFinish = (values: variantProduct) => {
    // Log dữ liệu form
    console.log('Form data:', values);

    // Log thêm nội dung CKEditor nếu có
    console.log('Content from CKEditor:', content);

    // Nếu muốn, bạn có thể log dữ liệu hoàn chỉnh trước khi gửi đi sau này
    const finalData = {
      ...values,
      content,
    };
    console.log('Final data to be sent:', finalData);
  };


  const handleVariantGroupChange = (e: any) => {
    setSelectedVariantGroup(e.taget.value);
  };

  if (isLoadingVariantGroup || isLoadingCategories) return <div>Loading...</div>;

  return (
    <>
      <div className="container mx-auto">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6">Thêm sản phẩm</h2>

        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ is_collection: false, is_hot: false, is_new: false }}
        >
          <Row gutter={16}>
            {/* Left Column (Thông tin sản phẩm) */}
            <Col span={12}>
              <h3 className="font-semibold text-lg">Thông tin sản phẩm</h3>
              <Form.Item<variantProduct>
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Tên sản phẩm bắt buộc phải điền" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<variantProduct>
                label="Slug"
                name="slug"
                rules={[{ required: true, message: "Slug sản phẩm bắt buộc phải điền" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<variantProduct>
                label="Giá sản phẩm"
                name="price"
                rules={[{ required: true, message: "Giá sản phẩm bắt buộc phải điền" }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item<variantProduct>
                label="Mô tả sản phẩm"
                name="description"
                rules={[{ required: true, message: "Mô tả sản phẩm bắt buộc phải điền" }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm ngắn gọn" />
              </Form.Item>

              <Form.Item<variantProduct>
                label="Nội dung chi tiết"
                name="content"
                rules={[{ required: true, message: "Nội dung chi tiết sản phẩm bắt buộc phải điền" }]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                />
              </Form.Item>

              <Form.Item<variantProduct>
                label="Ngày nhập"
                name="input_day"
                rules={[{ required: true, message: "Ngày nhập sản phẩm bắt buộc phải điền" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<variantProduct>
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: "Danh mục sản phẩm bắt buộc phải chọn" }]}
              >
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
              </Form.Item>

              <Form.Item name="is_collection" valuePropName="checked">
                <Checkbox>Bộ sưu tập</Checkbox>
              </Form.Item>

              <Form.Item name="is_hot" valuePropName="checked">
                <Checkbox>Nổi bật</Checkbox>
              </Form.Item>

              <Form.Item name="is_new" valuePropName="checked">
                <Checkbox>Sản phẩm mới</Checkbox>
              </Form.Item>

              {/* Upload images */}
              <Form.Item label="Hình ảnh sản phẩm">
                <Upload listType="picture" multiple>
                  <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>

            {/* Right Column (Biến thể sản phẩm) */}
            <Col span={12}>
              <div className="bg-green-100 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-green-700">Biến thể sản phẩm</h3>
                  <button className="text-green-700 underline font-bold">Không thêm biến thể</button>
                </div>

                <div className="mt-4">
                  <label className="font-bold block mb-2">Chọn nhóm biến thể</label>
                  <select
                    id="variant_group"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    onClick={(e)=> handleVariantGroupChange(e)}
                  >
                    <option value="">Chọn nhóm biến thể</option>
                    {Object.entries(variantgroup).map(([groupId, group]: any) => (
                      <option key={groupId} value={group.group_name}>
                        {group.group_name}
                      </option>
                    ))}
                  </select>
                </div>
                    {variantgroup?.map((variant : any) => variant.attributes)}
                    <h2>{}</h2>
                    
                <div className={`mt-4`}>
                  <label className="font-bold block mb-2">Màu Sắc</label>
                  <select className="w-full p-2 border border-black rounded-md">
                    <option>Xanh lá cây</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                <h4 className="text-lg font-bold mb-4">Thông tin biến thể cho màu: Xanh lá cây</h4>

                {/* Size, Quantity, Discount, Remove */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="w-8 font-bold">S</label>
                    <input type="number" placeholder="Số lượng" className="w-24 p-2 border rounded-md" />
                    <input type="number" placeholder="Giảm giá (%)" className="w-24 p-2 border rounded-md" />
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">Xóa</button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-8 font-bold">M</label>
                    <input type="number" placeholder="Số lượng" className="w-24 p-2 border rounded-md" />
                    <input type="number" placeholder="Giảm giá (%)" className="w-24 p-2 border rounded-md" />
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">Xóa</button>
                  </div>

                  {/* Repeat for other sizes */}
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <div>
                    <label className="font-bold block mb-2">Ảnh Màu</label>
                    <input type="file" className="block" />
                  </div>
                  <div>
                    <label className="font-bold block mb-2">Album ảnh</label>
                    <input type="file" multiple className="block" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;

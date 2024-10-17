import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Input, Button, Checkbox, InputNumber, Upload, Row, Col, DatePicker } from 'antd';
import { MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { FormProps } from 'react-hook-form';

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
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>(''); 
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [sizeData, setSizeData] = useState<any[]>([]); 
  const [fileList, setFileList] = useState<any[]>([]); 
  const [albumList, setAlbumList] = useState<any[]>([]); 
  const [customColor, setCustomColor] = useState<string>(''); 
  const [customColors, setCustomColors] = useState<string[]>([]); 
  const [showVariantForm, setShowVariantForm] = useState<boolean>(true);

  const { data: variantgroup, isLoading: isLoadingVariantGroup } = useQuery({
    queryKey: ['variantgroup'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/attribute_groups');
      return response?.data?.variation;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/categories');
      return response?.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (data: variantProduct) => {
      const response = await axios.post('http://localhost:8000/api/admins/products', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công!');
      form.resetFields();
      setContent('');
      setSelectedVariantGroup(null);
      setSelectedColor('');
      setAvailableSizes([]);
      setSizeData([]);
      setFileList([]);
      setAlbumList([]);
      setCustomColors([]);
      setShowVariantForm(true);
    },
    onError: (error) => {
      toast.error('Thêm sản phẩm thất bại!');
      console.error(error);
    },
  })

  const handleVariantGroupChange = (e: any) => {
    const groupId = e.target.value;
    const selectedGroup = variantgroup.find((group: any) => group.group_id === parseInt(groupId));
    setSelectedVariantGroup(selectedGroup);
    setSelectedColor('');
    setAvailableSizes([]);
  };

  const handleColorChange = (e: any) => {
    const color = e.target.value;
    setSelectedColor(color);

    const sizeAttribute = selectedVariantGroup?.attributes.find(
      (attribute: any) =>
        attribute.name.toLowerCase().includes('kích thước') ||
        attribute.name.toLowerCase().includes('size')
    );


    if (sizeAttribute) {
      setAvailableSizes(sizeAttribute.attribute_values);
      const initialSizeData = sizeAttribute.attribute_values.map((size: any) => ({
        sizeId: size.id, // Thêm ID cho kích thước
        sizeValue: size.value,
        stock: 0,
        discount: 0,
      }));
      setSizeData(initialSizeData);
    }
  };

  const handleStockChange = (sizeId: number, value: number) => {
    const newSizeData = sizeData.map((data) =>
      data.sizeId === sizeId ? { ...data, stock: value } : data
    );
    setSizeData(newSizeData);
  };

  const handleDiscountChange = (sizeId: number, value: number) => {
    const newSizeData = sizeData.map((data) =>
      data.sizeId === sizeId ? { ...data, discount: value } : data
    );
    setSizeData(newSizeData);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleAlbumChange = ({ fileList }: any) => {
    setAlbumList(fileList);
  };

  const toggleVariantForm = () => {
    setShowVariantForm(!showVariantForm);
  };
  const onFinish = (values: any) => {
    const variationsData: any = {};

    sizeData.forEach((curr: any) => {
      const { sizeId, stock, discount } = curr;

      if (!variationsData[selectedColor]) {
        variationsData[selectedColor] = {};
      }

      variationsData[selectedColor][sizeId] = { stock, discount };
    });

    const imageFields = {
      [`color_image_${selectedColor}`]: fileList.length > 0 ? fileList[0].url || '' : '',

      [`album_images_${selectedColor}`]: albumList.map(file => file.url || '').filter(url => url !== ''),
    };




    const formattedDate = values.input_day ? values.input_day.format('YYYY-MM-DD') : null;

    const finalData = {
      ...values,
      input_day: formattedDate,
      content,
      variations: JSON.stringify(variationsData),
      group_id: selectedVariantGroup?.group_id,
      ...imageFields,
    };

    console.log("Final data to be sent:", finalData);

    mutate(finalData);
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
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Tên sản phẩm bắt buộc phải điền" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Giá sản phẩm"
                name="price"
                rules={[{ required: true, message: "Giá sản phẩm bắt buộc phải điền" }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Mô tả sản phẩm"
                name="description"
                rules={[{ required: true, message: "Mô tả sản phẩm bắt buộc phải điền" }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm ngắn gọn" />
              </Form.Item>

              <Form.Item
                label="Nội dung chi tiết"
                name="content"
                rules={[{ required: true, message: "Nội dung chi tiết sản phẩm bắt buộc phải điền" }]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Ngày nhập"
                name="input_day"
                rules={[{ required: true, message: "Ngày nhập sản phẩm bắt buộc phải điền" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: "Danh mục sản phẩm bắt buộc phải chọn" }]}
              >
                <select id="category" className="border rounded-lg p-2">
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
            </Col>

            <Col span={12}>
              <div className="bg-green-100 p-6 rounded-lg mb-8 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-green-800">Biến thể sản phẩm</h3>
                  <Button onClick={toggleVariantForm} type="default">
                    {showVariantForm ? 'Ẩn Biến Thể' : 'Hiện Biến Thể'}
                  </Button>
                </div>

                {showVariantForm && (
                  <>
                    <div className="mt-4">
                      <label className="font-bold block mb-2 text-gray-700">Chọn nhóm biến thể</label>
                      <select
                        name="group_id"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        onChange={handleVariantGroupChange}
                      >
                        <option value="">Chọn nhóm biến thể</option>
                        {variantgroup?.map((group: any) => (
                          <option key={group.group_id} value={group.group_id}>
                            {group.group_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedVariantGroup && (
                      <div className="mt-4">
                        <label className="font-bold block mb-2 text-gray-700">Chọn Màu Sắc</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" onChange={handleColorChange}>
                          <option value="">Chọn Màu Sắc</option>
                          {selectedVariantGroup.attributes
                            .filter((attribute: any) => attribute.name === 'Màu Sắc')
                            .flatMap((attribute: any) =>
                              attribute.attribute_values.map((color: any) => (
                                <option key={color.id} value={color.id}>
                                  {color.value}
                                </option>
                              ))
                            )}
                          {customColors.map((color, index) => (
                            <option key={index} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>

                        <div className="mt-2">
                          <Input
                            placeholder="Thêm màu sắc mới"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                          />
                          <Button
                            type="primary"
                            className="mt-5"
                            onClick={() => {
                              if (customColor) {
                                setCustomColors([...customColors, customColor]);
                                setSelectedColor(customColor);
                                setAvailableSizes([]);
                                setSizeData([]);
                                setCustomColor('');
                              }
                            }}
                          >
                            Thêm Màu
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedColor && availableSizes.length > 0 && (
                      <div className="mt-4">
                        <label className="font-bold block mb-2 text-gray-700">Kích thước, Số lượng, Giảm giá</label>
                        {availableSizes.map((size: any) => (
                          <div key={size.id} className="flex justify-between items-center space-x-4 mb-4">
                            <label htmlFor="Kích Thước" className="text-gray-600">Kích Thước</label>
                            <Checkbox>{size.value}</Checkbox>
                            <InputNumber
                              placeholder="Số lượng"
                              min={0}
                              className="w-24 border border-gray-300 rounded-md p-1"
                              onChange={(value: any) => handleStockChange(size.id, value)}
                            />
                            <InputNumber
                              placeholder="Giảm giá (%)"
                              min={0}
                              max={100}
                              className="w-24 border border-gray-300 rounded-md p-1"
                              onChange={(value: any) => handleDiscountChange(size.id, value)}
                            />
                            <Button type="primary" icon={<MinusCircleOutlined />} className="bg-red-500 hover:bg-red-600">
                              Xóa
                            </Button>
                          </div>
                        ))}

                        <div className="flex items-center justify-between space-x-4 mt-4">
                          <div>
                            <label className="font-bold block mb-2 text-gray-700">Ảnh Màu</label>
                            <Upload
                              listType="picture"
                              fileList={fileList}
                              onChange={handleUploadChange}
                              beforeUpload={() => false}
                            >
                              <Button icon={<UploadOutlined />} className="bg-blue-500 hover:bg-blue-600">Tải lên ảnh màu</Button>
                            </Upload>
                          </div>
                          <div>
                            <label className="font-bold block mb-2 text-gray-700">Album ảnh</label>
                            <Upload
                              listType="picture"
                              multiple
                              fileList={albumList}
                              onChange={handleAlbumChange}
                              beforeUpload={() => false}
                            >
                              <Button icon={<UploadOutlined />} className="bg-blue-500 hover:bg-blue-600">Tải lên album ảnh</Button>
                            </Upload>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!showVariantForm && (
                  <>
                    <div className="mt-4">
                      <Form.Item
                        label="Nhập số lượng sản phẩm"
                        name="stock"
                        rules={[{ required: true, message: 'Số lượng sản phẩm là bắt buộc' }]}
                      >
                        <InputNumber
                          placeholder="Số lượng"
                          min={0}
                          className="w-24 border border-gray-300 rounded-md p-1"
                        />
                      </Form.Item>
                    </div>

                    <div className="mt-4">
                      <Form.Item
                        label="Tải lên album ảnh"
                        name="variation_album_images"
                      >
                        <Upload
                          listType="picture"
                          multiple
                          fileList={albumList}
                          onChange={handleAlbumChange}
                          beforeUpload={() => false}
                        >
                          <Button icon={<UploadOutlined />} className="bg-blue-500 hover:bg-blue-600">Tải lên album ảnh</Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" className='bg-black' htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;

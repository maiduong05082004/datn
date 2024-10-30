import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Input, Button, Checkbox, InputNumber, Upload, Row, Col, DatePicker, Spin, Select, Table, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface VariantProduct {
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
  group: VariantProductGroup;
  variations: VariantProductVariation[];
  images: string[];
}

interface VariantProductGroup {
  id: number;
  name: string;
}

interface VariantProductVariation {
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

const AddProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<VariantProductGroup | null>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [stock, setStock] = useState<number | null>(null);
  const [albumList, setAlbumList] = useState<any[]>([]);
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
    mutationFn: async (data: VariantProduct) => {
      const response = await axios.post('http://localhost:8000/api/admins/products', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công!');
      form.resetFields();
      setContent('');
      setSelectedVariantGroup(null);
      setAttributes([]);
      setVariants([]);
      setFileList([]);
      setAlbumList([]);
    },
    onError: (error) => {
      console.error('Lỗi khi thêm sản phẩm:', error);
      toast.error('Thêm sản phẩm thất bại!');
    },
  });

  useEffect(() => {
    if (selectedVariantGroup && variantgroup) {
      const selectedGroup = variantgroup.find((group: any) => group.group_id === selectedVariantGroup);
      if (selectedGroup) {
        setAttributes(selectedGroup.attributes.map((attribute: any) => ({ ...attribute, values: [] })));
      }
    }
  }, [selectedVariantGroup, variantgroup]);


  const handleAttributeValueChange = (index: number, selectedIds: number[]) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].selectedValues = selectedIds;
    setAttributes(updatedAttributes);
  };

  const generateVariants = () => {
    const colorAttribute = attributes.find(attr => attr.name.toLowerCase().includes('màu sắc'));
    const sizeAttribute = attributes.find(attr => attr.name.toLowerCase().includes('kích thước'));
  
    if (!colorAttribute || !sizeAttribute) {
      toast.error('Thiếu thuộc tính Màu Sắc hoặc Kích Thước');
      return;
    }
  
    const newVariants = colorAttribute.selectedValues.map((color: any) => ({
      colorId: color.id,
      colorName: color.value,
      sizes: sizeAttribute.selectedValues.map((size: any) => ({
        sizeId: size.id,  
        size: size.value,
        stock: 0,
        discount: 0,
      })),
      colorImage: [],
      albumImages: [],
    }));
  
    setVariants(newVariants);
  };
  


  const handleVariantChange = (colorId: number, key: string, index: number, subKey: string, value: any) => {
    const updatedVariants = [...variants];
    const variant = updatedVariants.find((v) => v.colorId === colorId);
    if (variant) {
      variant[key][index][subKey] = value;
    }
    setVariants(updatedVariants);
  };


  const handleStockChange = (value: number | null) => {
    setStock(value);
    form.setFieldsValue({ stock: value });
  };


  // const handleAlbumChange = ({ fileList }: any) => {
  //   setAlbumList(fileList);
  // };
  const handleAlbumChange2 = ({ fileList }: any) => {
    setAlbumList(fileList.map((item: any) => item.name));
  };

  const handleUploadChangeForVariant = (index: number, key: string, { fileList }: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = fileList;
    setVariants(updatedVariants);
  };
  // ẩn hiện
  const toggleVariantForm = () => {
    setShowVariantForm(!showVariantForm);
  };

  const columns = [
    {
      title: 'Màu Sắc',
      dataIndex: 'colorName',
      key: 'colorName',
    },
    {
      title: 'Kích Thước',
      dataIndex: 'sizes',
      key: 'sizes',
      render: (sizes: any[], record: any) => (
        sizes.map((size, index) => (
          <div key={index} className="flex items-center gap-3 mb-3">
            <span className="font-semibold w-20">{size.size}</span>
            <InputNumber
              onChange={(value) => handleVariantChange(record.colorId, 'sizes', index, 'stock', value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Số Lượng"
            />
            <InputNumber
              max={100}
              onChange={(value) => handleVariantChange(record.colorId, 'sizes', index, 'discount', value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Giảm Giá (%)"
            />
          </div>
        ))
      ),
    }
    ,
    {
      title: 'Ảnh Màu',
      dataIndex: 'colorImage',
      key: 'colorImage',
      render: (_: any, record: any, index: any) => (
        <Upload
          listType="picture"
          fileList={record.colorImage || []}
          onChange={(info) => handleUploadChangeForVariant(index, 'colorImage', info)}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Tải lên ảnh màu</Button>
        </Upload>
      ),
    },
    {
      title: 'Album Ảnh',
      dataIndex: 'albumImages',
      key: 'albumImages',
      render: (_: any, record: any, index: any) => (
        <Upload
          listType="picture"
          multiple
          fileList={record.albumImages || []}
          onChange={(info) => handleUploadChangeForVariant(index, 'albumImages', info)}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Tải lên album ảnh</Button>
        </Upload>
      ),
    },
  ];


  const onFinish = (values: any) => {
    const formattedDate = values.input_day ? values.input_day.format('YYYY-MM-DD') : null;
  
    if (!showVariantForm) {
      const imageFields = {
        album_images: albumList,
        color_image: fileList.length > 0 ? fileList[0].name : null,
      };

      const simpleProductPayload = {
        ...values,
        stock: stock !== null ? stock : values.stock,
        input_day: formattedDate,
        content: content || '',
        group_id: null,
        variations: '[]',
        is_collection: values.is_collection || false,
        is_hot: values.is_hot || false,
        is_new: values.is_new || false,
        ...imageFields,
      };

      console.log('Simple Product Payload:', simpleProductPayload)

      mutate(simpleProductPayload);
      return;
    }
    // Xử lý sản phẩm có biến thể
    if (!selectedVariantGroup) {
      toast.error('Vui lòng chọn nhóm biến thể!');
      return;
    }
  
    if (variants.length === 0) {
      toast.error('Vui lòng tạo ít nhất một biến thể!');
      return;
    }
  
    // Chuẩn bị dữ liệu biến thể
    const variationsData = variants.reduce((acc, variant) => {
      const colorId = variant.colorId;
      const sizeData = variant.sizes.reduce((sizeAcc: any, size: any) => {
        sizeAcc[size.sizeId] = {
          stock: size.stock ?? 0,
          discount: size.discount ?? 0,
        };
        return sizeAcc;
      }, {});
  
      if (Object.keys(sizeData).length > 0) {
        acc[colorId] = sizeData;
      }
      return acc;
    }, {});
  
    console.log('Variations Data:', variationsData); // Debug dữ liệu biến thể
  
    const imageFields = variants.reduce((acc: any, variant: any) => {
      const colorId = variant.colorId || variant.id;
      acc[`color_image_${colorId}`] = variant.colorImage?.[0]?.name || null;
      acc[`album_images_${colorId}`] = variant.albumImages?.map((file: any) => file.name) || [];
      return acc;
    }, {});
  
    const productWithVariantsPayload = {
      ...values,
      input_day: formattedDate,
      content: content || '',
      group_id: selectedVariantGroup,
      variations: JSON.stringify(variationsData),
      ...imageFields,
      is_collection: values.is_collection || false,
      is_hot: values.is_hot || false,
      is_new: values.is_new || false,
    };
  
    console.log('Product with Variants Payload:', productWithVariantsPayload); // Debug dữ liệu
  
    // Gọi API với payload sản phẩm có biến thể
    mutate(productWithVariantsPayload);
  };
  
  if (isLoadingVariantGroup || isLoadingCategories) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      <div className="w-full px-6 py-8">
        <ToastContainer />
        <h2 className="text-4xl font-bold mb-6">Thêm sản phẩm</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Tên sản phẩm bắt buộc' }]}
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
            <Select id="category" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal">
              <option value="" className="text-gray-500">--Chọn danh mục--</option>
              {categories?.map((category: any) => (
                <optgroup key={category.id} label={category.name} className="text-gray-600 font-medium">
                  {category.children_recursive?.map((child: any) => (
                    <option key={child.id} value={child.id} className="text-gray-700 font-normal">
                      {child.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Form.Item>



          <div className='flex gap-5'>
            <Form.Item name="is_collection" valuePropName="checked" initialValue={false}>
              <Checkbox>Bộ sưu tập</Checkbox>
            </Form.Item>

            <Form.Item name="is_hot" valuePropName="checked" initialValue={false}>
              <Checkbox>Nổi bật</Checkbox>
            </Form.Item>

            <Form.Item name="is_new" valuePropName="checked" initialValue={false}>
              <Checkbox>Sản phẩm mới</Checkbox>
            </Form.Item>
          </div>
          <Button onClick={toggleVariantForm} type="default">
            {showVariantForm ? 'Ẩn Biến Thể' : 'Hiện Biến Thể'}
          </Button>
          {showVariantForm && (
            <>
              <Form.Item
                label="Chọn nhóm biến thể"
                name="variant_group"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm biến thể' }]}
              >
                <Select placeholder="Chọn nhóm biến thể" onChange={setSelectedVariantGroup}>
                  {variantgroup?.map((group: any) => (
                    <Option key={group.group_id} value={group.group_id}>
                      {group.group_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {attributes
                .sort((a, b) => {
                  if (a.name.toLowerCase().includes('màu sắc')) return -1;
                  if (b.name.toLowerCase().includes('màu sắc')) return 1;
                  return 0;
                })
                .map((attribute, index) => (
                  <Form.Item key={attribute.id} label={`Thuộc Tính (${attribute.name})`}>
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Nhập giá trị cho Màu Sắc"
                      onChange={(values) =>
                        handleAttributeValueChange(index, values.map((value: any) => ({ id: value.key, value: value.label })))
                      }
                      labelInValue
                    >
                      {attribute.attribute_values.map((val: any) => (
                        <Option key={val.id} value={val.value}>
                          {val.value}
                        </Option>
                      ))}
                    </Select>

                  </Form.Item>
                ))}


              <Button type="default" className='mb-5' onClick={generateVariants} icon={<PlusOutlined />}>
                Tạo Biến Thể
              </Button>

              <Table
                dataSource={variants}
                columns={columns}
                rowKey={(_, index: any) => index.toString()}
                pagination={false}
                className="w-full border-collapse border border-gray-300"
              />
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
                    value={stock}
                    className="w-full border border-gray-300 rounded-md p-2"
                    onChange={handleStockChange}
                    min={0}
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
                    onChange={handleAlbumChange2}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />} className="bg-green-500 hover:bg-green-600 text-white">
                      Tải lên album ảnh
                    </Button>
                  </Upload>
                </Form.Item>
              </div>

            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white mt-5">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;

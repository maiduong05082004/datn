import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Input, Button, Checkbox, InputNumber, Upload, DatePicker, Spin, Select, Table } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface VariantProduct {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  stock?: number | null;
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

interface Attribute {
  id: number;
  name: string;
  attribute_type: number;
  attribute_values: AttributeValue[];
  selectedValues: number[];
}

interface AttributeValue {
  id: number;
  value: string;
}

interface Variant {
  attributeName: string;
  attributeValue: string;
  combinations: Combination[];
  colorImage: any[];
  albumImages: any[];
  attributes?: { 
    stock: number;
    discount: number;
    attributeId: number;
  }[];
}


interface Combination {
  sizeId: number;
  size: string;
  stock: number;
  discount: number;
}

const AddProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<VariantProductGroup | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [stock, setStock] = useState<number | null>(null);
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
        const sortedAttributes = selectedGroup.attributes.sort((a: any, b: any) => {
          return a.attribute_type === 0 ? -1 : b.attribute_type === 0 ? 1 : 0;
        });
        setAttributes(sortedAttributes.map((attribute: any) => ({ ...attribute, selectedValues: [] })));
      }
    }
  }, [selectedVariantGroup, variantgroup]);

  const handleAttributeValueChange = (index: number, selectedIds: number[]) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].selectedValues = selectedIds;
    setAttributes(updatedAttributes);
  };
  const handleResetImage = (index: number, field: string) => {
    if (field === 'colorImage') {
      // Reset ảnh màu về rỗng
      const updatedVariants = [...variants];
      updatedVariants[index].colorImage = [];
      setVariants(updatedVariants);
    } else if (field === 'albumImages') {
      // Reset album ảnh về rỗng
      const updatedVariants = [...variants];
      updatedVariants[index].albumImages = [];
      setVariants(updatedVariants);
    }
  };
  const handleAlbumChange2 = ({ fileList }: any) => {
    const updatedAlbumList = fileList.map((file: any) => {
      if (file.response && file.response.url) {
        return {
          ...file,
          url: file.response.url,
        };
      }
      return file;
    });

    setAlbumList(updatedAlbumList);
  };

  const generateVariants = () => {
    const primaryAttribute = attributes.find((attr) => attr.attribute_type === 0);
    const otherAttributes = attributes.filter((attr) => attr.attribute_type !== 0);

    if (!primaryAttribute || otherAttributes.length === 0) {
      toast.error('Thiếu thuộc tính chính hoặc các thuộc tính khác để tạo biến thể');
      return;
    }

    const newVariants: Variant[] = primaryAttribute.selectedValues.flatMap((primaryValueId) => {
      const primaryValue = primaryAttribute.attribute_values.find((val) => val.id === primaryValueId);
      if (!primaryValue) return [];

      const combinations: Combination[] = otherAttributes.flatMap((attribute) => {
        return attribute.selectedValues.map((valueId) => {
          const value = attribute.attribute_values.find((val) => val.id === valueId);
          return {
            sizeId: value?.id || 0,
            size: value?.value || '',
            stock: 0,
            discount: 0,
          };
        });
      });

      return {
        attributeName: primaryAttribute.name,
        attributeValue: primaryValue.value,
        combinations,
        colorImage: [],
        albumImages: [],
      };
    });

    setVariants(newVariants);
  };

  const handleUploadChangeForVariant = (index: number, key: 'colorImage' | 'albumImages', { fileList }: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = fileList;
    setVariants(updatedVariants);
  };

  const toggleVariantForm = () => {
    setShowVariantForm(!showVariantForm);
  };

  const onFinish = (values: any) => {
    // const formData = new FormData();
    // const formattedDate = values.input_day ? values.input_day.format('YYYY-MM-DD') : null;
  
    // // Logging for debugging
    // console.log("Received form values:", values);
    // console.log("Album list:", albumList);
  
    // // Handling products without variants
    // if (!showVariantForm) {
    //   albumList.forEach((file: any, index: number) => {
    //     if (file.originFileObj) {
    //       formData.append(`album_images[${index}]`, file.originFileObj);
    //     }
    //   });
  
    //   formData.append('name', values.name);
    //   formData.append('price', values.price);
    //   formData.append('description', values.description);
    //   formData.append('content', content || '');
    //   formData.append('input_day', formattedDate);
    //   formData.append('category_id', values.category_id);
    //   formData.append('stock', stock?.toString() || '0');
    //   formData.append('is_collection', values.is_collection ? '1' : '0');
    //   formData.append('is_hot', values.is_hot ? '1' : '0');
    //   formData.append('is_new', values.is_new ? '1' : '0');
  
    //   console.log("FormData for simple product:", formData);
    //   mutate(formData as any);
    //   return;
    // }
  
    // // Handling products with variants
    // if (showVariantForm) {
    //   console.log("Variants before processing:", variants);
  
    //   if (!selectedVariantGroup) {
    //     toast.error('Please select a variant group!');
    //     return;
    //   }
  
    //   if (variants.length === 0) {
    //     toast.error('Please create at least one variant!');
    //     return;
    //   }
  
    //   // Prepare payload for product with variants
    //   const validVariants = variants.map((variant) => {
    //     const validAttributes = variant.attributes.filter(
    //       (attribute: any) => attribute.stock !== undefined && attribute.stock > 0
    //     );
  
    //     if (validAttributes.length === 0) {
    //       return null;
    //     }
  
    //     return {
    //       ...variant,
    //       attributes: validAttributes,
    //     };
    //   }).filter(Boolean);
  
    //   if (validVariants.length === 0) {
    //     toast.error('Please fill out information for at least one variant and attribute!');
    //     return;
    //   }
  
    //   const variationsData = validVariants.reduce((acc, variant) => {
    //     const primaryAttributeId = variant.primaryAttributeId;
    //     const attributeData = variant.attributes.reduce((attrAcc: any, attribute: any) => {
    //       attrAcc[attribute.attributeId] = {
    //         stock: attribute.stock ?? 0,
    //         discount: attribute.discount ?? 0,
    //       };
    //       return attrAcc;
    //     }, {});
  
    //     if (Object.keys(attributeData).length > 0) {
    //       acc[primaryAttributeId] = attributeData;
    //     }
    //     return acc;
    //   }, {});
  
    //   // Add variant images to formData
    //   validVariants.forEach((variant: any) => {
    //     const primaryAttributeId = variant.primaryAttributeId;
    //     if (variant.primaryImage?.[0]?.originFileObj) {
    //       formData.append(`primary_image_${primaryAttributeId}`, variant.primaryImage[0].originFileObj);
    //     }
    //     variant.albumImages?.forEach((file: any, index: number) => {
    //       if (file.originFileObj) {
    //         formData.append(`album_images_${primaryAttributeId}[${index}]`, file.originFileObj);
    //       }
    //     });
    //   });
  
    //   // Add other fields to formData
    //   formData.append('name', values.name);
    //   formData.append('price', values.price);
    //   formData.append('description', values.description);
    //   formData.append('content', content || '');
    //   formData.append('input_day', formattedDate);
    //   formData.append('category_id', values.category_id);
    //   formData.append('group_id', selectedVariantGroup?.toString() || '');
    //   formData.append('variations', JSON.stringify(variationsData));
    //   formData.append('is_collection', values.is_collection ? '1' : '0');
    //   formData.append('is_hot', values.is_hot ? '1' : '0');
    //   formData.append('is_new', values.is_new ? '1' : '0');
  
    //   console.log("FormData for product with variants:", formData);
    //   mutate(formData as any);
    // }
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
            <Select placeholder="Chọn danh mục">
              {categories?.map((category: { id: number; name: string }) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
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
                  {variantgroup?.map((group: { group_id: number; group_name: string }) => (
                    <Option key={group.group_id} value={group.group_id}>
                      {group.group_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {attributes.map((attribute, index) => (
                <Form.Item key={attribute.id} label={`Thuộc Tính (${attribute.name})`}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder={`Nhập giá trị cho ${attribute.name}`}
                    onChange={(values: { key: string; label: string }[]) =>
                      handleAttributeValueChange(index, values.map((value) => Number(value.key)))
                    }
                    labelInValue
                  >
                    {attribute.attribute_values.map((val) => (
                      <Option key={val.id} value={val.id}>
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
                columns={[
                  {
                    title: attributes.length > 0 ? attributes[0].name : 'Thuộc Tính',
                    dataIndex: 'attributeValue',
                    key: 'attributeValue',
                  },
                  {
                    title: 'Thông tin ',
                    dataIndex: 'combinations',
                    key: 'combinations',
                    render: (combinations: Combination[], record, index) => (
                      combinations.map((combination, combinationIndex) => (
                        <div key={combinationIndex} className="flex items-center gap-3 mb-3">
                          <span className="font-semibold w-20">{combination.size}</span>
                          <InputNumber
                            min={0}
                            onChange={(value) => {
                              const updatedVariants = [...variants];
                              updatedVariants[index].combinations[combinationIndex].stock = value || 0;
                              setVariants(updatedVariants);
                            }}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Số Lượng"
                          />
                          <InputNumber
                            max={100}
                            onChange={(value) => {
                              const updatedVariants = [...variants];
                              updatedVariants[index].combinations[combinationIndex].discount = value || 0;
                              setVariants(updatedVariants);
                            }}
                            className="w-full border border-gray-300 rounded-md p-2"
                            placeholder="Giảm Giá (%)"
                          />
                        </div>
                      ))
                    ),
                  },
                  {
                    title: 'Ảnh Màu',
                    dataIndex: 'colorImage',
                    key: 'colorImage',
                    render: (_: any, record: any, index: any) => (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white">
                        <Upload
                          listType="picture-card"
                          fileList={record.colorImage || []}
                          onChange={(info) => handleUploadChangeForVariant(index, 'colorImage', info)}
                          beforeUpload={() => false}
                          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false }}
                          className="upload-inline"
                        >
                          {record.colorImage?.length < 1 && (
                            <div className="w-20 h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                              <UploadOutlined className="text-blue-500 text-xl" />
                            </div>
                          )}
                        </Upload>
                        <Button
                          type="dashed"
                          danger
                          className="mt-2 w-full"
                          onClick={() => handleResetImage(index, 'colorImage')}
                        >
                          Reset Ảnh Màu
                        </Button>
                      </div>
                    ),
                  },
                  {
                    title: 'Album Ảnh',
                    dataIndex: 'albumImages',
                    key: 'albumImages',
                    render: (_: any, record: any, index: any) => (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white">
                        <Upload
                          listType="picture-card"
                          multiple
                          fileList={record.albumImages || []}
                          onChange={(info) => handleUploadChangeForVariant(index, 'albumImages', info)}
                          beforeUpload={() => false}
                          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false }}
                          className="upload-inline"
                        >
                          {record.albumImages?.length < 3 && (
                            <div className="w-20 h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                              <UploadOutlined className="text-green-500 text-xl" />
                            </div>
                          )}
                        </Upload>
                        <Button
                          type="dashed"
                          danger
                          className="mt-2 w-full"
                          onClick={() => handleResetImage(index, 'albumImages')}
                        >
                          Reset Album Ảnh
                        </Button>
                      </div>
                    ),
                  },
                ]}
                rowKey={(_, index = 0) => index.toString()}
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
                    onChange={(value) => {
                      setStock(value);
                      form.setFieldsValue({ stock: value });
                    }}
                    min={0}
                  />
                </Form.Item>

              </div>
              <div className="mt-4">
                <Form.Item
                  label="Tải lên album ảnh"
                  name="album_images"
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

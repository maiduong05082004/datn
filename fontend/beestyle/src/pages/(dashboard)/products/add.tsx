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
  // Xử lý khi chọn nhóm biến thể
  useEffect(() => {
    if (selectedVariantGroup && variantgroup) {
      const selectedGroup = variantgroup.find((group: any) => group.group_id === selectedVariantGroup);
      if (selectedGroup) {
        setAttributes(selectedGroup.attributes.map((attribute: any) => ({ ...attribute, values: [] })));
      }
    }
  }, [selectedVariantGroup, variantgroup]);

  // xử lý thay đổi giá trị thuộc tính
  const handleAttributeValueChange = (index: number, selectedIds: number[]) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].selectedValues = selectedIds;
    setAttributes(updatedAttributes);
  };
  // reset ảnh 
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

  // tạo biến thể từ thuộc tính "Màu Sắc" và "Kích Thước"
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
  // thay đổi giá trị biến thể (số lượng, giảm giá, ảnh)
  const handleVariantChange = (colorId: number, key: string, index: number, subKey: string, value: any) => {
    const updatedVariants = [...variants];
    const variant = updatedVariants.find((v) => v.colorId === colorId);
    if (variant) {
      variant[key][index][subKey] = value;
    }
    setVariants(updatedVariants);
  };
  // xử lý khi tải lên ảnh biến thể
  const handleUploadChangeForVariant = (index: number, key: string, { fileList }: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = fileList;
    setVariants(updatedVariants);
  };
  // Hàm xử lý thay đổi album ảnh
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

  // Hàm ẩn/hiện form biến thể
  const toggleVariantForm = () => {
    setShowVariantForm(!showVariantForm);
  };
  // Cột dữ liệu cho bảng biến thể
  const columns = [
    {
      title: 'Màu Sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      render: (colorName: string) => (
        <span className="text-lg font-semibold text-gray-700">{colorName}</span>
      ),
    },
    {
      title: 'Kích Thước',
      dataIndex: 'sizes',
      key: 'sizes',
      render: (sizes: any[], record: any) => (
        <div className="grid grid-cols-2 gap-4">
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <span className="font-semibold text-gray-600 w-10">{size.size}</span>
              <InputNumber
                min={0}
                onChange={(value) => handleVariantChange(record.colorId, 'sizes', index, 'stock', value)}
                className="border border-gray-300 rounded-md p-1 w-28"
                placeholder="Số Lượng"
              />
              <InputNumber
                min={0}
                max={100}
                onChange={(value) => handleVariantChange(record.colorId, 'sizes', index, 'discount', value)}
                className="border border-gray-300 rounded-md p-1 w-28"
                placeholder="Giảm Giá (%)"
              />
            </div>
          ))}
        </div>
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
  ];



  //  xử lý khi submit form
  const onFinish = (values: any) => {
    const formattedDate = values.input_day ? values.input_day.format('YYYY-MM-DD') : null;

    if (!showVariantForm) {
      // Chuẩn bị album images URLs
      const albumImagesUrls = albumList.map((file: any) => {
        if (file.response && file.response.url) {
          return file.response.url;
        } else if (file.url) {
          return file.url;
        } else {
          return file.name;
        }
      });

      const simpleProductPayload = {
        ...values,
        stock: stock || 0,
        input_day: formattedDate,
        content: content || '',
        group_id: null,
        is_collection: values.is_collection || false,
        is_hot: values.is_hot || false,
        is_new: values.is_new || false,
        album_images: albumImagesUrls,
      };

      console.log('Payload cho sản phẩm đơn giản:', simpleProductPayload);
      mutate(simpleProductPayload);
      return;
    }

    // Xử lý cho sản phẩm có biến thể
    if (showVariantForm) {
      if (!selectedVariantGroup) {
        toast.error('Vui lòng chọn nhóm biến thể!');
        return;
      }

      if (variants.length === 0) {
        toast.error('Vui lòng tạo ít nhất một biến thể!');
        return;
      }

      // Chuẩn bị payload cho sản phẩm có biến thể
      const validVariants = variants.map((variant) => {
        const validSizes = variant.sizes.filter(
          (size: any) => size.stock !== undefined && size.stock > 0
        );

        if (validSizes.length === 0) {
          return null;
        }

        return {
          ...variant,
          sizes: validSizes,
        };
      }).filter(Boolean);

      if (validVariants.length === 0) {
        toast.error('Vui lòng điền đầy đủ thông tin cho ít nhất một biến thể và kích thước!');
        return;
      }

      const variationsData = validVariants.reduce((acc, variant) => {
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

      const imageFields = validVariants.reduce((acc: any, variant: any) => {
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

      console.log('Payload cho sản phẩm có biến thể:', productWithVariantsPayload);

      mutate(productWithVariantsPayload);
    }
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
            rules={[
              { required: true, message: 'Tên sản phẩm bắt buộc' },
              { min: 5, message: 'Tên sản phẩm phải có ít nhất 5 ký tự' },
              { max: 50, message: 'Tên sản phẩm không được quá 50 ký tự' },
              {
                pattern: /^[A-Za-z0-9\s]+$/,
                message: 'Tên sản phẩm chỉ được chứa ký tự chữ và số',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá sản phẩm"
            name="price"
            rules={[
              { required: true, message: 'Giá sản phẩm bắt buộc phải điền' },
              { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
              { type: 'number', max: 1000000, message: 'Giá không được vượt quá 1,000,000' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Mô tả sản phẩm"
            name="description"
            rules={[
              { required: true, message: 'Mô tả sản phẩm bắt buộc' },
              { min: 20, message: 'Mô tả sản phẩm phải có ít nhất 20 ký tự' },
            ]}
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
            <select id="category" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal">
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
            </select>
          </Form.Item>

          <div className='flex gap-5'>
            <Form.Item name="is_collection" valuePropName="checked">
              <Checkbox>Bộ sưu tập</Checkbox>
            </Form.Item>

            <Form.Item name="is_hot" valuePropName="checked">
              <Checkbox>Nổi bật</Checkbox>
            </Form.Item>

            <Form.Item name="is_new" valuePropName="checked">
              <Checkbox>Sản phẩm mới</Checkbox>
            </Form.Item>
          </div>
          <Button onClick={toggleVariantForm} type="default">
            {showVariantForm ? 'Ẩn Biến Thể' : 'Hiện Biến Thể'}
          </Button>
          {showVariantForm && (
            <div className="variant-form-container bg-white p-6 shadow-md rounded-lg border border-gray-200">
              {/* Variant Group Selection */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Chọn nhóm biến thể</span>}
                name="variant_group"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm biến thể' }]}
              >
                <Select
                  placeholder="Chọn nhóm biến thể"
                  onChange={setSelectedVariantGroup}
                  className="rounded-md border border-gray-300 hover:border-gray-400 focus:border-blue-500"
                >
                  {variantgroup?.map((group: any) => (
                    <Option key={group.group_id} value={group.group_id}>
                      {group.group_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Attributes Mapping */}
              {attributes
                .sort((a, b) => {
                  if (a.name.toLowerCase().includes('màu sắc')) return -1;
                  if (b.name.toLowerCase().includes('màu sắc')) return 1;
                  return 0;
                })
                .map((attribute, index) => (
                  <Form.Item
                    key={attribute.id}
                    label={<span className="font-semibold text-gray-700">Thuộc Tính ({attribute.name})</span>}
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder={`Nhập giá trị cho ${attribute.name}`}
                      onChange={(values) =>
                        handleAttributeValueChange(index, values.map((value: any) => ({ id: value.key, value: value.label })))
                      }
                      labelInValue
                      className="rounded-md border border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    >
                      {attribute.attribute_values.map((val: any) => (
                        <Option key={val.id} value={val.value}>
                          {val.value}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ))}

              {/* Generate Variants Button */}
              <Button
                type="default"
                className="mb-5 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 rounded-md py-2 px-4"
                onClick={generateVariants}
                icon={<PlusOutlined />}
              >
                Tạo Biến Thể
              </Button>

              {/* Variants Table */}
              <Table
                dataSource={variants}
                columns={columns}
                rowKey={(_, index: any) => index.toString()}
                pagination={false}
                className="w-full border border-gray-300 rounded-md"
              />
            </div>
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

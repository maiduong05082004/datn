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
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<number | null>(null);
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
    mutationFn: async (data: FormData) => {
      try {
        const response = await axios.post('http://localhost:8000/api/admins/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Response từ server:', response);
        return response.data;
      } catch (error) {
        throw new Error('Không thể thêm sản phẩm');
      }
    },
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công!');
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
        setAttributes(selectedGroup.attributes.map((attribute: any) => ({ ...attribute, selectedValues: [] })));
      }
    }
  }, [selectedVariantGroup, variantgroup]);

  // xử lý thay đổi giá trị thuộc tính
  const handleAttributeValueChange = (index: number, selectedValues: any[]) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].selectedValues = selectedValues;
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

  // tạo biến thể từ thuộc tính
  const generateVariants = () => {
    if (attributes.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thuộc tính để tạo biến thể!');
      return;
    }

    const selectedAttributes = attributes.filter(attr => attr.selectedValues && attr.selectedValues.length > 0);

    if (selectedAttributes.length === 0) {
      toast.error('Vui lòng chọn giá trị cho ít nhất một thuộc tính!');
      return;
    }

    const newVariants = selectedAttributes.reduce((variants, attribute) => {
      if (variants.length === 0) {
        return attribute.selectedValues.map((value : any) => ({
          attributeName: `${attribute.name}: ${value.label}`,
          [attribute.name]: value.value,
          stock: 0,
          discount: 0,
          colorImage: [],
          albumImages: [],
        }));
      }

      return variants.flatMap((variant : any) =>
        attribute.selectedValues.map((value : any) => ({
          ...variant,
          attributeName: `${variant.attributeName}, ${attribute.name}: ${value.label}`,
          [attribute.name]: value.value,
        }))
      );
    }, []);

    setVariants(newVariants);
  };

  // thay đổi giá trị biến thể (số lượng, giảm giá, ảnh)
  const handleVariantChange = (index: number, key: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
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
      title: 'Thuộc tính',
      dataIndex: 'attributeName',
      key: 'attributeName',
      render: (attributeName: string) => (
        <span className="text-lg font-semibold text-gray-700">{attributeName}</span>
      ),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: any, index: number) => (
        <InputNumber
          min={0}
          value={stock}
          onChange={(value) => handleVariantChange(index, 'stock', value)}
          className="border border-gray-300 rounded-md p-1 w-28"
          placeholder="Số Lượng"
        />
      ),
    },
    {
      title: 'Giảm Giá (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number, record: any, index: number) => (
        <InputNumber
          min={0}
          max={100}
          value={discount}
          onChange={(value) => handleVariantChange(index, 'discount', value)}
          className="border border-gray-300 rounded-md p-1 w-28"
          placeholder="Giảm Giá (%)"
        />
      ),
    },
  ];

  //  xử lý khi submit form
  const onFinish = (values: any) => {
    const formData = new FormData(); // Tạo FormData để gửi dữ liệu
    const formattedDate = values.input_day ? values.input_day.format('YYYY-MM-DD') : null;

    console.log("Values nhận được:", values); // Kiểm tra dữ liệu form
    console.log("Album list:", albumList); // Kiểm tra album list

    if (!showVariantForm) {
      albumList.forEach((file: any, index: number) => {
        if (file.originFileObj) {
          formData.append(`album_images[${index}]`, file.originFileObj);
        }
      });

      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('content', content || '');
      formData.append('input_day', formattedDate);
      formData.append('category_id', values.category_id);
      formData.append('stock', stock?.toString() || '0');
      formData.append('is_collection', values.is_collection ? '1' : '0');
      formData.append('is_hot', values.is_hot ? '1' : '0');
      formData.append('is_new', values.is_new ? '1' : '0');

      console.log("FormData sản phẩm đơn giản:", formData);
      mutate(formData as any);
      return;
    }

    if (showVariantForm) {
      console.log("Biến thể trước khi xử lý:", variants); // Kiểm tra biến thể

      if (!selectedVariantGroup) {
        toast.error('Vui lòng chọn nhóm biến thể!');
        return;
      }

      if (variants.length === 0) {
        toast.error('Vui lòng tạo ít nhất một biến thể!');
        return;
      }

      const validVariants = variants
        .filter(variant => variant.stock > 0)
        .map(variant => ({
          ...variant,
        }));

      if (validVariants.length === 0) {
        toast.error('Vui lòng điền đầy đủ thông tin cho ít nhất một biến thể!');
        return;
      }

      validVariants.forEach((variant: any, index: number) => {
        formData.append(`variations[${index}]`, JSON.stringify(variant));
      });

      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('content', content || '');
      formData.append('input_day', formattedDate);
      formData.append('category_id', values.category_id);
      formData.append('group_id', selectedVariantGroup?.toString() || '');
      formData.append('is_collection', values.is_collection ? '1' : '0');
      formData.append('is_hot', values.is_hot ? '1' : '0');
      formData.append('is_new', values.is_new ? '1' : '0');

      console.log("FormData sản phẩm có biến thể:", formData);

      mutate(formData as any);
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
                        handleAttributeValueChange(index, values.map((value: any) => ({ key: value.key, label: value.label })))
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

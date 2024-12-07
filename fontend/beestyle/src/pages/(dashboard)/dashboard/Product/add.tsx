import AxiosInstance from '@/configs/axios';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, InputNumber, Select, Spin, Table, Upload } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Option } = Select;

interface VariantProductGroup {
  id: number;
  name: string;
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
  attributeValueId: number;
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
  const navigate = useNavigate();
  const [showVariantForm, setShowVariantForm] = useState<boolean>(true);

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

  const { mutate } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await AxiosInstance.post('http://localhost:8000/api/admins/products', data);
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
        attributeValueId: primaryValue.id,
        combinations,
        colorImage: [],
        albumImages: [],
      };
    });

    setVariants(newVariants);
  };


  const handleUploadChangeForVariant = (index: number, key: 'albumImages', { fileList }: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = fileList;
    setVariants(updatedVariants);
  };
  const onFinish = async (values: any) => {
    const formData = new FormData();
    const formattedInputDay = moment(values.import_date).format("YYYY-MM-DD");

    formData.append('name', values.name);
    formData.append('price', values.price.toString());
    formData.append('description', values.description);
    formData.append('content', content);
    formData.append('import_date', formattedInputDay);
    formData.append('category_id', values.category_id.toString());
    formData.append('stock', values.stock ? values.stock.toString() : '0');
    formData.append('group_id', values.variant_group ? values.variant_group.toString() : '');

    formData.append('cost_price', values.product_cost);
    formData.append('supplier', values.supplier);

    albumList.forEach((file: any) => {
      formData.append('album_images[]', file.originFileObj);
    });

    const variantData = variants.map((variant) => {
      const attributeValueId = variant.attributeValueId;
      const albumImages = variant.albumImages.map((file: any) => file.originFileObj);

      const sizes = variant.combinations.reduce((acc: { [key: number]: { stock: number; discount: number } }, combination) => {
        acc[combination.sizeId] = {
          stock: combination.stock,
          discount: combination.discount,
        };
        return acc;
      }, {});
      console.log();

      albumImages.forEach((file: any) => {
        formData.append(`album_images_${attributeValueId}[]`, file);
      });

      return {
        attribute_value_id: attributeValueId,
        albumImages: albumImages.map((file: any) => file.name),
        sizes: sizes,
      };
    });

    formData.append('variations', JSON.stringify(variantData));
    mutate(formData);
    console.log(formData);

  };
  if (isLoadingVariantGroup || isLoadingCategories) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;
  }

  return (
    <>
      <div className="w-full px-6 py-8">
        <ToastContainer />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Tên sản phẩm bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá Nhập"
            name="product_cost"
            rules={[{ required: true, message: 'Giá Nhập sản phẩm bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nhà Cung Cấp"
            name="supplier"
            rules={[{ required: true, message: 'Nhà Cung Cấp bắt buộc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày nhập"
            name="import_date"
            rules={[{ required: true, message: "Ngày nhập sản phẩm bắt buộc phải điền" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Giá Bán sản phẩm"
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
              onChange={(event, editor: any) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
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
                    title: 'Thông tin',
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
          <Form.Item>
            <div className='flex justify-end space-x-4 pt-5'>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                onClick={() => navigate('/admin/dashboard/products/list')}
              >
                Back
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;
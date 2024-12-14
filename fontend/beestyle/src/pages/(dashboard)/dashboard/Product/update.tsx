import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, Checkbox, InputNumber, Upload, DatePicker, Spin, Select, Table, Modal, Cascader } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import instance from '@/configs/axios';

interface Size {
  sizeId: number;
  stock: number;
  discount: number;
}

interface Variant {
  colorId: number;
  colorName: string;
  sizes: Size[];
  colorImage: any[];
  albumImages: any[];
  [key: string]: any;
}

const { Option } = Select;

const UpdateProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<number | null>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showVariantForm, setShowVariantForm] = useState<boolean>(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [removedVariants, setRemovedVariants] = useState<number[]>([]);
  const [productData, setProductData] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deletingImage, setDeletingImage] = useState<{ [key: string]: boolean }>({});
  const [newColorImages, setNewColorImages] = useState<{ [key: number]: File[] }>({});
  const [newAlbumImages, setNewAlbumImages] = useState<{ [key: number]: File[] }>({});
  const [newVariationAlbumImages, setNewVariationAlbumImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: variantgroup, isLoading: isLoadingVariantGroup } = useQuery({
    queryKey: ['variantgroup'],
    queryFn: async () => {
      const response = await instance.get('api/admins/attribute_groups');
      return response?.data?.variation;
    },
  });

  const { data: UpdateVariant, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['updatevariant', id],
    queryFn: async () => {
      const response = await instance.get(`api/admins/products/${id}`);
      return response?.data?.data;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await instance.get('api/admins/categories');
      return response?.data;
    },
  });
  const categoryOptions = categories?.map((category: any) => ({
    value: category.id,
    label: category.name,
    children: category.children_recursive && category.children_recursive.length > 0
      ? category.children_recursive.map((child: any) => ({
        value: child.id,
        label: child.name,
        children: child.children_recursive && child.children_recursive.length > 0
          ? child.children_recursive.map((subChild: any) => ({
            value: subChild.id,
            label: subChild.name,
          }))
          : [],
      }))
      : [],
  }));

  const deleteImageMutation = useMutation({
    mutationFn: async ({ imageUrl }: { imageUrl: string; type: 'product' | 'variation' }) => {
      const base64FileUrl = btoa(imageUrl);
      const response = await instance.delete(`http://127.0.0.1:8000/api/admins/images/variation/${base64FileUrl}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Xóa Ảnh Thành Công');
    },
    onError: () => {
      toast.error('Xóa Ảnh Thất Bại!');
    },
  });

  const handleDeleteImage = (imageUrl: string, variantIndex: number, field: string, type: 'product' | 'variation') => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa ảnh này?',
      onOk: () => {
        setDeletingImage((prev) => ({ ...prev, [imageUrl]: true }));
        deleteImageMutation.mutate(
          { imageUrl, type },
          {
            onSuccess: () => {
              const updatedVariants = [...variants];
              updatedVariants[variantIndex][field] = updatedVariants[variantIndex][field].filter(
                (img: any) => img.url !== imageUrl
              );
              setVariants(updatedVariants);
              setNewColorImages((prev) => {
                const updatedImages = { ...prev };
                if (updatedImages[variants[variantIndex].colorId]) {
                  updatedImages[variants[variantIndex].colorId] = updatedImages[variants[variantIndex].colorId].filter(
                    (file) => file.name !== imageUrl
                  );
                }
                return updatedImages;
              });

              setDeletingImage((prev) => ({ ...prev, [imageUrl]: false }));
            },
            onError: () => {
              setDeletingImage((prev) => ({ ...prev, [imageUrl]: false }));
              toast.error(`Không Thể Xóa Anh`);
            },
          }
        );
      },
    });
  };

  useEffect(() => {
    if (UpdateVariant && variantgroup) {
      form.setFieldsValue({
        ...UpdateVariant,
        import_date: UpdateVariant.product_cost?.import_date ? moment(UpdateVariant.product_cost.import_date, 'YYYY-MM-DD', true) : null,
        category_id: UpdateVariant.category_id,
        is_collection: UpdateVariant.is_collection,
        variant_group: UpdateVariant.group?.id,
        product_cost: UpdateVariant.product_cost?.cost_price || '',
        supplier: UpdateVariant.product_cost?.supplier || '',

      });

      setContent(UpdateVariant.content || '');
      setProductData(UpdateVariant);

      const group = variantgroup.find((g: any) => g.group_id === UpdateVariant.group?.id);
      setSelectedGroup(group);

      if (group && group.attributes) {
        const formattedAttributes = group.attributes.map((attribute: any) => {
          const selectedValues: any[] = [];
          UpdateVariant.variations.forEach((variation: any) => {
            if (attribute.attribute_type === 0 && variation.attribute_value_image_variant) {
              const attrValue = attribute.attribute_values.find(
                (av: any) => av.id === variation.attribute_value_image_variant.id
              );
              if (attrValue) {
                selectedValues.push({
                  key: attrValue.id,
                  label: attrValue.value,
                });
              }
            }
            if (attribute.attribute_type === 1) {
              variation.variation_values.forEach((value: any) => {
                const attrValue = attribute.attribute_values.find(
                  (av: any) => av.id === value.attribute_value_id
                );
                if (attrValue) {
                  selectedValues.push({
                    key: attrValue.id,
                    label: attrValue.value,
                  });
                }
              });
            }
          });
          const uniqueSelectedValues = selectedValues.filter(
            (v, i, a) => a.findIndex((t) => t.key === v.key) === i
          );
          return {
            ...attribute,
            selectedValues: uniqueSelectedValues,
          };
        });
        setAttributes(formattedAttributes);
      }

      const formattedVariants: Variant[] = UpdateVariant.variations.map((variation: any) => ({
        colorId: variation.attribute_value_image_variant.id,
        colorName: variation.attribute_value_image_variant.value,
        sizes: variation.variation_values.map((value: any) => ({
          sizeId: value.attribute_value_id,
          size: value.value,
          stock: value.stock,
          discount: value.discount,
        })),
        albumImages: variation.variation_album_images.map((image: string) => ({
          name: image,
          uid: image,
          status: 'done',
          url: image,
          isExisting: true,
        })),
      }));
      setVariants(formattedVariants);
    }
  }, [UpdateVariant, form, variantgroup, categories]);

  const { mutateAsync: updateProductMutation } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await instance.post(`http://127.0.0.1:8000/api/admins/products/${id}`, formData, {
        params: {
          _method: 'PUT',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Cập Nhật Sản phẩm Thành Công');
      setLoading(false);

    },
    onError: () => {
      toast.error(`Cập Nhật Sản Phẩm Thất Bại!`);
      setLoading(false);
    },
  });
  // const handleDeleteVariant = (colorId: number) => {
  //   setRemovedVariants((prev) => [...prev, colorId]);
  //   setVariants((prevVariants) => {
  //     const updatedVariants = prevVariants.filter((variant) => variant.colorId !== colorId);
  //     console.log("Updated Variants after Deletion:", updatedVariants);
  //     return updatedVariants;
  //   });
  // };
  const handleAttributeValueChange = (attributeId: number, selectedValues: any[]) => {
    const updatedAttributes = attributes.map((attr) => {
      if (attr.id === attributeId) {
        return {
          ...attr,
          selectedValues,
        };
      }
      return attr;
    });
    setAttributes(updatedAttributes);
  };

  const handleVariantChange = (
    colorId: number,
    key: string,
    index: number,
    subKey: string,
    value: any
  ) => {
    const updatedVariants = [...variants];
    const variant = updatedVariants.find((v) => v.colorId === colorId);
    if (variant) {
      variant[key][index][subKey] = value;
    }
    setVariants(updatedVariants);
  };

  const generateVariants = () => {
    const colorAttribute = attributes.find((attr) => attr.attribute_type === 0);
    const sizeAttribute = attributes.find((attr) => attr.attribute_type === 1);

    if (!colorAttribute || !sizeAttribute) {
      toast.error('Thiếu thuộc tính Màu Sắc hoặc Kích Thước');
      return;
    }

    const selectedColors = colorAttribute.selectedValues || [];
    const selectedSizes = sizeAttribute.selectedValues || [];

    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.error('Vui lòng chọn ít nhất một màu sắc và một kích thước để tạo biến thể.');
      return;
    }

    const newVariants = selectedColors.map((color: any) => ({
      colorId: color.key,
      colorName: color.label,
      sizes: selectedSizes.map((size: any) => ({
        sizeId: size.key,
        size: size.label,
        stock: 0,
        discount: 0,
      })),
      colorImage: [],
      albumImages: [],
    }));

    const mergedVariants = [...variants];

    newVariants.forEach((newVariant: any) => {
      const existingVariantIndex = mergedVariants.findIndex(
        (variant) => variant.colorId === newVariant.colorId
      );

      if (existingVariantIndex > -1) {
        const existingSizes = mergedVariants[existingVariantIndex].sizes;

        newVariant.sizes.forEach((newSize: any) => {
          if (!existingSizes.find((size: any) => size.sizeId === newSize.sizeId)) {
            existingSizes.push(newSize);
          }
        });
      } else {
        mergedVariants.push(newVariant);
      }
    });

    setVariants(mergedVariants);
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
      render: (sizes: any[], record: any) =>
        sizes.map((size, index) => (
          <div key={index} className="flex items-center gap-3 mb-3">
            <span className="font-semibold w-20">{size.size}</span>
            <InputNumber
              value={size.stock}
              onChange={(value) => handleVariantChange(record.colorId, 'sizes', index, 'stock', value)}
              className="w-full border border-gray-300 rounded-md p-1"
              placeholder="Số Lượng"
            />
            <InputNumber
              value={size.discount}
              max={100}
              onChange={(value) =>
                handleVariantChange(record.colorId, 'sizes', index, 'discount', value)
              }
              className="w-full border border-gray-300 rounded-md p-1"
              placeholder="Giảm Giá (%)"
            />
          </div>
        )),
    },
    {
      title: 'Album Ảnh',
      dataIndex: 'albumImages',
      key: 'albumImages',
      render: (_: any, record: any, index: number) => (
        <div className="flex flex-wrap gap-3">
          {record.albumImages?.map((image: any, imageIndex: number) => (
            <div
              key={image.uid || imageIndex}
              className="relative flex flex-col items-center h-10 border border-gray-200 rounded-md shadow-sm"
              style={{ width: 100, height: 100 }}
            >
              <img
                src={image.url}
                alt={image.name}
                className="object-cover w-full h-full rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 rounded-md">
                <Button
                  icon={<DeleteOutlined />}
                  type="primary"
                  danger
                  size="small"
                  className="m-1"
                  loading={deletingImage[image.url] || false}
                  onClick={() => handleDeleteImage(image.url, index, 'albumImages', 'variation')}
                />
              </div>
            </div>
          ))}
          {(!record.albumImages || record.albumImages.length < 20) && (
            <Upload
              listType="picture-card"
              multiple
              onChange={({ fileList }) => {
                const filesToUpload = fileList.filter(file => file.originFileObj);

                // Lọc ra các file đã tồn tại trong albumImages
                const existingImageNames = new Set(record.albumImages.map(image => image.name));
                const newFilesToUpload = filesToUpload.filter(file => !existingImageNames.has(file.name));

                // Cập nhật newAlbumImages với các file mới
                setNewAlbumImages(prev => ({
                  ...prev,
                  [record.colorId]: [
                    ...(prev[record.colorId] || []),
                    ...newFilesToUpload.map(file => file.originFileObj as File),
                  ],
                }));

                // Cập nhật albumImages với các file mới
                const updatedAlbumImages = [
                  ...(record.albumImages || []),
                  ...newFilesToUpload.map((file) => ({
                    ...file,
                    url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''),
                  })),
                ];

                const updatedRecord = { ...record, albumImages: updatedAlbumImages };
                setVariants((prev) => {
                  const updatedVariants = [...prev];
                  updatedVariants[index] = updatedRecord;
                  return updatedVariants;
                });
              }}
              beforeUpload={() => false}
              showUploadList={false}
              className="upload-inline"
            >
              <div className="w-20 h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <UploadOutlined className="text-green-500 text-xl" />
              </div>
            </Upload>
          )}
        </div>
      ),
    },
    // {
    //   title: 'Hành động',
    //   key: 'action',
    //   render: (text: any, record: any) => (
    //     <Button
    //       type="primary"
    //       danger
    //       icon={<DeleteOutlined />}
    //       onClick={() => handleDeleteVariant(record.colorId)}
    //     >
    //       Xóa
    //     </Button>
    //   ),
    // },
  ];
  const onFinish = async (values: any) => {
    setLoading(true);
    const formattedDate = values.import_date ? moment(values.import_date).format('YYYY-MM-DD') : null;
    if (!formattedDate) {
      toast.error('Ngày nhập không hợp lệ. Vui lòng chọn một ngày!');
      return;
    }
    if (!values.name || !values.price || !values.category_id) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    const variations: Record<number, Record<number, { stock: number; discount: number }>> = {};
    variants.forEach((variant: Variant) => {
      if (!removedVariants.includes(variant.colorId)) {
        variations[variant.colorId] = {};
        variant.sizes.forEach((size: Size) => {
          variations[variant.colorId][size.sizeId] = {
            stock: size.stock || 0,
            discount: size.discount || 0,
          };
        });
      }
    });
    const selectedCategoryId = Array.isArray(values.category_id)
      ? values.category_id[values.category_id.length - 1]
      : values.category_id;
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price.toString());
    formData.append('variations', JSON.stringify(variations));
    formData.append('group_id', selectedVariantGroup?.toString() || '');
    formData.append('category_id', selectedCategoryId.toString());
    formData.append('description', values.description || '');
    formData.append('content', content || '');
    formData.append('import_date', formattedDate);
    formData.append('cost_price', values.product_cost);
    formData.append('is_collection', values.is_collection ? '1' : '0');
    formData.append('supplier', values.supplier);
    Object.keys(newAlbumImages).forEach(colorId => {
      newAlbumImages[Number(colorId)].forEach(file => {
        formData.append(`album_images_${colorId}[]`, file);
      });
    });
    newVariationAlbumImages.forEach(file => {
      formData.append('variation_album_images[]', file);
    });
    try {
      await updateProductMutation(formData);
    } catch (error: any) {
    }
  };

  const handleGroupChange = (groupId: number) => {
    const group = variantgroup?.find((g: any) => g.group_id === groupId);
    setSelectedGroup(group);

    if (group && group.attributes) {
      setVariants([]);
      const formattedAttributes = group.attributes.map((attribute: any) => ({
        ...attribute,
        selectedValues: [],
      }));
      setAttributes(formattedAttributes);
    }
  };
  useEffect(() => {
    if (selectedGroup) {
      setSelectedVariantGroup(selectedGroup.group_id);
    }
  }, [selectedGroup]);
  if (isLoadingVariantGroup || isLoadingCategories || isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading..." />
      </div>
    );
  }
  return (
    <div className="w-full px-6 py-8">
      <ToastContainer />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Form.Item
              className='mb-[10px]'
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Tên sản phẩm bắt buộc' }]}
            >
              <Input className='h-10' />
            </Form.Item>

            <Form.Item
              className="mb-[10px]"
              label="Giá Nhập"
              name="product_cost"
              rules={[{ required: true, message: 'Giá Nhập sản phẩm bắt buộc' }]}
            >
              <InputNumber
                className="py-1 w-full"
                formatter={(value) => `${Math.floor(Number(value || 0))}`}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
              />
            </Form.Item>


            <Form.Item
              className='mb-[10px]'
              label="Nhà Cung Cấp"
              name="supplier"
              rules={[{ required: true, message: 'Nhà Cung Cấp bắt buộc' }]}
            >
              <Input className='h-10' />
            </Form.Item>

            <Form.Item
              className='mb-[10px]'
              label="Ngày nhập"
              name="import_date"
              rules={[{ required: true, message: "Ngày nhập sản phẩm bắt buộc phải điền" }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} className='h-10' />
            </Form.Item>

            <Form.Item
              className='mb-[10px]'
              label="Giá sản phẩm"
              name="price"
              rules={[{ required: true, message: 'Giá sản phẩm bắt buộc phải điền' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} className='py-[5px]' />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              className='mb-[10px]'
              label="Mô tả sản phẩm"
              name="description"
              rules={[{ required: true, message: 'Mô tả sản phẩm bắt buộc phải điền' }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm ngắn gọn" />
            </Form.Item>

            <Form.Item
              className='mb-[10px]'
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
          </div>
        </div>
        <Form.Item
          label="Danh mục"
          name="category_id"
          className='mb-[10px]'
          rules={[{ required: true, message: "Danh mục sản phẩm bắt buộc!" }]}
        >
          <Cascader options={categoryOptions} className='h-10' />
        </Form.Item>

        <div className='mb-[10px] pt-5'>
          <Form.Item name="is_collection" valuePropName="checked" initialValue={false}>
            <Checkbox>Bộ sưu tập</Checkbox>
          </Form.Item>
        </div>

        {showVariantForm && (
          <>
            <Form.Item
              label="Chọn nhóm biến thể"
              className='mb-[10px] '
              name="variant_group"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm biến thể' }]}
            >
              <Select className='h-[40px]' placeholder="Chọn nhóm biến thể" onChange={handleGroupChange}>
                {variantgroup?.map((group: any) => (
                  <Option key={group.group_id} value={group.group_id}>
                    {group.group_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {attributes &&
              attributes.length > 0 &&
              attributes.map((attribute: any) => (
                <Form.Item key={attribute.id} label={attribute.name} className='mb-[15px]'>
                  <Select
                    className='h-[40px]'
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder={`Chọn giá trị cho ${attribute.name}`}
                    onChange={(values) =>
                      handleAttributeValueChange(
                        attribute.id,
                        values.map((value: any) => ({
                          key: value,
                          label: attribute.attribute_values.find((av: any) => av.id === value)?.value,
                        }))
                      )
                    }
                    value={attribute.selectedValues.map((val: any) => val.key)}
                  >
                    {attribute.attribute_values.map((val: any) => (
                      <Option key={val.id} value={val.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {val.image_path ? (
                            <img
                              src={val.image_path}
                              alt={val.value}
                              style={{ width: 20, height: 20, borderRadius: '50%' }}
                            />
                          ) : null}
                          <span>{val.value}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ))}
            <Button
              type="default"
              className="mb-4"
              onClick={generateVariants}
              icon={<PlusOutlined />}
            >
              Tạo Biến Thể
            </Button>
            <Table
              dataSource={variants}
              columns={columns}
              rowKey={(record, index) => (index !== undefined ? index.toString() : Math.random().toString())}
              pagination={false}
              className="w-full border-collapse border border-gray-300"
            />
          </>
        )}
        <Form.Item>
          <div className='flex justify-end space-x-4 pt-5'>
            <Button type="primary" htmlType="submit" loading={loading}>
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
  );
};

export default UpdateProduct;
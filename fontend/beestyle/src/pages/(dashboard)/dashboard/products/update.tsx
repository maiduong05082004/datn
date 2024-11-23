import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Input, Button, Checkbox, InputNumber, Upload, DatePicker, Spin, Select, Table, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import AxiosInstance from '@/configs/axios';

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
  const [stock, setStock] = useState<number | null>(null);
  const [showVariantForm, setShowVariantForm] = useState<boolean>(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [removedVariants, setRemovedVariants] = useState<number[]>([]);
  const [productData, setProductData] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deletingImage, setDeletingImage] = useState<{ [key: string]: boolean }>({});

  // State để lưu trữ các tệp ảnh mới
  const [newColorImages, setNewColorImages] = useState<{ [key: number]: File[] }>({});
  const [newAlbumImages, setNewAlbumImages] = useState<{ [key: number]: File[] }>({});
  const [newVariationAlbumImages, setNewVariationAlbumImages] = useState<File[]>([]);

  const { data: variantgroup, isLoading: isLoadingVariantGroup } = useQuery({
    queryKey: ['variantgroup'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://localhost:8000/api/admins/attribute_groups');
      return response?.data?.variation;
    },
  });

  const { data: UpdateVariant, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['updatevariant', id],
    queryFn: async () => {
      const response = await AxiosInstance.get(`http://localhost:8000/api/admins/products/${id}`);
      return response?.data?.data;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await AxiosInstance.get('http://localhost:8000/api/admins/categories');
      return response?.data;
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async ({ imageUrl, type }: { imageUrl: string; type: 'product' | 'variation' }) => {
      const base64FileUrl = btoa(imageUrl); // Encode toàn bộ URL
      const response = await AxiosInstance.delete(`http://127.0.0.1:8000/api/admins/images/variation/${base64FileUrl}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Image deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete image: ${error.message}`);
    },
  });

  const handleDeleteImage = (imageUrl: string, variantIndex: number, field: string, type: 'product' | 'variation') => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa ảnh này?',
      onOk: () => {
        // Set loading chỉ cho ảnh cụ thể
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

              // Loại bỏ ảnh khỏi newColorImages nếu tồn tại trong đó
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
              toast.success('Xóa ảnh thành công!');
            },
            onError: (error: any) => {
              setDeletingImage((prev) => ({ ...prev, [imageUrl]: false }));
              toast.error(`Không thể xóa ảnh: ${error.message}`);
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
        input_day: UpdateVariant.input_day ? moment(UpdateVariant.input_day) : null,
        category_id: UpdateVariant.category_id,
        variant_group: UpdateVariant.group?.id,
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
        colorImage: variation.attribute_value_image_variant.image_path
          ? [
            {
              name: variation.attribute_value_image_variant.image_path,
              uid: variation.attribute_value_image_variant.image_path,
              status: 'done',
              url: variation.attribute_value_image_variant.image_path,
              isExisting: true,
            },
          ]
          : [],
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
  }, [UpdateVariant, form, variantgroup]);

  // Đã chỉnh sửa để destructure mutateAsync
  const { mutateAsync: updateProductMutation, isPending: isUpdating } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await AxiosInstance.post(`http://127.0.0.1:8000/api/admins/products/${id}`, formData, {
        headers: {
          // Do not set Content-Type explicitly; let Axios handle it.
        },
        params: {
          _method: 'PUT', // Laravel will interpret this as a PUT request.
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công!');
    },
    onError: (error: any) => {
      toast.error(`Cập nhật sản phẩm thất bại: ${error.message}`);
    },
  });

  const handleStockChange = (value: number | null) => {
    setStock(value);
    form.setFieldsValue({ stock: value });
  };

  // Xóa biến thể
  const handleDeleteVariant = (colorId: number) => {
    setRemovedVariants((prev) => [...prev, colorId]);
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.filter((variant) => variant.colorId !== colorId);
      console.log("Updated Variants after Deletion:", updatedVariants); // Check the updated variants here
      return updatedVariants;
    });
  };

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
      console.log('No colors or sizes selected');  // Debugging output
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

        // Add only new sizes to the existing variant
        newVariant.sizes.forEach((newSize: any) => {
          if (!existingSizes.find((size: any) => size.sizeId === newSize.sizeId)) {
            existingSizes.push(newSize);
          }
        });
      } else {
        mergedVariants.push(newVariant); // Add entirely new variants
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
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Số Lượng"
            />
            <InputNumber
              value={size.discount}
              max={100}
              onChange={(value) =>
                handleVariantChange(record.colorId, 'sizes', index, 'discount', value)
              }
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Giảm Giá (%)"
            />
          </div>
        )),
    },
    {
      title: 'Ảnh Màu',
      dataIndex: 'colorImage',
      key: 'colorImage',
      render: (_: any, record: any, index: number) => (
        <div className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-md shadow-sm">
          <Upload
            listType="picture-card"
            fileList={record.colorImage || []}
            onChange={({ fileList }) => {
              const filesToUpload = fileList.filter(file => file.originFileObj);
              setNewColorImages(prev => ({
                ...prev,
                [record.colorId]: filesToUpload.map(file => file.originFileObj as File),
              }));
              // Cập nhật giao diện hiển thị ảnh nếu cần
              const updatedColorImage = fileList.map((file) => ({
                ...file,
                url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''),
              }));
              const updatedRecord = { ...record, colorImage: updatedColorImage };
              setVariants((prev) => {
                const updatedVariants = [...prev];
                updatedVariants[index] = updatedRecord;
                return updatedVariants;
              });
            }}
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
          {record.colorImage?.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              loading={deletingImage[record.colorImage[0].url] || false} // Chỉ hiển thị trạng thái loading cho ảnh cụ thể
              onClick={() => handleDeleteImage(record.colorImage[0].url, index, 'colorImage', 'variation')}
            >
              Delete
            </Button>
          )}
        </div>
      ),
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
              className="relative flex flex-col items-center p-2 border border-gray-200 rounded-md shadow-sm"
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
                  loading={deletingImage[image.url] || false} // Chỉ hiển thị trạng thái loading cho ảnh cụ thể
                  onClick={() => handleDeleteImage(image.url, index, 'albumImages', 'variation')}
                />
              </div>
            </div>
          ))}
          {(!record.albumImages || record.albumImages.length < 3) && (
            <Upload
              listType="picture-card"
              multiple
              onChange={({ fileList }) => {
                const filesToUpload = fileList.filter(file => file.originFileObj);

                setNewAlbumImages(prev => ({
                  ...prev,
                  [record.colorId]: [
                    ...(prev[record.colorId] || []), // giữ lại các ảnh cũ trong album
                    ...filesToUpload.map(file => file.originFileObj as File),
                  ],
                }));

                // Cập nhật giao diện hiển thị ảnh nếu cần
                const updatedAlbumImages = [
                  ...(record.albumImages || []), // giữ lại các ảnh cũ
                  ...fileList.map((file) => ({
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
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: any) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteVariant(record.colorId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    const formattedDate = values.input_day ? moment(values.input_day).format('YYYY-MM-DD') : null;

    if (!formattedDate) {
      toast.error('Ngày nhập không hợp lệ. Vui lòng chọn một ngày!');
      return;
    }

    if (!values.name || !values.price || !values.category_id) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    // Prepare variations, excluding removed variants
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

    // Tạo FormData
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price.toString());
    formData.append('variations', JSON.stringify(variations));
    formData.append('group_id', selectedVariantGroup?.toString() || '');
    formData.append('category_id', values.category_id.toString());
    formData.append('description', values.description || '');
    formData.append('content', content || '');
    formData.append('input_day', formattedDate);


    // Kiểm tra và append ảnh colorImage
    Object.keys(newColorImages).forEach(colorId => {
      newColorImages[Number(colorId)].forEach(file => {
        formData.append(`color_image_${colorId}`, file);
      });
    });

    // Kiểm tra và append ảnh albumImages
    Object.keys(newAlbumImages).forEach(colorId => {
      newAlbumImages[Number(colorId)].forEach(file => {
        formData.append(`album_images_${colorId}[]`, file);
      });
    });

    // Kiểm tra và append ảnh variation_album_images
    newVariationAlbumImages.forEach(file => {
      formData.append('variation_album_images[]', file);
    });

    console.log('Final FormData:', formData); // Debugging log

    // Gọi mutation để cập nhật sản phẩm
    try {
      await updateProductMutation(formData); // Sử dụng mutateAsync
      // Có thể reset các state liên quan nếu cần
    } catch (error: any) {
      toast.error(`Cập nhật sản phẩm thất bại: ${error.message}`);
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
      <h2 className="text-4xl font-bold mb-6">Cập nhật sản phẩm</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Tên sản phẩm bắt buộc' }]}
        >
          <Input className="border border-gray-300 rounded-md" />
        </Form.Item>

        <Form.Item
          label="Giá sản phẩm"
          name="price"
          rules={[{ required: true, message: 'Giá sản phẩm bắt buộc phải điền' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} className="border border-gray-300 rounded-md" />
        </Form.Item>

        <Form.Item
          label="Mô tả sản phẩm"
          name="description"
          rules={[{ required: true, message: 'Mô tả sản phẩm bắt buộc phải điền' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm ngắn gọn" className="border border-gray-300 rounded-md" />
        </Form.Item>

        <Form.Item
          label="Nội dung chi tiết"
          name="content"
          rules={[{ required: true, message: 'Nội dung chi tiết sản phẩm bắt buộc phải điền' }]}
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
          rules={[{ required: true, message: 'Danh mục sản phẩm bắt buộc phải chọn' }]}
          style={{ display: 'none' }} // Ẩn trường này vì chúng ta chỉ cần lưu id
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category_name"
          rules={[{ required: true, message: 'Danh mục sản phẩm bắt buộc phải chọn' }]}
        >
          <Select
            placeholder="Chọn danh mục"
            className="border border-gray-300 rounded-md"
            onChange={(value) => {
              const selectedCategory = categories.find((category: any) => category.id === value);
              form.setFieldsValue({
                category_id: selectedCategory?.id,
                category_name: selectedCategory?.name,
              });
            }}
          >
            {categories?.map((category: any) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex gap-5">
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

        <Button onClick={() => setShowVariantForm(!showVariantForm)} type="default">
          {showVariantForm ? 'Ẩn Biến Thể' : 'Hiện Biến Thể'}
        </Button>

        {showVariantForm && (
          <>
            <Form.Item
              label="Chọn nhóm biến thể"
              name="variant_group"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm biến thể' }]}
            >
              <Select placeholder="Chọn nhóm biến thể" onChange={handleGroupChange} className="border border-gray-300 rounded-md">
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
                <Form.Item key={attribute.id} label={attribute.name}>
                  <Select
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
                        {val.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ))}

            <Button
              type="default"
              className="mb-5 bg-blue-500 text-white hover:bg-blue-700"
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
              <Form.Item label="Tải lên album ảnh" name="variation_album_images">
                <Upload
                  listType="picture"
                  multiple
                  onChange={({ fileList }) => {
                    const filesToUpload = fileList.filter(file => file.originFileObj);
                    setNewVariationAlbumImages(filesToUpload.map(file => file.originFileObj as File));
                  }}
                  beforeUpload={() => false}
                  showUploadList={true}
                  onRemove={(file: any) => {
                    setNewVariationAlbumImages(prev => prev.filter(f => f !== file.originFileObj));
                  }}
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
          <div className='flex justify-end space-x-4'>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
              onClick={() => navigate('/admin/dashboard/attribute/list')}
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
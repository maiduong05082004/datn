import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Form,
  Input,
  Button,
  Checkbox,
  InputNumber,
  Upload,
  DatePicker,
  Spin,
  Select,
  Table,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const UpdateProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<number | null>(null);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [stock, setStock] = useState<number | null>(null);
  const [albumList, setAlbumList] = useState<any[]>([]);
  const [showVariantForm, setShowVariantForm] = useState<boolean>(true);
  const { id } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const { data: variantgroup, isLoading: isLoadingVariantGroup } = useQuery({
    queryKey: ['variantgroup'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/attribute_groups');
      return response?.data?.variation;
    },
  });

  const { data: UpdateVariant } = useQuery({
    queryKey: ['updatevariant', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8000/api/admins/products/${id}`);
      return response?.data?.data;
    },
  });


  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/categories');
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


  const { mutate: updateProduct } = useMutation({
    mutationFn: async (formData: any) => {
      formData.append('_method', 'PUT');
      const response = await axios.post(`http://localhost:8000/api/admins/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công!');
    },
    onError: () => {
      toast.error('Cập nhật sản phẩm thất bại!');
    },
  });

  const handleStockChange = (value: number | null) => {
    setStock(value);
    form.setFieldsValue({ stock: value });
  };
  const handleResetImage = (index: number, field: string) => {
    const updatedVariants = [...variants];

    if (field === 'colorImage') {
      updatedVariants[index].colorImage = [];
    } else if (field === 'albumImages') {
      updatedVariants[index].albumImages = [];
    }

    setVariants(updatedVariants);
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
    if (!attributes || attributes.length === 0) {
      toast.error('Chưa có thuộc tính để tạo biến thể.');
      return;
    }

    const colorAttribute = attributes.find((attr) => attr.attribute_type === 0);
    const sizeAttribute = attributes.find((attr) => attr.attribute_type === 1);

    // Kiểm tra nếu thuộc tính không tồn tại hoặc không có selectedValues
    if (!colorAttribute || !sizeAttribute) {
      toast.error('Thiếu thuộc tính Màu Sắc hoặc Kích Thước');
      return;
    }

    if (!colorAttribute.selectedValues || colorAttribute.selectedValues.length === 0) {
      toast.error('Bạn chưa chọn Màu Sắc cho sản phẩm.');
      return;
    }

    if (!sizeAttribute.selectedValues || sizeAttribute.selectedValues.length === 0) {
      toast.error('Bạn chưa chọn Kích Thước cho sản phẩm.');
      return;
    }

    const selectedColors = colorAttribute.selectedValues || [];
    const selectedSizes = sizeAttribute.selectedValues || [];

    // Tạo biến thể mới với màu sắc và kích thước
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

    setVariants(newVariants);  // Cập nhật biến thể với size
  };



  // Kiểm tra response khi upload ảnh
  const handleUploadChangeForVariant = (index: number, key: string, info: any) => {
    const updatedVariants = [...variants];
    const variant = updatedVariants[index];

    if (variant) {
      variant[key] = info.fileList.map((file: any) => {
        console.log(file); // Kiểm tra dữ liệu ảnh sau khi tải lên
        if (file.response) {
          console.log(file.response.url); // Kiểm tra URL trả về từ server
          return {
            ...file,
            url: file.response.url, // URL ảnh trả về từ server
          };
        }
        return file;
      });
    }

    setVariants(updatedVariants);
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
      render: (_: any, record: any, index: any) => (
        <div className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-md shadow-sm">
          <Upload
            listType="picture-card"
            fileList={record.colorImage || []}
            onChange={(info) => handleUploadChangeForVariant(index, 'colorImage', info)}
            action="/path_to_upload_endpoint" // Cần thay thế
            name="file"
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
            className="mt-2"
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
        <div className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-md shadow-sm">
          <Upload
            listType="picture-card"
            multiple
            fileList={record.albumImages || []}
            onChange={(info) => handleUploadChangeForVariant(index, 'albumImages', info)}
            action="/path_to_upload_endpoint"
            name="file"
            className="upload-inline"
          >
            {record.albumImages?.length < 4 && (
              <div className="w-20 h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer">
                <UploadOutlined className="text-green-500 text-xl" />
              </div>
            )}
          </Upload>
          <Button
            type="dashed"
            danger
            className="mt-2"
            onClick={() => handleResetImage(index, 'albumImages')}
          >
            Reset Album Ảnh
          </Button>
        </div>
      ),
    }

  ];

  const onFinish = (values: any) => {
    const formattedDate = values.input_day ? moment(values.input_day).format('YYYY-MM-DD') : null;

    if (!formattedDate) {
      toast.error('Ngày nhập không hợp lệ. Vui lòng chọn một ngày!');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('content', content || '');
    formData.append('input_day', formattedDate);
    formData.append('category_id', values.category_id);
    formData.append('is_collection', values.is_collection ? '1' : '0');
    formData.append('is_hot', values.is_hot ? '1' : '0');
    formData.append('is_new', values.is_new ? '1' : '0');
    formData.append('group_id', selectedVariantGroup ? selectedVariantGroup.toString() : '');

    // Xử lý biến thể và thêm vào FormData
    const variations = variants.map((variant, index) => {
      const colorImage = variant.colorImage?.[0]?.originFileObj ? null : variant.colorImage?.[0]?.url;
      const albumImages = variant.albumImages?.map((file: any) =>
        file.originFileObj ? null : file.url
      );

      return {
        color_image_url: colorImage,
        album_images_urls: albumImages,
        sizes: variant.sizes.map((size: any) => ({
          sizeId: size.sizeId,
          stock: size.stock,
          discount: size.discount,
        })),
      };
    });

    formData.append('variations', JSON.stringify(variations));

    // Thêm ảnh mới vào FormData cho các file ảnh
    variants.forEach((variant, index) => {
      const colorImage = variant.colorImage?.[0];
      if (colorImage?.originFileObj) {
        formData.append(`color_image_${index}`, colorImage.originFileObj);
      }
      variant.albumImages?.forEach((file: any, albumIndex: any) => {
        if (file.originFileObj) {
          formData.append(`album_images_${index}[${albumIndex}]`, file.originFileObj);
        }
      });
    });

    updateProduct(formData);
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

  if (isLoadingVariantGroup || isLoadingCategories) {
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
              <Form.Item label="Tải lên album ảnh" name="variation_album_images">
                <Upload
                  listType="picture"
                  multiple
                  fileList={albumList}
                  onChange={({ fileList }) => setAlbumList(fileList.map((file) => file.name))}
                  beforeUpload={() => false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Tải lên album ảnh
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white mt-5"
          >
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProduct;

import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Input, Button, Checkbox, InputNumber, Upload, Row, Col, DatePicker, Select, Table, Switch, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
interface Attribute {
  id: number | string;
  name: string;
  attribute_values: Array<{ id: number | string; value: string }>;
  values: string[];
}

interface AttributeGroup {
  group_id: number | string;
  group_name: string;
  attributes: Attribute[];
}

interface Variant {
  [key: string]: any;
  price: number;
  stock: number;
  sku: string;
  status: boolean;
}

interface Category {
  id: number;
  name: string;
  children_recursive?: Category[];
}

const AddProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [selectedVariantGroup, setSelectedVariantGroup] = useState<number | string | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [albumList, setAlbumList] = useState<UploadFile[]>([]);
  const [showVariantForm, setShowVariantForm] = useState<boolean>(true);

  const { data: attributeGroups, isLoading: loadingGroups, error } = useQuery<AttributeGroup[]>({
    queryKey: ['attributeGroups'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/attribute_groups');
      return response.data.variation;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/admins/categories');
      return response?.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('http://localhost:8000/api/admins/products', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công!');
      form.resetFields();
      setContent('');
      setAttributes([]);
      setVariants([]);
      setFileList([]);
      setAlbumList([]);
    },
    onError: (error: any) => {
      toast.error('Thêm sản phẩm thất bại!');
      console.error(error);
    },
  });

  useEffect(() => {
    if (selectedVariantGroup && attributeGroups) {
      const selectedGroup = attributeGroups.find(group => group.group_id === selectedVariantGroup);
      if (selectedGroup) {
        setAttributes(selectedGroup.attributes.map(attribute => ({ ...attribute, values: [] })));
      }
    }
  }, [selectedVariantGroup, attributeGroups]);

  const handleAttributeValueChange = (attributeIndex: number, value: string[]) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attributeIndex].values = value;
    setAttributes(updatedAttributes);
  };

  const generateVariants = () => {
    const attributeCombinations = attributes.filter(attr => attr.values && attr.values.length > 0);

    if (attributeCombinations.length === 0) {
      message.warning('Vui lòng chọn đủ thuộc tính');
      return;
    }

    const generateCombinations = (index: number, currentCombination: Record<string, string>) => {
      if (index === attributeCombinations.length) {
        setVariants(prev => [...prev, { ...currentCombination, price: 0, stock: 0, sku: '', status: true }]);
        return;
      }
      attributeCombinations[index].values.forEach(value => {
        generateCombinations(index + 1, { ...currentCombination, [attributeCombinations[index].name]: value });
      });
    };

    setVariants([]); // Clear existing variants
    generateCombinations(0, {});
  };

  const handleVariantChange = (index: number, key: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
    setVariants(updatedVariants);
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  const handleAlbumChange: UploadProps['onChange'] = (info) => {
    setAlbumList(info.fileList);
  };
  const columns = [
    ...attributes.map(attr => ({
      title: attr.name,
      dataIndex: attr.name,
      key: attr.id,
    })),
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (_: any, record: Variant, index: number) => (
        <InputNumber
          min={0}
          value={record.price}
          onChange={(value) => handleVariantChange(index, 'price', value)}
        />
      ),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'stock',
      render: (_: any, record: Variant, index: number) => (
        <InputNumber
          min={0}
          value={record.stock}
          onChange={(value) => handleVariantChange(index, 'stock', value)}
        />
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      render: (_: any, record: Variant, index: number) => (
        <Input
          value={record.sku}
          onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
        />
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      render: (_: any, record: Variant, index: number) => (
        <Switch
          checked={record.status}
          onChange={(checked) => handleVariantChange(index, 'status', checked)}
        />
      ),
    },
  ];

  if (loadingGroups || isLoadingCategories) return <div>Loading...</div>;
  if (error) return <div>Lỗi khi tải nhóm thuộc tính!</div>;

  return (
    <>
      <div className="container mx-auto">
        <ToastContainer />
        <h2 className="text-4xl font-bold mb-6 ">Thêm sản phẩm</h2>

        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={(values) => {
            const finalData = {
              ...values,
              content,
              variations: JSON.stringify(variants),
            };
            mutate(finalData);
          }}
          initialValues={{ is_collection: false, is_hot: false, is_new: false }}
        >
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
              onChange={(_event: any, editor: any) => {
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
            <Select id="category" className="border rounded-lg">
              <Select.Option value="">--Chọn danh mục--</Select.Option>
              {categories?.map((category) => (
                <Select.OptGroup key={category.id} label={category.name}>
                  {category.children_recursive?.map((child) => (
                    <Select.Option key={child.id} value={child.id}>
                      {child.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
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

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-green-800">Biến thể sản phẩm</h3>
            <Button onClick={() => setShowVariantForm(!showVariantForm)} type="default">
              {showVariantForm ? 'Ẩn Biến Thể' : 'Hiện Biến Thể'}
            </Button>
          </div>

          {showVariantForm && (
            <>
              <Form.Item
                label="Chọn nhóm biến thể"
                name="variant_group"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm biến thể' }]}
              >
                <Select
                  placeholder="Chọn nhóm biến thể"
                  onChange={(value) => setSelectedVariantGroup(value)}
                >
                  {attributeGroups?.map(group => (
                    <Select.Option key={group.group_id} value={group.group_id}>{group.group_name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {attributes.map((attribute, attributeIndex) => (
                <Form.Item key={attribute.id} label={`Thuộc Tính (${attribute.name})`}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder={`Nhập giá trị cho ${attribute.name}`}
                    onChange={(value) => handleAttributeValueChange(attributeIndex, value)}
                  >
                    {attribute.attribute_values.map((val) => (
                      <Select.Option key={val.id} value={val.value}>{val.value}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ))}

              <Button type="dashed" onClick={generateVariants} icon={<PlusOutlined />}>Tạo Biến Thể</Button>

              <Table
                dataSource={variants}
                columns={columns}
                rowKey={(_, index) => (index !== undefined ? index.toString() : '')}
                pagination={false}
                style={{ marginTop: 20 }}
              />
              
            </>

          )}



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
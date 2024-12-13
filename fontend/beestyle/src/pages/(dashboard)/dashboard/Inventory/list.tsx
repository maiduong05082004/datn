import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin, Table, Tabs, Tooltip, Button, Modal, InputNumber, Cascader, Form, Input } from 'antd';
import React, { useState } from 'react';
import { format } from 'date-fns';
import instance from '@/configs/axios';
import { toast, ToastContainer } from 'react-toastify';
import { DatePicker, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

type Product = {
    id: string;
    name: string;
    price: string;
    stock: number;
    category_name: string;
    description: string;
    product_cost: {
        cost_price: string;
        supplier: string;
        import_date: string;
        sale_status: string;
    };
};


type Variation = {
    id: string;
    stock: number;
    attribute_value_image_variant: {
        value: string;
        image_path: string;
    };
    variation_values: Array<{
        id: string; // Bổ sung id tại đây
        value: string;
        stock: number;
        price: string;
        discount: number;
    }>;
};

type Props = {};
const { RangePicker } = DatePicker;

const InventoryManagement = (props: Props) => {
    const queryCient = useQueryClient();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [newStocks, setNewStocks] = useState<{ [key: string]: number }>({});
    const [selectedVariant, setSelectedVariant] = useState<Variation | null>(null);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
    const [selectedDates, setSelectedDates] = useState<[string, string] | null>(null);
    const [isFiltered, setIsFiltered] = useState(false);
    const [filteredData, setFilteredData] = useState<Product[]>([]);


    const handleOpenFilterModal = () => {
        setIsFilterModalVisible(true);
    };

    const handleCloseFilterModal = () => {
        setIsFilterModalVisible(false);
    };
    const handleTabChange = (activeKey: string) => {
        setIsFiltered(false);
        setFilteredData([]);
        resetFilters();
    };


    const handleApplyFilter = async () => {
        try {
            const params: Record<string, any> = {};

            if (selectedDates && selectedDates.length === 2) {
                params.start_date = selectedDates[0];
                params.end_date = selectedDates[1];
            }

            if (selectedSupplier) {
                params.supplier = selectedSupplier;
            }

            if (selectedCategoryId) {
                params.category_id = selectedCategoryId;
            }

            const response = await instance.post(
                'api/admins/inventory/listProductDate',
                params
            );

            if (response?.data?.data?.length > 0) {
                const normalizedData = response.data.data.map((item: any, index: number) => ({
                    key: item.id || index,
                    index,
                    ...item,
                }));

                setFilteredData(normalizedData);
                setIsFiltered(true);
                toast.success('Lọc dữ liệu thành công!');
            } else {
                setFilteredData([]);
                setIsFiltered(false);
                toast.info('Không tìm thấy dữ liệu phù hợp!');
            }

            resetFilters(); // Reset bộ lọc
            setIsFilterModalVisible(false); // Đóng modal lọc
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lọc!');
        }
    };


    const resetFilters = () => {
        setSelectedDates(null);
        setSelectedSupplier(null);
        setSelectedCategoryId(null);
    };

    const { data: productData } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await instance.get('api/admins/products');
            return response.data.data;
        },
    })

    const { data: activeData, isLoading: loadingActive } = useQuery({
        queryKey: ['activeProducts'],
        queryFn: async () => {
            const response = await instance.get('api/admins/inventory/listproductastive');
            return response.data.data;
        },
    });

    const { data: inactiveData, isLoading: loadingInactive } = useQuery({
        queryKey: ['inactiveProducts'],
        queryFn: async () => {
            const response = await instance.get('api/admins/inventory/listproductinactive');
            return response.data.data;
        },
    });

    const { data: outOfStockData, isLoading: loadingOutOfStock } = useQuery({
        queryKey: ['outOfStockProducts'],
        queryFn: async () => {
            const response = await instance.get('api/admins/inventory/product_isoutof_stock');
            return response.data.data;
        },
    });

    const { data: lowStockData, isLoading: loadingLowStock } = useQuery({
        queryKey: ['lowStockProducts'],
        queryFn: async () => {
            const response = await instance.post(
                'api/admins/inventory/listproducts_withfewsizes'
            );
            return response.data.data;
        },
    });

    const { mutate: updateProductStatus } = useMutation<
        unknown,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            const response = await instance.put(
                `api/admins/inventory/updateproductinactive/${id}`
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('Trạng thái sản phẩm đã được chuyển sang Ngừng bán.');
            queryCient.invalidateQueries({ queryKey: ['activeProducts'] });
            queryCient.invalidateQueries({ queryKey: ['inactiveProducts'] });
        },
        onError: (error) => {
            console.error('Lỗi:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm.');
        },
    });

    const { mutate: updateProductStatus2 } = useMutation<
        unknown,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            const response = await instance.put(
                `api/admins/inventory/updateproductactivete/${id}`
            );
            return response.data;
        },
        onSuccess: (action) => {
            toast.success(
                `Trạng thái sản phẩm đã được chuyển sang ${action === 'activate' ? 'Đang bán' : 'Ngừng bán'
                }.`
            );
            queryCient.invalidateQueries({ queryKey: ['activeProducts'] });
            queryCient.invalidateQueries({ queryKey: ['inactiveProducts'] });
        },
        onError: (error) => {
            console.error('Lỗi:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm.');
        },
    });

    const handleVariantClick = (variant: Variation) => {
        setSelectedVariant(variant);
        const initialStocks: { [key: string]: number } = {};
        variant.variation_values.forEach((v) => {
            initialStocks[v.id] = v.stock;
        });
        setNewStocks(initialStocks);
    };

    const handleStockChange = (id: string, value: number | null) => {
        if (value !== null) {
            setNewStocks((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    const handleUpdateStock = (variationId: string) => {
        const updatedStock = newStocks[variationId];
        if (updatedStock !== undefined && updatedStock >= 0) {
            updateStock({ id: variationId, stock: updatedStock });
        } else {
            toast.error("Vui lòng nhập số lượng hợp lệ.");
        }
    };

    const { mutate: updateStock } = useMutation<
        unknown,
        Error,
        { id: string; stock: number }
    >({
        mutationFn: async ({ id, stock }) => {
            const response = await instance.put(
                `api/admins/inventory/updatestockproduct/${id}`,
                { stock }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Số lượng sản phẩm đã được cập nhật thành công!");
            queryCient.invalidateQueries({ queryKey: ['products'] });
            queryCient.invalidateQueries({ queryKey: ['activeProducts'] });
        },
        onError: (error) => {
            console.error("Lỗi:", error);
            toast.error(
                "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm. Hãy kiểm tra lại ID hoặc liên hệ với quản trị viên."
            );
        },
    });


    // danh mục 
    const { mutate: updateCategory } = useMutation<
        unknown,
        Error,
        { id: string; category_id: number }
    >({
        mutationFn: async ({ id, category_id }) => {
            const response = await instance.put(
                `api/admins/inventory/salecategory/${id}`,
                { category_id }
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success("Danh mục sản phẩm đã được cập nhật thành công!");
            setIsCategoryModalVisible(false);
        },
        onError: (error) => {
            console.error("Lỗi cập nhật danh mục:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật danh mục!");
        },
    });

    const handleCategoryChange = () => {
        if (!selectedProductId || !selectedCategoryId) {
            toast.error("Vui lòng chọn sản phẩm và danh mục!");
            return;
        }

        updateCategory({
            id: selectedProductId,
            category_id: parseInt(selectedCategoryId), // Đảm bảo `category_id` là kiểu số
        });
    };


    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await instance.get('http://localhost:8000/api/admins/categories');
            return response?.data;
        },
    });

    const categoryOptions = categories?.map((category: any) => ({
        value: category.id,
        label: category.name,
    }));

    if (loadingActive || loadingInactive || loadingOutOfStock || loadingLowStock)
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    const columns: Array<any> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: "50px",
            render: (_: any, __: Product, index: number) => <span>{index + 1}</span>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Ngày Nhập',
            dataIndex: 'product_cost',
            key: 'import_date',
            align: 'center',
            render: (product_cost: { import_date: string }) => product_cost?.import_date || 'Không có',
        },
        {
            title: 'Tổng Số Lượng',
            dataIndex: 'stock',
            key: 'stock',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: ['product_cost', 'sale_status'],
            key: 'sale_status',
            align: 'center',
            width: "100px",
            render: (sale_status: string) => {
                let statusLabel = '';
                let statusClass = '';

                switch (sale_status) {
                    case 'active':
                        statusLabel = 'Đang bán';
                        statusClass = ' text-green-500';
                        break;
                    case 'inactive':
                        statusLabel = 'Ngừng Bán';
                        statusClass = 'text-yellow-500';
                        break;
                    default:
                        statusLabel = 'Không xác định';
                        statusClass = 'bg-red-100 text-red-800';
                }

                return (
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                        {statusLabel}
                    </span>
                );
            },
        }
        ,
        {
            title: 'Giá nhập',
            dataIndex: 'product_cost',
            key: 'cost_price',
            align: 'center',
            render: (product_cost: { cost_price: string }) =>
                product_cost?.cost_price ? `${parseFloat(product_cost.cost_price).toLocaleString()} VND` : 'Không có',
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            render: (price: string) => `${parseFloat(price).toLocaleString()} VND`,
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'product_cost',
            key: 'supplier',
            align: 'center',
            render: (product_cost: { supplier: string }) => product_cost?.supplier || 'Không có',
        },
        {
            title: 'Số Lượng Hiện Tại',
            dataIndex: 'variations',
            key: 'variations',
            width: "100px",
            align: 'center',
            render: (variations: Variation[]) => (
                <div className=''>
                    {variations?.map((variation) => (
                        <Tooltip title={`Màu sắc: ${variation.attribute_value_image_variant.value}`} key={variation.id}>
                            <Button
                                type="link"
                                onClick={() => handleVariantClick(variation)}
                                style={{ padding: 0, margin: '5px' }}
                            >
                                <img
                                    src={variation.attribute_value_image_variant.image_path}
                                    alt={variation.attribute_value_image_variant.value}
                                    style={{ width: 20, height: 20, borderRadius: '50%' }}
                                />
                            </Button>
                        </Tooltip>
                    ))}
                </div>
            ),
        },
        ,
        {
            title: 'Danh mục',
            dataIndex: 'category_name',
            key: 'category_name',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (text: any, record: Product) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {record.product_cost?.sale_status === 'inactive' && (
                        <Button
                            type="primary"
                            onClick={() => {
                                updateProductStatus2(record.id);
                            }}
                        >
                            Đăng Bán
                        </Button>
                    )}
                    {record.product_cost?.sale_status === 'active' && (
                        <Button
                            type="primary"
                            danger
                            onClick={() => {
                                updateProductStatus(record.id);
                            }}
                        >
                            Ngừng bán
                        </Button>
                    )}
                    <Button
                        type="default"
                        onClick={() => {
                            setSelectedProductId(record.id);
                            setIsCategoryModalVisible(true);
                        }}
                    >
                        Thay đổi danh mục
                    </Button>
                </div>
            ),
        },

    ];



    const productDatas = productData?.map((product: Product, index: number) => ({
        key: product.id,
        index: index,
        ...product,
    }));

    const activeProducts = activeData?.map((product: Product, index: number) => ({
        key: product.id,
        index,
        ...product,
    }));

    const inactiveProducts = inactiveData?.map((product: Product, index: number) => ({
        key: product.id,
        index,
        ...product,
    }));

    const outOfStockProducts = outOfStockData?.map((product: Product, index: number) => ({
        key: product.id,
        index,
        ...product,
    }));

    const lowStockProducts = lowStockData?.map((product: Product, index: number) => ({
        key: product.id,
        index,
        ...product,
    }));

    const items = [
        {
            key: '1',
            label: 'Tất Cả',
            children: (
                <Table
                    dataSource={isFiltered ? filteredData : productDatas}
                    columns={columns}
                    bordered
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                    }}
                />
            ),
        },
        {
            key: '2',
            label: 'Đang bán',
            children: (
                <Table
                    dataSource={isFiltered ? filteredData : activeProducts}
                    columns={columns}
                    bordered
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                    }}
                />
            ),
        },
        {
            key: '3',
            label: 'Đang Bán (Sắp hết hàng) ',
            children: (
                <Table
                    dataSource={isFiltered ? filteredData : lowStockProducts}
                    columns={columns}
                    bordered
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                    }}
                />
            ),
        },
        {
            key: '4',
            label: 'Ngừng bán (Hàng Tồn)',
            children: (
                <Table
                    dataSource={isFiltered ? filteredData : inactiveProducts}
                    columns={columns}
                    bordered
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                    }}
                />
            ),
        },

        {
            key: '5',
            label: 'Hết hàng',
            children: <Table dataSource={outOfStockProducts} columns={columns} bordered />,
        },

    ];

    return (

        <div className="p-5">
            <ToastContainer />
            <Tabs
                defaultActiveKey="1"
                onChange={handleTabChange}
                items={items}
                tabBarExtraContent={
                    <Button icon={<FilterOutlined />} type="default" onClick={handleOpenFilterModal}>
                        Lọc
                    </Button>
                }
            />

            <Modal
                title={`Chi tiết biến thể: ${selectedVariant ? selectedVariant.attribute_value_image_variant.value : ''}`}
                visible={!!selectedVariant}
                onCancel={() => setSelectedVariant(null)}
                footer={null}
                centered
                width={600}
            >
                {selectedVariant ? (
                    <div className="p-5 space-y-5 text-sm text-gray-800">
                        <div className="text-lg font-semibold text-gray-700">
                            <strong>Màu sắc:</strong> {selectedVariant.attribute_value_image_variant.value}
                        </div>
                        <div className="space-y-4">
                            {selectedVariant.variation_values.map((variationValue) => (
                                <div key={variationValue.id} className="space-y-2">
                                    <div><strong>Size:</strong> {variationValue.value}</div>
                                    <div><strong>Số lượng hiện tại:</strong> {variationValue.stock}</div>
                                    <div>
                                        <strong className='mb-5'>Cập nhật số lượng:</strong>
                                        <div className='flex justify-center items-center'>
                                            <InputNumber
                                                min={0}
                                                onChange={(value) => handleStockChange(variationValue.id, value)}
                                                style={{ width: '50%' }}
                                            />
                                            <Button
                                                type="primary"
                                                style={{ marginTop: '10px' }}
                                                onClick={() => handleUpdateStock(variationValue.id)}
                                            >
                                                Cập nhật
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Chưa chọn biến thể</p>
                )}
            </Modal>
            <Modal
                title="Cập Nhật Danh Mục "
                visible={isCategoryModalVisible}
                onCancel={() => setIsCategoryModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsCategoryModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleCategoryChange}>
                        Cập nhật
                    </Button>,
                ]}
            >
                {isLoadingCategories ? (
                    <Spin />
                ) : (
                    <Form layout="vertical">
                        <Form.Item
                            label="Danh mục"
                            name="category_id"
                            rules={[{ required: true, message: 'Danh mục sản phẩm bắt buộc!' }]}
                        >
                            <Cascader
                                options={categoryOptions}
                                onChange={(value) => setSelectedCategoryId(value[0] as string)} // Lưu danh mục được chọn
                                placeholder="Chọn danh mục"
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <Modal
                title="Lọc sản phẩm"
                visible={isFilterModalVisible}
                onCancel={handleCloseFilterModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseFilterModal}>
                        Hủy
                    </Button>,
                    <Button key="apply" type="primary" onClick={handleApplyFilter}>
                        Áp dụng
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Ngày nhập">
                        <RangePicker
                            onChange={(dates, dateStrings) => setSelectedDates(dateStrings as [string, string])}
                        />
                    </Form.Item>

                    <Form.Item label="Danh mục">
                        <Select
                            placeholder="Chọn danh mục"
                            onChange={(value) => setSelectedCategoryId(value)}
                        >
                            {categories?.map((category: any) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Nhà cung cấp">
                        <Select
                            placeholder="Chọn nhà cung cấp"
                            onChange={(value) => setSelectedSupplier(value)}
                        >
                            {productData?.map((item: any, index: any) => (
                                <Select.Option key={index} value={item.product_cost.supplier}>
                                    {item.product_cost.supplier}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default InventoryManagement;

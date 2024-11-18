import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AxiosInstance from '@/configs/axios';
import { Form } from 'antd';

const fetchObsoleteProducts = async () => {
    const response = await AxiosInstance.post('http://localhost:8000/api/admins/inventory/');
    return response.data.obsolete_products;
};

const fetchCategories = async () => {
    const response = await AxiosInstance.get('http://localhost:8000/api/admins/categories');
    return response?.data;
};

// Hàm đệ quy để làm phẳng cây danh mục và thêm thụt lề cho danh mục con
const flattenCategories = (categories: any[], level = 0, result: any[] = []) => {
    categories.forEach((category) => {
        result.push({
            id: category.id,
            name: `${'     '.repeat(level)}${category.name}`, // Thêm thụt lề để phân biệt danh mục con
        });
        if (category.children_recursive && category.children_recursive.length > 0) {
            flattenCategories(category.children_recursive, level + 1, result);
        }
    });
    return result;
};

// Hàm để định dạng số tiền theo VND
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code', // Hiển thị "VND" thay vì ký hiệu "₫"
        minimumFractionDigits: 0, // Không hiển thị phần thập phân
    }).format(amount);
};

// Hàm để tạo bản đồ các danh mục cho việc hiển thị tên danh mục
const createCategoryMap = (categories: any[], map: Record<string, string> = {}) => {
    categories.forEach((category: any) => {
        map[category.id] = category.name;
        if (category.children_recursive && category.children_recursive.length > 0) {
            createCategoryMap(category.children_recursive, map);
        }
    });
    return map;
};

const InventoryManagement: React.FC = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['obsoleteProducts'],
        queryFn: fetchObsoleteProducts,
    });

    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    if (isLoading || isLoadingCategories) return <div>Loading...</div>;
    if (isError) return <div>Something went wrong</div>;

    const products = data?.data || [];
    const categoryMap = createCategoryMap(categories || []);
    const flattenedCategories = flattenCategories(categories || []);

    // Hàm lọc sản phẩm theo danh mục và các danh mục con
    const filterProductsByCategory = (product: any) => {
        if (!selectedCategory) return true;
        const categoryId = parseInt(selectedCategory, 10);

        // Kiểm tra nếu sản phẩm thuộc danh mục hoặc danh mục con
        const checkCategoryRecursive = (catId: number): boolean => {
            if (catId === categoryId) return true;
            const parentCategory = categories.find((category: any) =>
                category.children_recursive.some((child: any) => child.id === catId)
            );
            return parentCategory ? checkCategoryRecursive(parentCategory.id) : false;
        };

        return checkCategoryRecursive(product.category_id);
    };
    // Hàm lọc sản phẩm theo từ khóa
    const filterProductsByKeyword = (product: any) => {
        if (!searchKeyword) return true;
        const keyword = searchKeyword.toLowerCase();
        return (
            product.name.toLowerCase().includes(keyword) ||
            product.slug.toLowerCase().includes(keyword)
        );
    };
        // Kết hợp bộ lọc
        const filteredProducts = products
        .filter(filterProductsByCategory)
        .filter(filterProductsByKeyword);

    // Hàm tính "Giá trị tồn kho"
    const calculateInventoryValue = (product: any) => {
        return product.price * product.stock;
    };

    
    return (
        <div className="inventory-management-container p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Báo cáo tồn kho</h1>

            {/* Bộ lọc */}
            <Form layout="inline" className="flex justify-end gap-4 mb-4">
                <Form.Item
                    name="category_id"
                    className="w-full md:w-1/6"
                >
                    <select
                        id="category"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal"
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                    >
                        <option value="" className="text-gray-500">--Chọn danh mục--</option>
                        {flattenedCategories.map((category) => (
                            <option key={category.id} value={category.id} className="text-gray-700 font-normal">
                                {category.name}
                            </option>
                        ))}
                    </select>
                </Form.Item>

                <Form.Item className="w-full md:w-1/6">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-normal"
                        placeholder="Nhập tên, mã sản phẩm"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </Form.Item>
            </Form>


            {/* Bảng hiển thị */}
            <table className="inventory-table w-full text-center border-collapse shadow-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4">STT</th>
                        <th className="py-3 px-4">Tên sản phẩm</th>
                        <th className="py-3 px-4">Mã SKU</th>
                        <th className="py-3 px-4">Loại sản phẩm</th>
                        <th className="py-3 px-4">Tồn kho</th>
                        <th className="py-3 px-4">Giá sản phẩm</th>
                        <th className="py-3 px-4">Giá trị tồn kho</th>
                        <th className="py-3 px-4">Trạng Thái</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product: any, index: number) => (
                        <React.Fragment key={product.id}>
                            <tr className="border-b">
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>{index + 1}</td>
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>{product.name}</td>
                                <td className="py-4 px-4 border border-gray-300">
                                    {product.variations.length === 0 ? 'N/A' : ''}
                                </td>
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>{categoryMap[product.category_id] || 'N/A'}</td>
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>{product.stock}</td>
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>{formatCurrency(product.price)}</td>
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>{formatCurrency(calculateInventoryValue(product))}</td>
                                <td className="py-4 px-4 border border-gray-300" rowSpan={product.variations.length + 1}>
                                    {product.status_messages ? product.status_messages.map((message: string) => <div>{message}</div>) : 'Đang hoạt động'}
                                </td>
                            </tr>
                            {product.variations.map((variation: any) => (
                                <tr key={variation.id} className="border-b">
                                    <td className="py-4 px-4 border border-gray-300">
                                        {variation.variation_values.map((val: any) => (
                                            <div key={val.id}>
                                                {val.sku} ({variation.attribute_value.value} - {val.attribute_value.value})
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryManagement;

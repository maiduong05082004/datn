import React, { useState } from "react";
import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Spin, Table, Button, Select, Modal } from "antd";
import * as XLSX from "xlsx";
import { EyeOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { DatePicker } from "antd";
import { Option } from "antd/es/mentions";
const { RangePicker } = DatePicker;
type Props = {};

const reportInventory = (props: Props) => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        dates: null,
        slug: null,
        supplier: null,
    });
    const [tempFilters, setTempFilters] = useState({
        dates: null,
        slug: null,
        supplier: null,
    });

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const { data: reportData, isLoading, refetch } = useQuery({
        queryKey: ["reportInventory", filters],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (filters.dates) {
                queryParams.append("start_date", filters.dates[0]);
                queryParams.append("end_date", filters.dates[1]);
            }
            if (filters.slug) queryParams.append("slug", filters.slug);
            if (filters.supplier) queryParams.append("supplier", filters.supplier);

            const response = await instance.get(
                `http://127.0.0.1:8000/api/admins/inventory/listinventory?${queryParams}`
            );
            return response.data;
        },
    });

    const handleApplyFilter = () => {
        setFilters(tempFilters);
        setIsFilterModalVisible(false);
        refetch();
    };


    const uniqueSlugs: string[] = Array.from(
        new Set(reportData?.map((item: any) => item.slug))
    );
    const uniqueSuppliers: string[] = Array.from(
        new Set(reportData?.map((item: any) => item.supplier))
    );

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        const worksheetData: any[][] = [
            ["Báo Cáo Tồn Kho"],
            [],
            [
                "STT",
                "Tên Sản Phẩm",
                "Mã Sản Phẩm",
                "Nhà Cung Cấp",
                "Ngày",                 // Thêm cột Ngày vào đây
                "Nhập", "","",          // Gộp 3 cột "Nhập"
                "Xuất", "","",          // Gộp 3 cột "Xuất"
                "Tồn", "","",           // Gộp 3 cột "Tồn"
            ],
            [
                "", "", "",
                "", "",                  // Cột Nhà Cung Cấp, Ngày
                "Số lượng", "Đơn giá", "Thành tiền", // Cột con của Nhập
                "Số lượng", "Đơn giá", "Thành tiền", // Cột con của Xuất
                "Số lượng", "Đơn giá", "Thành tiền"  // Cột con của Tồn
            ]
        ];

        // Đổ dữ liệu từ API
        reportData?.forEach((item: any, index: number) => {
            worksheetData.push([
                index + 1,
                item.product_name || "",
                item.slug || "",
                item.supplier || "N/A",
                item.import_date || "N/A",  // Thêm dữ liệu Ngày tại đây
                item.total_imported_quantity || 0,
                `${item.import_price?.toLocaleString() || 0} VND`,
                `${item.total_imported_amount?.toLocaleString() || 0} VND`,
                item.total_exported_quantity || 0,
                `${item.export_price?.toLocaleString() || 0} VND`,
                `${item.total_exported_amount?.toLocaleString() || 0} VND`,
                item.remaining_quantity || 0,
                `${item.remaining_price?.toLocaleString() || 0} VND`,
                `${item.remaining_amount?.toLocaleString() || 0} VND`
            ]);
        });
        

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        worksheet["!merges"] = [
            { s: { r: 2, c: 5 }, e: { r: 2, c: 7 } }, // "Nhập" gộp 3 cột
            { s: { r: 2, c: 8 }, e: { r: 2, c: 10 } }, // "Xuất" gộp 3 cột
            { s: { r: 2, c: 11 }, e: { r: 2, c: 13 } } // "Tồn" gộp 3 cột
        ];
        

        worksheet["!cols"] = [
            { wch: 5 },
            { wch: 35 },
            { wch: 15 },
            { wch: 12 }, { wch: 15 }, { wch: 20 },
            { wch: 12 }, { wch: 15 }, { wch: 20 },
            { wch: 12 }, { wch: 15 }, { wch: 20 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Báo Cáo Tồn Kho");
        XLSX.writeFile(workbook, "inventory_report.xlsx");
    };

    if (isLoading)
        return (
            <Spin tip="Loading..." className="flex justify-center items-center h-screen" />
        );

    const dataSource = reportData?.map((item: any, index: number) => ({
        key: index,
        stt: index + 1,
        ...item,
    }));

    // Cấu hình cột cho bảng
    const columns: ColumnsType<any> = [
        { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center', width: "50px" },
        { title: 'Tên Sản Phẩm', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Mã Sản Phẩm', dataIndex: 'slug', key: 'slug', align: 'center' },
        { title: 'Nhà Cung Cấp', dataIndex: 'supplier', key: 'supplier', align: 'center' },
        { title: 'Ngày', dataIndex: 'import_date', key: 'import_date', width: "200px", align: 'center' },
        {
            title: 'Nhập',
            children: [
                { title: 'Số lượng', dataIndex: 'total_imported_quantity', key: 'total_imported_quantity', align: 'center' },
                { title: 'Đơn giá', dataIndex: 'import_price', key: 'import_price', align: 'center', render: (text: any) => `${text} VND` },
                { title: 'Thành tiền', dataIndex: 'total_imported_amount', key: 'total_imported_amount', align: 'center', render: (text: any) => `${text} VND` },
            ],
        },
        {
            title: 'Xuất',
            children: [
                { title: 'Số lượng', dataIndex: 'total_exported_quantity', key: 'total_exported_quantity', align: 'center' },
                { title: 'Đơn giá', dataIndex: 'export_price', key: 'export_price', align: 'center', render: (text: any) => `${text} VND` },
                { title: 'Thành tiền', dataIndex: 'total_exported_amount', key: 'total_exported_amount', align: 'center', render: (text: any) => `${text} VND` },
            ],
        },
        {
            title: 'Tồn',
            children: [
                { title: 'Số lượng', dataIndex: 'remaining_quantity', key: 'remaining_quantity', align: 'center' },
                { title: 'Đơn giá', dataIndex: 'remaining_price', key: 'remaining_price', align: 'center', render: (text: any) => `${text} VND` },
                { title: 'Thành tiền', dataIndex: 'remaining_amount', key: 'remaining_amount', align: 'center', render: (text: any) => `${text} VND` },
            ],
        },
        {
            title: 'Hành động',
            align: 'center',
            key: 'action',
            width: "100px",
            render: (_: any, report: any) => (
                <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/admin/dashboard/inventory/detail/${report.id}`)}
                />
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-[40px] font-semibold mb-5 uppercase text-center">Báo Cáo Tồn Kho</h1>
            <div className="flex justify-between">
                <div>
                    <Button onClick={exportToExcel} type="default" className="mb-4">
                        Export to Excel
                    </Button>
                </div>
                <div className="flex justify-end mb-4">
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={() => setIsFilterModalVisible(true)}
                    >
                        Lọc
                    </Button>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                pagination={{
                    pageSize: 7,
                    showTotal: (total) => `Tổng ${total} danh mục`,
                }}
            />
            <Modal
                title="Lọc Dữ Liệu"
                open={isFilterModalVisible}
                onCancel={() => setIsFilterModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsFilterModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="apply" type="primary" onClick={handleApplyFilter}>
                        Áp dụng
                    </Button>,
                ]}
            >
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Ngày nhập</label>
                    <RangePicker
                        style={{ width: "100%" }}
                        onChange={(values, dateStrings) =>
                            setTempFilters((prev: any) => ({
                                ...prev,
                                dates: dateStrings[0] && dateStrings[1] ? dateStrings : null,
                            }))
                        }
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Slug</label>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn Slug"
                        onChange={(value) =>
                            setTempFilters((prev) => ({ ...prev, slug: value }))
                        }
                        allowClear
                    >
                        {uniqueSlugs.map((slug) => (
                            <Option key={slug} value={slug}>
                                {slug}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Nhà Cung Cấp</label>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn Nhà Cung Cấp"
                        onChange={(value) =>
                            setTempFilters((prev) => ({ ...prev, supplier: value }))
                        }
                        allowClear
                    >
                        {uniqueSuppliers.map((supplier) => (
                            <Option key={supplier} value={supplier}>
                                {supplier}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Modal>
        </div>
    );
};

export default reportInventory;

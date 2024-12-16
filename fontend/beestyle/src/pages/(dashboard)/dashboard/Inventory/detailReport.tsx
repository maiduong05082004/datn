import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Button, Spin ,DatePicker } from 'antd';
import instance from '@/configs/axios';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;
const DetailReport: React.FC = () => {
    const { id } = useParams();

    const { data: reportData, isLoading } = useQuery({
        queryKey: ['reportInventory', id],
        queryFn: async () => {
            const response = await instance.get(`/api/admins/inventory/getprodetails/${id}`);
            return response.data;
        },
    });
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Prepare worksheet
        const worksheetData: any[][] = [
            ['Product Name', reportData?.product_name],
            ['Slug', reportData?.slug],
            ['Total Stock', reportData?.total_stock],
            [],
            ['Import Date', 'Import Time', 'Color', 'Size', 'Quantity'],
        ];

        // Add data rows
        reportData?.import_details?.forEach((importDetail: any) => {
            importDetail.detail.forEach((item: any) => {
                worksheetData.push([
                    importDetail.import_date,
                    importDetail.import_time,
                    item.color,
                    item.size,
                    item.quantity,
                ]);
            });
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Detail Report');
        XLSX.writeFile(workbook, 'detail_report.xlsx');
    };

    if (isLoading)
        return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    const columns: Array<any> = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            width: 50,
            render: (_: any, record: any, index: number) => (
                <div className="text-gray-600 text-center">{index + 1}</div>
            ),
        },
        {
            title: 'Ngày Nhập',
            dataIndex: 'import_date',
            key: 'import_date',
            align: 'center',
            render: (text: string) => (
                <div className="text-gray-700">{text}</div>
            ),
        },
        {
            title: 'Thời Gian Nhập',
            dataIndex: 'import_time',
            key: 'import_time',
            align: 'center',
            render: (text: string) => (
                <div className="text-gray-700">{text}</div>
            ),
        },
        {
            title: 'Màu Sắc',
            dataIndex: 'color',
            key: 'color',
            align: 'center',
            render: (text: string) => (
                <div className="text-gray-700">{text}</div>
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            align: 'center',
            render: (text: string) => (
                <div className="text-gray-700">{text}</div>
            ),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (text: number) => (
                <div className="text-gray-800 font-semibold">{text}</div>
            ),
        },
    ];

    // Prepare Table Data - Correctly flatten the nested structure
    const dataSource = reportData?.import_details?.flatMap((importDetail: any) =>
        importDetail.detail.map((item: any) => ({
            import_date: importDetail.import_date,
            import_time: importDetail.import_time,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
        }))
    ) || [];

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {reportData?.product_name}
                </h1>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                        <span className="text-gray-600 font-medium">Slug: </span>
                        <span className="text-gray-800">{reportData?.slug}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Total Stock: </span>
                        <span className="text-gray-800 font-semibold">
                            {reportData?.total_stock}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end mb-4">
                    <Button
                        type="primary"
                        onClick={exportToExcel}
                        className="flex items-center"
                    >
                        Export to Excel
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Tổng ${total} sản phẩm`,
                }}
                bordered
            />
        </div>
    );
};

export default DetailReport;
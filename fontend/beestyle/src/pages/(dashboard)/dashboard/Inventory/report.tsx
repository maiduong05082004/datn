import instance from '@/configs/axios';
import { useQuery } from '@tanstack/react-query';
import { Spin, Table, Button } from 'antd';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Space } from 'lucide-react';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';

type Props = {}

const reportInventory = (props: Props) => {
    const navigate = useNavigate();
    const { data: reportData, isLoading } = useQuery({
        queryKey: ['reportInventory'],
        queryFn: async () => {
            const response = await instance.get('http://127.0.0.1:8000/api/admins/inventory/listinventory');
            return response.data;
        },
    });
    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = [
            "STT",
            "Product Name",
            "Slug",
            "Nhập - Số lượng",
            "Nhập - Đơn giá",
            "Nhập - Thành tiền",
            "Xuất - Số lượng",
            "Xuất - Đơn giá",
            "Xuất - Thành tiền",
            "Tồn - Số lượng",
            "Tồn - Đơn giá",
            "Tồn - Thành tiền"
        ];
        const tableRows: (string | number)[][] = [];

        reportData.forEach((item: any, index: number) => {
            const row = [
                index + 1,
                item.product_name,
                item.slug,
                item.total_imported_quantity,
                item.cost_price,
                item.total_imported_amount,
                item.total_exported_quantity,
                item.export_price,
                item.total_exported_amount,
                item.remaining_quantity,
                item.remaining_price,
                item.remaining_amount
            ];
            tableRows.push(row);
        });

        doc.text("Inventory Report", 14, 15); // Title
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });


        doc.save("inventory_report.pdf");
    };

    if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

    const dataSource = reportData?.map((item: any, index: number) => ({
        key: index,
        stt: index + 1,
        ...item,
    }));
    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',
            width: "50px"
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            align: 'center',
        },
        {
            title: 'Nhập',
            children: [
                {
                    title: 'Số lượng',
                    dataIndex: 'total_imported_quantity',
                    key: 'total_imported_quantity',
                    align: 'center',
                },
                {
                    title: 'Đơn giá',
                    dataIndex: 'cost_price',
                    key: 'cost_price',
                    align: 'center',
                    render: (text: any) => `${text} VND`, 
                },
                {
                    title: 'Thành tiền',
                    dataIndex: 'total_imported_amount',
                    key: 'total_imported_amount',
                    align: 'center',
                    render: (text: any) => `${text} VND`, 
                },
            ],
        },
        {
            title: 'Xuất',
            children: [
                {
                    title: 'Số lượng',
                    dataIndex: 'total_exported_quantity',
                    key: 'total_exported_quantity',
                    align: 'center',
                },
                {
                    title: 'Đơn giá',
                    dataIndex: 'export_price',
                    key: 'export_price',
                    width: "100px",
                    align: 'center',

                    render: (text: any) => `${text} VND`, 
                },
                {
                    title: 'Thành tiền',
                    dataIndex: 'total_exported_amount',
                    key: 'total_exported_amount',
                    align: 'center',
                    render: (text: any) => `${text} VND`, 
                },
            ],
        },
        {
            title: 'Tồn',
            children: [
                {
                    title: 'Số lượng',
                    dataIndex: 'remaining_quantity',
                    key: 'remaining_quantity',
                    align: 'center',
                },
                {
                    title: 'Đơn giá',
                    dataIndex: 'remaining_price',
                    key: 'remaining_price',
                    align: 'center',
                    render: (text: any) => `${text} VND`, 
                },
                {
                    title: 'Thành tiền',
                    dataIndex: 'remaining_amount',
                    key: 'remaining_amount',
                    align: 'center',
                    render: (text: any) => `${text} VND`, 
                },
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
            <h1 className="text-xl font-bold mb-4">Báo Cáo Tồn Kho</h1>
            <Button onClick={exportToPDF} type="primary" className="mb-4">
                Export to PDF
            </Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                pagination={{
                    pageSize: 7,
                    showTotal: (total) => `Tổng ${total} danh mục`,
                }}
            />
        </div>
    );
};

export default reportInventory;

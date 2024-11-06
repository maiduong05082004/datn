import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, message, Spin, Table } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useState } from 'react';

type BillRecord = {
  id: number;
  code_orders: string;
  status_bill: string;
  payment_type_description: string;
  status_description: string;
  quantity: number;
  total: string;
  order_date: string;
  order_time: string;
};

const ListBill: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const [billData, setBillData] = useState<BillRecord[]>([]);

  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      pending: 'Mới',
      processed: 'Xác Nhận Đơn Hàng',
      canceled: 'Hủy Đơn Hàng',
      remove: 'Xóa Đơn Hàng',
    };
    return statusMap[status] || 'Unknown';
  };

  const getApiUrl = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'http://127.0.0.1:8000/api/admins/orders/pending?page=1&per_page=5';
      case 'processing':
        return 'http://127.0.0.1:8000/api/admins/orders/processed?page=1&per_page=2';
      case 'shipping':
        return 'http://127.0.0.1:8000/api/admins/orders/shipped?page=1&per_page=3';
      case 'delivered':
        return 'http://127.0.0.1:8000/api/admins/orders/delivered?page=1&per_page=4';
      case 'canceled':
        return 'http://127.0.0.1:8000/api/admins/orders/canceled?page=1&per_page=4';
      default:
        return 'http://127.0.0.1:8000/api/admins/orders?page=1&per_page=10';
    }
  };

  const getApiUrlSearch = (status: string, code: string) => {
    let baseUrl;
    switch (status) {
      case 'pending':
        baseUrl = `http://127.0.0.1:8000/api/admins/orders/search-pending?order_code=${code}`;
        break;
      case 'processing':
        baseUrl = `http://127.0.0.1:8000/api/admins/orders/search-processed?order_code=${code}`;
        break;
      case 'shipping':
        baseUrl = `http://127.0.0.1:8000/api/admins/orders/search-shipped?order_code=${code}`;
        break;
      case 'delivered':
        baseUrl = `http://127.0.0.1:8000/api/admins/orders/search-delivered?order_code=${code}`;
        break;
      case 'canceled':
        baseUrl = `http://127.0.0.1:8000/api/admins/orders/search-canceled?order_code=${code}`;
        break;
      default:
        baseUrl = `http://127.0.0.1:8000/api/admins/orders/search_order?order_code=${code}`;
    }
    return baseUrl;
  };

  const { data: BillData, isLoading, refetch } = useQuery({
    queryKey: ['products', filterStatus],
    queryFn: async () => {
      const response = await axiosInstance.get(getApiUrl(filterStatus));
      setBillData(response.data.bills);
      return response.data;
    }
  });

  const searchBill = async () => {
    if (searchCode) {
      try {
        const response = await axiosInstance.post(getApiUrlSearch(filterStatus, searchCode));
        setBillData(response.data.bills);
        messageApi.success('Tìm kiếm đơn hàng thành công.');
      } catch (error) {
        messageApi.error('Tìm kiếm đơn hàng thất bại.');
      }
    } else {
      messageApi.warning('Vui lòng nhập mã đơn hàng để tìm kiếm.');
    }
  };

  const handleFilterStatusChange = (status: string) => {
    setFilterStatus(status);
    refetch();
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'code_orders',
      key: 'code_orders',
    },
    {
      title: 'Hình Thức Thanh Toán',
      dataIndex: 'payment_type_description',
      key: 'payment_type_description',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status_description',
      key: 'status_description',
      render: (text: string) => (
        <div className="p-1 rounded bg-yellow-200 text-yellow-800">{text}</div>
      ),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng Thanh Toán',
      dataIndex: 'total',
      key: 'total',
      render: (text: string) => <div>{parseFloat(text).toLocaleString()} đ</div>,
    },
    {
      title: 'Ngày Đặt Hàng',
      key: 'order_date',
      render: (record: BillRecord) => (
        <div>{`${record.order_date} ${record.order_time}`}</div>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (record: BillRecord) => (
        <div className="relative w-[180px]">
          <select
            defaultValue={record.status_bill}
            // onChange={(e) => onSubmit(record, e.target.value)}
            className="block w-full h-[40px] px-4 pr-8 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
          >
            {/* Display relevant options based on current status */}
            {record.status_bill === 'pending' && (
              <>
                <option value="pending">Mới</option>
                <option value="processed">Xác Nhận Đơn Hàng</option>
                <option value="canceled">Hủy Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'processed' && (
              <>
                <option value="processed">Xác Nhận Đơn Hàng</option>
                <option value="shipping">Đang Vận Chuyển</option>
                <option value="canceled">Hủy Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'shipping' && (
              <>
                <option value="shipping">Đang Vận Chuyển</option>
                <option value="delivered">Đã Giao Hàng</option>
              </>
            )}
            {record.status_bill === 'delivered' && (
              <option value="delivered">Đã Giao Hàng</option>
            )}
            {record.status_bill === 'canceled' && (
              <>
                <option value="canceled">Hủy Đơn Hàng</option>
                <option value="remove">Xóa Đơn Hàng</option>
              </>
            )}
          </select>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">▼</span>
        </div>
      ),
    },
  ];

  const searchColumns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'code_orders',
      key: 'code_orders',
    },
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'order_date',
      key: 'order_date',
    },
    {
      title: 'Thời Gian Đặt Hàng',
      dataIndex: 'order_time',
      key: 'order_time',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status_description',
      key: 'status_description',
      render: (text: any) => (
        <div className="p-1 rounded bg-yellow-200 text-yellow-800">{text}</div>
      ),
    },
    {
      title: 'Hình Thức Thanh Toán',
      dataIndex: 'payment_type_description',
      key: 'payment_type_description',
    },
    {
      title: 'Tổng Thanh Toán',
      dataIndex: 'total',
      key: 'total',
      render: (text: any) => <div>{parseFloat(text).toLocaleString()} đ</div>,
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      {contextHolder}
      <div className="w-[95%] mx-auto p-6 bg-slate-100">
        <div className="flex justify-between items-center mb-6 pt-5">
          <div className="flex gap-2">
            <button onClick={() => handleFilterStatusChange('all')} className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300">
              <div>
                <h2>Tất Cả</h2>
                <p>{BillData?.bills.length || 0} Đơn Hàng</p>
              </div>
            </button>
            <button onClick={() => handleFilterStatusChange('pending')} className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300">
              <div>
                <h2>Chờ Xác Nhận</h2>
                <p>{BillData?.bills.filter((bill: any) => bill.status_bill === 'pending').length || 0} đơn quá hạn XN</p>
              </div>
            </button>
            <button onClick={() => handleFilterStatusChange('processing')} className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300">
              <div>
                <h2>Đã Xử Lý</h2>
                <p>{BillData?.bills.filter((bill: any) => bill.status_bill === 'processing').length || 0} Đơn Hàng</p>
              </div>
            </button>
            <button onClick={() => handleFilterStatusChange('shipping')} className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300">
              <div>
                <h2>Đang Vận Chuyển</h2>
                <p>{BillData?.bills.filter((bill: any) => bill.status_bill === 'shipping').length || 0} Đơn Hàng</p>
              </div>
            </button>
            <button onClick={() => handleFilterStatusChange('delivered')} className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300">
              <div>
                <h2>Đã Giao Hàng</h2>
                <p>{BillData?.bills.filter((bill: any) => bill.status_bill === 'delivered').length || 0} Đơn Hàng</p>
              </div>
            </button>
            <button onClick={() => handleFilterStatusChange('canceled')} className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300">
              <div>
                <h2>Đã Hủy</h2>
                <p>{BillData?.bills.filter((bill: any) => bill.status_bill === 'canceled').length || 0} Đơn Hàng</p>
              </div>
            </button>
          </div>
        </div>
        <div className="w-[100%] h-auto bg-white p-6">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              className="border p-2 rounded w-[500px]"
              placeholder="Nhập mã đơn hàng để tìm kiếm..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <Button type="primary" onClick={searchBill}>Tìm Kiếm</Button>
          </div>
          <Table
            columns={searchColumns}
            dataSource={billData || []}
            rowKey={(record) => record.id}
            bordered
          />
        </div>
        <div className="overflow-x-auto pt-5">
          <div className='bg-white pt-5'>
            <div className='w-[97%] mx-auto'>
              <Table
                columns={columns}
                dataSource={BillData?.bills || []}
                rowKey={(record) => record.id}
                bordered
                pagination={{
                  pageSize: BillData?.pagination?.per_page,
                  current: BillData?.pagination?.current_page,
                  total: BillData?.pagination?.total,
                  showTotal: (total) => `Tổng ${total} danh mục`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListBill;

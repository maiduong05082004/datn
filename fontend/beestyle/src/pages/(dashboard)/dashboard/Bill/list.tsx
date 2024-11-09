import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Spin, Table } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

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
  isHighlighted?: boolean;
};

const ListBill: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');
  const [billData, setBillData] = useState<BillRecord[]>([]);
  const navigate = useNavigate();

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

        if (response.data.bill) {
          const updatedBillData = billData
            .map((bill) =>
              bill.id === response.data.bill.id ? { ...bill, isHighlighted: true } : { ...bill, isHighlighted: false }
            )
            .sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0)); // Move highlighted bills to the top
          setBillData(updatedBillData);
        } else if (response.data.bills) {
          const highlightedIds = response.data.bills.map((bill: BillRecord) => bill.id);
          const updatedBillData = billData
            .map((bill) =>
              highlightedIds.includes(bill.id) ? { ...bill, isHighlighted: true } : { ...bill, isHighlighted: false }
            )
            .sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0)); // Move highlighted bills to the top
          setBillData(updatedBillData);
        }
      } catch (error) {
        toast.error('Mã Đơn Hàng Không Tìm Thấy!');
      }
    } else {
      toast.warning('Vui lòng nhập mã đơn hàng để tìm kiếm.');
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
      render: (_: any, __: any, index: number) => <span className="text-gray-700 font-medium">{index + 1}</span>,
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'code_orders',
      key: 'code_orders',
      render: (text: string) => <span className="text-blue-600 font-semibold">{text}</span>,
    },
    {
      title: 'Hình Thức Thanh Toán',
      dataIndex: 'payment_type_description',
      key: 'payment_type_description',
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status_bill',
      key: 'status_bill',
      render: (text: string) => (
        <div className="p-2 rounded-md bg-yellow-200 text-yellow-800 font-bold text-center shadow-md">{text}</div>
      ),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: 'Tổng Thanh Toán',
      dataIndex: 'total',
      key: 'total',
      render: (text: string) => <span className="text-green-600 font-bold">{parseFloat(text).toLocaleString()} đ</span>,
    },
    {
      title: 'Ngày Đặt Hàng',
      key: 'order_date',
      render: (record: BillRecord) => (
        <div className="text-gray-700">{`${record.order_date} ${record.order_time}`}</div>
      ),
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (record: BillRecord) => (
        <div className="relative w-[180px]">
          <select
            defaultValue={record.status_bill}
            onChange={async (e) => {
              const newStatus = e.target.value;
              try {
                await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/update_order/${record.id}`, { status: newStatus });
                toast.success('Trạng thái đơn hàng đã được cập nhật thành công.');
                refetch();
              } catch (error) {
                toast.error('Không thể cập nhật trạng thái đơn hàng.');
              }
            }}
            className="block w-full h-[40px] px-4 pr-8 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none shadow-md"
          >
            {record.status_bill === 'pending' && (
              <>
                <option value="pending">Mới</option>
                <option value="processed">Xác Nhận Đơn Hàng</option>
                <option value="canceled">Hủy Đơn Hàng</option>
                <option value="remove">Xóa Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'processed' && (
              <>
                <option value="processed">Đã Xác Nhận Đơn Hàng</option>
                <option value="shipping">Đang Vận Chuyển</option>
                <option value="canceled">Hủy Đơn Hàng</option>
                <option value="remove">Xóa Đơn Hàng</option>
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
    {
      title: 'Thao Tác',
      key: 'action',
      render: (record: BillRecord) => (
        <div className="relative w-[180px] flex gap-2">
          {/* Display "Xem Chi Tiết" button for specific statuses */}
          {['pending', 'shipping', 'confirmed'].includes(record.status_bill) && (
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/bill/detail/${record.id}`)}
              className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md shadow-md"
            >
              Xem Chi Tiết
            </Button>
          )}
    
          {['processed'].includes(record.status_bill) && (
            <Button
              type="default"
              onClick={() => navigate(`/admin/bill/shiping/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md"
            >
              Gửi Đơn Hàng Sang GHN
            </Button>
          )}
        </div>
      ),
    }
    

  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <ToastContainer />
      <div className="w-[95%] mx-auto p-6 bg-slate-100 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-6 pt-5">
          <div className="flex gap-4">
            {['all', 'pending', 'processing', 'shipping', 'delivered', 'canceled'].map((status, index) => (
              <button
                key={index}
                onClick={() => handleFilterStatusChange(status)}
                className={`w-[180px] h-[50px] bg-gray-200 rounded-lg shadow hover:bg-gray-300 focus:bg-gray-400 focus:outline-none transition-all duration-200`}
              >
                <div className="flex flex-col items-center">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {status === 'all' ? 'Tất Cả' :
                      status === 'pending' ? 'Chờ Xác Nhận' :
                        status === 'processing' ? 'Đã Xác Nhận' :
                          status === 'shipping' ? 'Đang Vận Chuyển' :
                            status === 'delivered' ? 'Đã Giao Hàng' : 'Đã Hủy'}
                  </h2>
                  <p className="text-gray-600">
                    {BillData?.bills?.filter((bill: BillRecord) => status === 'all' || bill.status_bill === status).length || 0} Đơn Hàng
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="w-[100%] h-auto bg-white p-6 rounded-md shadow">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              className="border p-2 rounded-lg w-[500px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập mã đơn hàng để tìm kiếm..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <Button type="primary" onClick={searchBill} className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md">
              Tìm Kiếm
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto pt-5">
          <div className='bg-white pt-5 rounded-md shadow-md pb-5'>
            <div className='w-[97%] mx-auto'>
              <Table
                columns={columns}
                dataSource={billData}
                rowClassName={(record) => (record.isHighlighted ? 'bg-green-100 border-2 border-green-500' : '')}
                rowKey={(record) => record.id}
                bordered
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Tổng ${total} sản phẩm`,
                }}
                className="rounded-lg shadow-lg"
              />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListBill;

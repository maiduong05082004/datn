import { ShoppingCartOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Spin, Table, DatePicker, Input, Select, Drawer } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import useMessage from 'antd/es/message/useMessage';
import { CheckCircle } from 'lucide-react';

const { RangePicker } = DatePicker;
const { Option } = Select;

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
  phone: string;
  isHighlighted?: boolean;
};

const ListBill: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchCode, setSearchCode] = useState<string>('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [billData, setBillData] = useState<BillRecord[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [messageApi, contextHolder] = useMessage();
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

  const handleDeleteShipping = async (billId: number) => {
    try {
      await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/update_order/${billId}`, { status: 'canceled' });
      toast.success('Đơn hàng đã được hủy thành công.');
      refetch();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể hủy đơn hàng.';
      toast.error(errorMessage);
    }
  };

  const handleAssignShipping = async (billId: number) => {
    try {
      await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/update_order/${billId}`, { status: 'shipped' });
      toast.success('Trạng thái đơn hàng đã được cập nhật thành công thành "Đang Vận Chuyển".');
      refetch();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể bàn giao đơn hàng cho đơn vị vận chuyển.';
      toast.error(errorMessage);
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', filterStatus],
    queryFn: async () => {
      const response = await axiosInstance.get(getApiUrl(filterStatus));
      setBillData(response.data.bills);
      return response.data;
    },
  });

  const filterBill = (status: string) => {
    let baseUrl = `http://127.0.0.1:8000/api/admins/orders/${status !== 'all' ? status : ''}?`;
    if (startDate && endDate) {
      baseUrl += `start_date=${startDate.split(' ')[0]}&start_time=${startDate.split(' ')[1]}&`;
      baseUrl += `end_date=${endDate.split(' ')[0]}&end_time=${endDate.split(' ')[1]}&`;
    }
    if (phone) {
      baseUrl += `phone=${phone}&`;
    }
    if (paymentType) {
      baseUrl += `payment_type=${paymentType}&`;
    }
    if (promoCode) {
      baseUrl += `promotion_code=${promoCode}&`;
    }
    return baseUrl;
  };


  const fetchFilteredBills = async () => {
    try {
      const response = await axiosInstance.get(filterBill(filterStatus));
      setBillData(response.data.bills);
    } catch (error) {
      toast.error('Không thể lấy dữ liệu hóa đơn!');
    }
  };

  const calculateBillCounts = () => {
    const counts = billData.reduce(
      (acc, bill) => {
        acc.all += 1;
        // Ép kiểu status_bill để đảm bảo chỉ nhận giá trị hợp lệ
        if (
          bill.status_bill === 'pending' ||
          bill.status_bill === 'processing' ||
          bill.status_bill === 'shipping' ||
          bill.status_bill === 'delivered' ||
          bill.status_bill === 'canceled'
        ) {
          acc[bill.status_bill] += 1;
        }
        return acc;
      },
      { all: 0, pending: 0, processing: 0, shipping: 0, delivered: 0, canceled: 0 }
    );
    return counts;
  };


  // Tính toán số lượng mỗi khi `billData` thay đổi
  useEffect(() => {
    const counts = calculateBillCounts();
    setBillCounts(counts);
  }, [billData]);

  // Trạng thái lưu số lượng
  const [billCounts, setBillCounts] = useState({
    all: 0,
    pending: 0,
    processing: 0,
    shipping: 0,
    delivered: 0,
    canceled: 0,
  });


  const handleFilterApply = () => {
    fetchFilteredBills();
    setIsFilterVisible(false);
  };

  const searchBill = async () => {
    if (searchCode) {
      try {
        const response = await axiosInstance.post(getApiUrlSearch(filterStatus, searchCode));

        if (response.data.bill) {
          const updatedBillData = billData
            .map((bill) =>
              bill.id === response.data.bill.id ? { ...bill, isHighlighted: true } : { ...bill, isHighlighted: false }
            )
            .sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0));
          setBillData(updatedBillData);
        } else if (response.data.bills) {
          const highlightedIds = response.data.bills.map((bill: BillRecord) => bill.id);
          const updatedBillData = billData
            .map((bill) =>
              highlightedIds.includes(bill.id) ? { ...bill, isHighlighted: true } : { ...bill, isHighlighted: false }
            )
            .sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0));
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
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: 'Hình Thức Thanh Toán',
      dataIndex: 'payment_type_description',
      key: 'payment_type_description',
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },

    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: any, b: any) => parseFloat(a.quantity) - parseFloat(b.quantity),
      render: (text: number) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: 'Tổng Thanh Toán',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: any, b: any) => parseFloat(a.total) - parseFloat(b.total),
      render: (text: string) => <span className="font-bold">{parseFloat(text).toLocaleString()} đ</span>,
    },
    {
      title: 'Ngày Đặt Hàng',
      key: 'order_date',
      render: (record: BillRecord) => (
        <div className="text-gray-700">{`${record.order_date} ${record.order_time}`}</div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status_bill',
      key: 'status_bill',
      render: (text: string) => {
        let vietnameseStatus = '';
        switch (text) {
          case 'pending':
            vietnameseStatus = 'Chưa xử lý giao hàng';
            break;
          case 'processed':
            vietnameseStatus = 'Chờ lấy hàng';
            break;
          case 'shipped':
            vietnameseStatus = 'Đang giao hàng';
            break;
          case 'delivered':
            vietnameseStatus = 'Đã giao hàng';
            break;
          case 'canceled':
            vietnameseStatus = 'Đã hủy';
            break;
          default:
            vietnameseStatus = 'Không xác định';
        }
        return <div className="p-2 rounded-md text-green-500 font-semibold">{vietnameseStatus}</div>;
      },
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
                if (newStatus === 'shipping') {
                  await handleAssignShipping(record.id);
                } else if (newStatus === 'canceled') {
                  await handleDeleteShipping(record.id);
                } else {
                  await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/update_order/${record.id}`, { status: newStatus });
                  toast.success('Trạng thái đơn hàng đã được cập nhật thành công.');
                  refetch();
                }
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
                {/* <option value="remove">Xóa Đơn Hàng</option> */}
              </>
            )}
            {record.status_bill === 'processed' && (
              <>
                <option value="processed">Đã Xác Nhận Đơn Hàng</option>
                <option value="shipping">Bàn Giao Đơn Vị Vận Chuyển</option>
                <option value="canceled">Hủy Đơn Hàng</option>
                {/* <option value="remove">Xóa Đơn Hàng</option> */}
              </>
            )}
            {record.status_bill === 'shipped' && (
              <>
                <option value="shipped">Bàn Giao Đơn Vị Vận Chuyển</option>
                <option value="delivered">Đã Giao Hàng</option>
                <option value="canceled">Hủy Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'delivered' && (
              <option value="delivered">Đã Giao Hàng</option>
            )}
            {record.status_bill === 'canceled' && (
              <>
                <option value="canceled">Hủy Đơn Hàng</option>
                {/* <option value="remove">Xóa Đơn Hàng</option> */}
              </>
            )}
          </select>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">▼</span>
        </div>
      ),
    }
    ,
    {
      title: 'Xem Chi Tiết',
      key: 'action',
      render: (record: BillRecord) => (
        <div className=" w-[140px]">
          {['pending', 'shipping', 'confirmed'].includes(record.status_bill) && (
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/dashboard/bill/detail/${record.id}`)}
              className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md shadow-md"
            >
              Xem Chi Tiết
            </Button>
          )}

          {['shipped'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/shiping/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md"
            >
              Vận Chuyển
            </Button>
          )}
          {['processed'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/detailConfirm/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md"
            >
              Đơn Xác Nhận
            </Button>
          )}
          {['delivered'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/detailship/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md"
            >
              Đơn Hàng
            </Button>
          )}
          {['canceled'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/cancel/${record.id}`)}
              className="bg-red-500 text-white hover:bg-red-600 focus:bg-red-700 rounded-md shadow-md"
            >
              Đơn Hủy 
            </Button>
          )}

        </div>
      ),
    },
  ];

  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <ToastContainer />
      <div className='p-5'>
        <div className="w-[100%]">
          <div className="flex justify-between items-center mb-5">
            <div className="flex gap-4 w-full">
              {['all', 'pending', 'processing', 'shipping', 'delivered', 'canceled'].map((status, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterStatusChange(status)}
                  className={` flex justify-center items-center py-2 pt-3 border-b-2 transition duration-300 ease-in-out
                  ${filterStatus === status ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-500'}
                  hover:text-blue-600 hover:border-gray-200`}
                >
                  <h2 className="text-[16px]">
                    {status === 'all'
                      ? `Tất Cả (${billCounts.all})`
                      : status === 'pending'
                        ? `Chưa xử lý giao hàng (${billCounts.pending})`
                        : status === 'processing'
                          ? `Chờ lấy hàng (${billCounts.processing})`
                          : status === 'shipping'
                            ? `Đang giao hàng (${billCounts.shipping})`
                            : status === 'delivered'
                              ? `Chưa thanh toán (${billCounts.delivered})`
                              : `Đã Hủy (${billCounts.canceled})`}
                  </h2>
                </button>
              ))}
            </div>
          </div>
          <div className="w-[100%] h-auto">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Nhập mã đơn hàng để tìm kiếm..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-[1000px] h-[40px]"
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={searchBill} className="h-[40px] bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md">
                Tìm Kiếm
              </Button>
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={() => setIsFilterVisible(true)}
                className="h-[40px] bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md shadow-md"
              >
                Lọc
              </Button>
            </div>
          </div>

          <Drawer
            title={<span className="text-lg font-bold text-gray-800">Lọc Hóa Đơn</span>}
            placement="right"
            onClose={() => setIsFilterVisible(false)}
            visible={isFilterVisible}
            width={400}
            className="bg-gray-50 shadow-lg"
          >
            <div className="p-4 space-y-4">
              <RangePicker
                showTime
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(dates) => {
                  if (dates) {
                    setStartDate(dates[0]?.format('YYYY-MM-DD HH:mm:ss') || null);
                    setEndDate(dates[1]?.format('YYYY-MM-DD HH:mm:ss') || null);
                  } else {
                    setStartDate(null);
                    setEndDate(null);
                  }
                }}
              />


              <Input
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Select
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Hình thức thanh toán"
                onChange={(value) => setPaymentType(value)}
                allowClear
              >
                <Option value="online">Online</Option>
                <Option value="cod">COD</Option>
              </Select>
              <Input
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mã khuyến mãi"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button
                onClick={handleFilterApply}
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out"
              >
                Áp dụng
              </Button>
            </div>
          </Drawer>


          <div className="overflow-x-auto pt-5">
            <div className=''>
              <div className='w-[100%] mx-auto'>
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
      </div>
    </>
  );
};

export default ListBill;

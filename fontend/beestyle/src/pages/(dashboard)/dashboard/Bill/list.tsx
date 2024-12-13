import { ShoppingCartOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Spin, Table, DatePicker, Input, Select, Drawer, Tabs } from 'antd';
import instance from '@/configs/axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import useMessage from 'antd/es/message/useMessage';
import { CheckCircle } from 'lucide-react';
import { ColumnsType } from 'antd/es/table';
import TabPane from 'antd/es/tabs/TabPane';

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
  const navigate = useNavigate();



  const getApiUrl = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'api/admins/orders/pending?page=1&per_page=10';
      case 'processing':
        return 'api/admins/orders/processed?page=1&per_page=10';
      case 'shipping':
        return 'api/admins/orders/shipped?page=1&per_page=10';
      case 'delivered':
        return 'api/admins/orders/delivered?page=1&per_page=10';
      case 'canceled':
        return 'api/admins/orders/canceled?page=1&per_page=10';
      default:
        return 'api/admins/orders?page=1&per_page=10';
    }
  };

  const getApiUrlSearch = (status: string, code: string) => {
    let baseUrl;
    switch (status) {
      case 'pending':
        baseUrl = `api/admins/orders/search-pending?order_code=${code}`;
        break;
      case 'processing':
        baseUrl = `api/admins/orders/search-processed?order_code=${code}`;
        break;
      case 'shipping':
        baseUrl = `api/admins/orders/search-shipped?order_code=${code}`;
        break;
      case 'delivered':
        baseUrl = `api/admins/orders/search-delivered?order_code=${code}`;
        break;
      case 'canceled':
        baseUrl = `api/admins/orders/search-canceled?order_code=${code}`;
        break;
      default:
        baseUrl = `api/admins/orders/search_order?order_code=${code}`;
    }
    return baseUrl;
  };

  const handleDeleteShipping = async (billId: number) => {
    try {
      await instance.post(`api/admins/orders/update_order/${billId}`, { status: 'canceled' });
      toast.success('Đơn hàng đã được hủy thành công.');
      refetch();
    } catch (error: any) {
      toast.error('Không thể hủy đơn hàng.');
    }
  };

  const handleAssignShipping = async (billId: number) => {
    try {
      await instance.post(`api/admins/orders/update_order/${billId}`, { status: 'shipped' });
      toast.success('Trạng thái đơn hàng đã được cập nhật thành công thành "Đang Vận Chuyển".');
      refetch();
    } catch (error: any) {
      toast.error('Không thể bàn giao đơn hàng cho đơn vị vận chuyển.');
    }
  };

  const { isLoading, refetch } = useQuery({
    queryKey: ['products', filterStatus],
    queryFn: async () => {
      const response = await instance.get(getApiUrl(filterStatus));
      setBillData(response.data.bills);
      return response.data;
    },
  });

  const filterBill = (status: string) => {
    let baseUrl = `api/admins/orders/${status !== 'all' ? status : ''}?`;
    if (startDate && endDate) {
      baseUrl += `start_date=${startDate}&end_date=${endDate}&`;
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
      const response = await instance.get(filterBill(filterStatus));
      setBillData(response.data.bills);
    } catch (error) {
      toast.error('Không thể lấy dữ liệu hóa đơn!');
    }
  };

  const calculateBillCounts = () => {
    const counts = billData.reduce(
      (acc, bill) => {
        acc.all += 1;
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


  useEffect(() => {
    const counts = calculateBillCounts();
    setBillCounts(counts);
  }, [billData]);

  // 

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
        const response = await instance.post(getApiUrlSearch(filterStatus, searchCode));

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

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, index: number) => <span className="text-gray-700 font-medium">{index + 1}</span>,
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'code_orders',
      key: 'code_orders',
      align: 'center',
      render: (text: string) => <span className="text-blue-600 font-semibold">{text}</span>,
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      align: 'center',
      key: 'phone',
      render: (text: string) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: 'Hình Thức Thanh Toán',
      dataIndex: 'payment_type_description',
      align: 'center',
      key: 'payment_type_description',
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },

    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      align: 'center',
      key: 'quantity',
      sorter: (a: any, b: any) => parseFloat(a.quantity) - parseFloat(b.quantity),
      render: (text: number) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: 'Tổng Thanh Toán (VND)',
      dataIndex: 'total',
      align: 'center',
      key: 'total',
      sorter: (a: any, b: any) => parseFloat(a.total) - parseFloat(b.total),
      render: (text: string) => <span className="font-bold">{parseFloat(text).toLocaleString()}</span>,
    },
    {
      title: 'Ngày Đặt Hàng',
      align: 'center',
      key: 'order_date',
      render: (record: BillRecord) => (
        <div className="text-gray-700">{`${record.order_date} ${record.order_time}`}</div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status_bill',
      align: 'center',
      key: 'status_bill',
      render: (text: string) => {
        let vietnameseStatus = '';
        let statusClass = 'text-gray-500';

        switch (text) {
          case 'pending':
            vietnameseStatus = 'Đang chờ xử lý';
            break;
          case 'processed':
            vietnameseStatus = 'Đã Xử Lý';
            statusClass = 'text-green-500';
            break;
          case 'shipped':
            vietnameseStatus = 'Đang giao hàng';
            statusClass = 'text-yellow-500';
            break;
          case 'delivered':
            vietnameseStatus = 'Đã giao hàng';
            statusClass = 'text-teal-500';
            break;
          case 'canceled':
            vietnameseStatus = 'Đã hủy';
            statusClass = 'text-red-500';
            break;
          case 'new':
            vietnameseStatus = 'Mới';
            statusClass = 'text-white';
            break;
          default:
            vietnameseStatus = 'Không xác định';
            statusClass = 'text-gray-400';
        }

        return (
          <div className={`p-2 rounded-md font-semibold ${statusClass}`}>
            {vietnameseStatus}
          </div>
        );
      },
    }
    ,
    {
      title: 'Chức năng',
      align: 'center',
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
                  await instance.post(`api/admins/orders/update_order/${record.id}`, { status: newStatus });
                  toast.success('Trạng thái đơn hàng đã được cập nhật thành công.');
                  refetch();
                }
              } catch (error) {
                toast.error('Không thể cập nhật trạng thái đơn hàng.');
              }
            }}
            className="block w-full h-[40px] px-4 pr-8 bg-white border border-gray-300 rounded-md text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
          >
            {record.status_bill === 'pending' && (
              <>
                <option value="pending">Mới</option>
                <option value="processed">Xác Nhận Đơn Hàng</option>
                <option value="canceled">Hủy Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'processed' && (
              <>
                <option value="processed">Đã Xác Nhận Đơn Hàng</option>
                <option value="shipping">Giao Hàng</option>
                <option value="canceled">Hủy Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'shipped' && (
              <>
                <option value="shipped">Giao Hàng</option>
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
      align: 'center',
      key: 'action',
      render: (record: BillRecord) => (
        <div className='w-full text-center flex justify-center gap-2'>
          {['pending', 'shipping'].includes(record.status_bill) && (
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/dashboard/bill/detail/${record.id}`)}
            />
          )}

          {['shipped'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/shiping/${record.id}`)}
            />
          )}

          {['processed'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/detailConfirm/${record.id}`)}
            />
          )}

          {['delivered'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/detailSuccessful/${record.id}`)}
            />
          )}

          {['canceled'].includes(record.status_bill) && (
            <Button
              icon={<EyeOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/cancel/${record.id}`)}
            />
          )}
        </div>
      ),
    }

  ];
  const statusList = [
    { key: 'all', label: `Tất Cả` },
    { key: 'pending', label: `Chưa xử lý giao hàng` },
    { key: 'processing', label: `Chờ lấy hàng` },
    { key: 'shipping', label: `Đang giao hàng` },
    { key: 'delivered', label: `Đã Giao Hàng` },
    { key: 'canceled', label: `Đã Hủy` },
  ];

  const getTabLabelWithCount = (statusKey: string, count: number) => {
    const status = statusList.find((item) => item.key === statusKey);
    return `${status?.label} (${count})`;
  };


  const handleTabChange = (key: any) => {
    setFilterStatus(key);
  };
  if (isLoading) return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />;

  return (
    <>
      <ToastContainer />
      <div className='p-5'>
        <div className="w-[100%]">
          <Tabs
            activeKey={filterStatus}
            onChange={handleTabChange}
          >
            {statusList.map((status) => (
              <TabPane tab={status.label} key={status.key} />
            ))}
          </Tabs>
          <div className="w-[100%] h-auto">
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Nhập mã đơn hàng để tìm kiếm..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-[1000px] h-[40px]"
              />
              <Button type="default" icon={<SearchOutlined />} onClick={searchBill} className="h-[40px] bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700">
                Tìm Kiếm
              </Button>
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={() => setIsFilterVisible(true)}
                className="h-[40px] bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700"
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
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(dates) => {
                  if (dates) {
                    setStartDate(dates[0]?.format('YYYY-MM-DD') || null); 
                    setEndDate(dates[1]?.format('YYYY-MM-DD') || null);   
                  } else {
                    setStartDate(null);
                    setEndDate(null);
                  }
                }}
                format="YYYY-MM-DD" 
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

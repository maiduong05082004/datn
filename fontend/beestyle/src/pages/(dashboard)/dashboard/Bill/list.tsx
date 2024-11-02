<<<<<<< HEAD
import { ShoppingCartOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Spin, Table, DatePicker, Input, Select, Drawer } from 'antd';
import axiosInstance from '@/configs/axios';
import React, { useState } from 'react';
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

  const handleAssignShipping = async (billId: number) => {
    try {
      await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/ghn-create/${billId}`);
      toast.success('Đã bàn giao đơn hàng cho đơn vị vận chuyển thành công.');
      refetch();
    } catch (error : any) {
      const errorMessage = error.response?.data?.message || 'Không thể bàn giao đơn hàng cho đơn vị vận chuyển.';
      toast.error(errorMessage);
    }
  };
  const handleDeleteShipping = async (billId: number) => {
    try {
      await axiosInstance.post(`http://127.0.0.1:8000/api/admins/orders/ghn-cancel/${billId}`);
      toast.success('Đơn hàng đã được hủy thành công.');
    } catch (error : any) {
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
=======
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import React, { useState, useEffect } from 'react';

const ListBill = () => {
  const [bills, setBills] = useState([
    {
      orderCode: '719533246',
      deliveryMethod: 'Shoppe giao hàng',
      status: 'Shoppe Đã Nhận Giao Hàng',
      statusColor: 'bg-yellow-200 text-yellow-800',
      quantity: 1,
      customerPay: 0,
      confirmationDeadline: 'Ngày mai 09:28:00'
    },
    {
      orderCode: '750602738',
      deliveryMethod: 'Shoppe giao hàng',
      status: 'Được giao bởi Shoppe',
      statusColor: 'bg-yellow-200 text-yellow-800',
      quantity: 5,
      customerPay: 1450374,
      confirmationDeadline: 'XN lúc 07/06/2021 14:05:07'
    },
    {
      orderCode: '294668007',
      deliveryMethod: 'Shoppe giao hàng',
      status: 'Shoppe Đã Nhận Giao Hàng',
      statusColor: 'bg-yellow-200 text-yellow-800',
      quantity: 2,
      customerPay: 2879000,
      confirmationDeadline: '-'
    }
  ]);
  const column = [
    {
      title: '',
      key: 'expand',
      render: () => (
        <Button
          type="link"
          icon={<PlusOutlined />}
          className="text-gray-500"
        />
      ),
    },
>>>>>>> 3843526 (Fix admins)
    {
      title: 'STT',
      key: 'index',
<<<<<<< HEAD
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
      title: 'Trạng Thái',
      dataIndex: 'status_bill',
      key: 'status_bill',
      render: (text: string) => (
        <div className="p-2 rounded-md bg-yellow-200 text-yellow-800 font-bold text-center shadow-md">{text}</div>
      ),
=======
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
>>>>>>> 3843526 (Fix admins)
    },
    {
      title: 'Hình Thức Giao Hàng',
      dataIndex: 'deliveryMethod',
      key: 'deliveryMethod',
    }, {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <div className={`p-1 rounded ${record.statusColor}`}>{text}</div>
      ),
    }, {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
<<<<<<< HEAD
      sorter: (a: any, b: any) => parseFloat(a.quantity) - parseFloat(b.quantity),
      render: (text: number) => <span className="text-gray-700 font-medium">{text}</span>,
    },
    {
      title: 'Tổng Thanh Toán',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: any, b: any) => parseFloat(a.total) - parseFloat(b.total),
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
                if (newStatus === 'shipping') {
                  await handleAssignShipping(record.id);
                } else if (newStatus === 'remove') {
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
                <option value="remove">Xóa Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'processed' && (
              <>
                <option value="processed">Đã Xác Nhận Đơn Hàng</option>
                <option value="shipping">Bàn Giao Nhanh</option>
                <option value="canceled">Hủy Đơn Hàng</option>
                <option value="remove">Xóa Đơn Hàng</option>
              </>
            )}
            {record.status_bill === 'shipped' && (
              <>
                <option value="shipping">Bàn Giao Nhanh</option>
                <option value="delivered">Đã Giao Hàng</option>
                <option value="remove">Hủy Đơn Hàng</option>
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
    }
,    
    {
      title: 'Thao Tác',
      key: 'action',
      render: (record: BillRecord) => (
        <div className="relative w-[180px] flex gap-2">
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
              icon={<ShoppingCartOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/shiping/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md h-[50px]"
              style={{
                whiteSpace: 'normal',
                padding: '8px',
                textAlign: 'center'
              }}
            >
              Xem Chi Tiết Vận Chuyển
            </Button>
          )}
          {['processed'].includes(record.status_bill) && (
            <Button
              icon={<CheckCircle />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/detailConfirm/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md h-[50px]"
              style={{
                whiteSpace: 'normal',
                padding: '8px',
                textAlign: 'center'
              }}
            >
              Xem Chi Tiết Đơn Xác Nhận
            </Button>
          )}
          {['delivered'].includes(record.status_bill) && (
            <Button
              icon={<ShoppingCartOutlined />}
              type="default"
              onClick={() => navigate(`/admin/dashboard/bill/detailship/${record.id}`)}
              className="bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-700 rounded-md shadow-md"
            >
              Xem Đơn Hàng
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
      <div className="w-[100%] mx-auto p-5 bg-slate-100">
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
                  {/* <p className="text-gray-600">
                    {BillData?.bills?.filter((bill: BillRecord) => status === 'all' || bill.status_bill === status).length || 0} Đơn Hàng
                  </p> */}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="w-[100%] h-auto bg-white p-6 rounded-md shadow">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Nhập mã đơn hàng để tìm kiếm..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-[300px]"
            />
            <Button type="primary" onClick={searchBill} className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md">
              Tìm Kiếm
            </Button>
            <Button
              type="default"
              icon={<FilterOutlined />}
              onClick={() => setIsFilterVisible(true)}
              className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 rounded-md shadow-md"
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
=======
    }, {
      title: 'Khách Hàng Phải Trả',
      dataIndex: 'customerPay',
      key: 'customerPay',
      render: (text: number) => (
        <div>{text.toLocaleString()} đ</div>
      ),
    }, {
      title: 'Hạn Xác Nhận',
      dataIndex: 'confirmationDeadline',
      key: 'confirmationDeadline',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: () => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<EyeOutlined />}
            className="text-white bg-blue-500 hover:bg-blue-600"
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này không?"
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="primary" danger className="bg-red-500 text-white hover:bg-red-600" />
          </Popconfirm>
        </div>
      ),
    },
  ]
  return (
    <div className="w-[95%] mx-auto p-6 bg-slate-100">
      <div>
        <select className='border w-[300px] h-[35px]'>
          <option value="#">Vui lòng chọn nhà bán</option>
          <option value="">Nhà bán 1</option>
          <option value="">Nhà bán 2</option>
          <option value="">Nhà bán 3</option>
        </select>
      </div>
      <div className="flex justify-between items-center mb-6 pt-5">
        <div className="flex gap-2">
          <button className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300"><div><h2>Tất Cả</h2><p>0 Đơn Hàng</p></div></button>
          <button className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300"><div><h2>Chờ Xác Nhận</h2><p>0/0 đơn quá hạn XN</p></div></button>
          <button className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300"><div><h2>Đang Xử Lý</h2><p>0/0 đơn quá hạn XN</p></div></button>
          <button className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300"><div><h2>Đang Vận Chuyển</h2><p>0 Đơn Hàng</p></div></button>
          <button className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300"><div><h2>Đang Giao Hàng</h2><p>0 Đơn Hàng</p></div></button>
          <button className="w-[180px] h-[50px] bg-gray-200 rounded hover:bg-gray-300"><div><h2>Đã Hủy</h2><p>0 Đơn Hàng</p></div></button>
        </div>
      </div>
      <div className='border w-[100%] h-auto bg-white'>
        <div className='w-[97%] mx-auto pt-5 pb-5'>
          <div className="flex items-center gap-4 mb-2">
            <div>
              <select className='border p-2 w-[200px] rounded'>
                <option value="#">Mã Đơn Hàng</option>
                <option value="">1</option>
                <option value="">2</option>
                <option value="">3</option>
              </select>
            </div>
            <input
              type="text"
              className="border p-2 rounded w-[500px]"
              placeholder="Nhập mã đơn hàng để tìm kiếm..."
            />
            <div className='flex gap-2'>
              <select className='w-[150px] h-[38px] border text-black'>
                <option value="#">Nhãn Đơn Hàng</option>
                <option value="">1</option>
                <option value="">2</option>
                <option value="">3</option>
              </select>
              <select className='w-[150px] h-[38px] border text-black'>
                <option value="#">Ngày đặt hàng</option>
                <option value="">1</option>
                <option value="">2</option>
                <option value="">3</option>
              </select>
              <button className="w-[150px] h-[38px] border text-black">Bộ lọc khác</button>
            </div>
          </div>
          <div className='pb-10 flex gap-2'>
            <button className='w-[150px] h-[30px] border bg-gray-200'>Shoppe Giao Hàng</button>
            <button className='w-[150px] h-[30px] border bg-gray-200'>NB Tư Vận Hành</button>
            <button className='w-[150px] h-[30px] border bg-gray-200'>Giao Thẳng Từ NB</button>
            <button className='w-[150px] h-[30px] border bg-gray-200'>Giao Từ Nước Ngoài</button>
            <button className='w-[150px] h-[30px] border bg-gray-200'>Dich Vụ</button>
          </div>
          <hr />
          <div className='flex gap-10 pt-5 pb-5'>
            <h3>Đang Lọc:</h3>
            <p>Ngày đặt tháng 30 ngày qua (08/05/2021 - 07/06/2021)</p>
            <button className="text-blue-500 ml-4 hover:underline">Xoá tất cả</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pt-5">
        <div className='bg-white'>
          <div className='w-[97%] mx-auto'>
            <div className='flex gap-10 pt-5 pb-5'>
              <div className='w-[200px] flex  items-center h-[40px]'>
                <span className='font-bold text-2xl'>Đơn Hàng :</span>
                <p className='text-2xl ml-2'>2698</p>
              </div>
              <div className='border w-[200px] flex items-center justify-center bg-slate-200'>
                <button>Xác Nhận Đơn Hàng</button>
              </div>
              <div className='border w-[200px] flex justify-center items-center bg-slate-200'>
                <select className='bg-slate-200'>
                  <option value="#">Xuất Đơn Hàng</option>
                  <option value="1">Xuất Đơn Hàng1</option>
                  <option value="2">Xuất Đơn Hàng2</option>
                </select>
              </div>
              <div className='w-[200px] flex items-center'>
                <button className="text-blue-500 ml-4 hover:underline">Mở Rộng Tất Cả</button>
              </div>
            </div>
            <Table
              columns={column}
              dataSource={bills}
              rowKey={(record) => record.orderCode}
              bordered
              pagination={{
                pageSize: 7,
                showTotal: (total) => `Tổng ${total} danh mục`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
>>>>>>> 3843526 (Fix admins)
  );
};

export default ListBill;

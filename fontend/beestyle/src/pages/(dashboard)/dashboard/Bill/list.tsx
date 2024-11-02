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
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
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
  );
};

export default ListBill;

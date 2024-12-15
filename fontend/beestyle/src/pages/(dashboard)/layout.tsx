import React, { useState } from 'react';
import MyProfile from './dashboard/profile';
import {
  BarChartOutlined,
  GiftOutlined,
  LaptopOutlined,
  MessageOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  TagOutlined,
  DatabaseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Menu,
  Layout,
  Switch,
  MenuProps,
  Button,
} from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: "Tài Khoản",
    children: [
      { key: 'sub1-1', label: <NavLink to="/admin/dashboard/user/list">Danh sách tài Khoản</NavLink> },
      // { key: 'sub1-2', label: <NavLink to="/admin/dashboard/user/add">Thêm Tài Khoản</NavLink> },  
    ],
  },
  {
    key: '2',
    icon: <InfoCircleOutlined  />,
    label: "Banners",
    children: [

      { key: 'sub2-1', label: <NavLink to="/admin/dashboard/banner/list/collection">Banners Bộ Sưu Tập</NavLink> },
      { key: 'sub2-2', label: <NavLink to="/admin/dashboard/banner/list/main">Banners Chính</NavLink> },
      { key: 'sub2-4', label: <NavLink to="/admin/dashboard/banner/list/category">Banners Danh Mục</NavLink> },
      { key: 'sub2-6', label: <NavLink to="/admin/dashboard/banner/add">Thêm Banners</NavLink> },
    ],
  },
  {
    key: 'sub3',
    icon: React.createElement(ShoppingCartOutlined),
    label: 'Sản Phẩm',
    children: [
      { key: 'sub3-1', label: <NavLink to="/admin/dashboard/products/list">Danh sách sản phẩm</NavLink> },
      { key: 'sub3-3', label: <NavLink to="/admin/dashboard/products/add">Thêm Sản phẩm</NavLink> },

    ],
  },
  {
    key: 'sub10',
    icon: React.createElement(SettingOutlined),
    label: 'Nhóm Thuộc Tính',
    children: [
      { key: 'sub10-1', label: <NavLink to="/admin/dashboard/attribute_group/list">Danh sách Nhóm Thuộc Tính</NavLink> },
      { key: 'sub10-2', label: <NavLink to="/admin/dashboard/attribute_group/add">Thêm Sản Nhóm Thuộc Tính</NavLink> },

    ],
  },
  {
    key: 'sub4',
    icon: React.createElement(TagOutlined),
    label: 'Thuộc Tính',
    children: [
      { key: 'sub4-1', label: <NavLink to="/admin/dashboard/attribute/list">Danh sách Thuộc Tính</NavLink> },
      { key: 'sub4-4', label: <NavLink to="/admin/dashboard/attribute/add">Thêm Thuộc Tính</NavLink> },
      { key: 'sub4-2', label: <NavLink to="/admin/dashboard/attribute_value/add">Thêm Giá Trị Thuộc Tính</NavLink> },

    ],
  },
  {
    key: 'sub5',
    icon: React.createElement(LaptopOutlined),
    label: 'Danh Mục',
    children: [
      { key: 'sub5-1', label: <NavLink to="/admin/dashboard/category/list">Danh sách danh mục</NavLink> },
      { key: 'sub5-2', label: <NavLink to="/admin/dashboard/category/add">Thêm mới danh mục</NavLink> },
    ],
  },
  {
    key: 'sub6',
    icon: React.createElement(ProductOutlined),
    label: <NavLink to="/admin/dashboard/bill/list">Đơn Hàng</NavLink>,
  },
  {
    key: 'sub8',
    icon: React.createElement(GiftOutlined),
    label: 'Khuyến Mại',
    children: [
      { key: 'sub8-1', label: <NavLink to="/admin/dashboard/promotions/list">Danh sách</NavLink> },
      { key: 'sub8-2', label: <NavLink to="/admin/dashboard/promotions/add">Thêm mới</NavLink> },
    ],
  },
  {
    key: 'sub9',
    icon: React.createElement(BarChartOutlined),
    label: 'Thống Kê',
    children: [
      { key: 'sub9-1', label: <NavLink to="/admin/dashboard/statistic/list">Xem Thống Kê</NavLink> },
    ],
  },
  {
    key: 'inventory',
    icon: React.createElement(DatabaseOutlined),
    label: (
      <span>
        Quản lý Tồn Kho
      </span>
    ),
    children: [
      {
        key: 'inventory-list',
        label: <NavLink to="/admin/dashboard/inventory/list">Danh sách Tồn Kho</NavLink>,
      },
      {
        key: 'inventory-report',
        label: <NavLink to="/admin/dashboard/inventory/report">Báo cáo Tồn Kho</NavLink>,
      },
    ],
  }
  
  ,
  {
    key: 'sub12',
    icon: React.createElement(TagOutlined),
    label: 'Chat',
    children: [
      { key: 'sub12-1', label: <NavLink to="/admin/dashboard/chat">ChatRealTime</NavLink> },

    ],
  },

];


const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1); 
    if (items1.map((item :any) => item.key).includes(latestOpenKey!)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys); 
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark" 
        style={{
          background: '#001529',
        }}
      >

        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          defaultSelectedKeys={["dashboard"]}
          items={items1}
          className='font-bold text-[14px]'
          style={{ marginTop: "16px" }}
        />
      </Sider>

      <Layout>
        {/* Top Header */}
        <Header
          className='h-[50px'
          style={{
            background: isDarkMode ? '#001529' : '#fff',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #e8e8e8',
          }}
        >
          {/* <div className='flex justify-center items-center' style={{ height: '64px', padding: '16px', background: '#001529', display: 'flex', alignItems: 'center' }}>
          <div className='pt-5'>
            <img src="https://res.cloudinary.com/dpaig88n6/image/upload/v1732032276/Remove-bg.ai_1732032149065_f3naqx.png" alt="" />
          </div>
        </div> */}
          {/* Search Bar */}
          <div
            className={`w-[448px] h-[50px] border-none px-3 rounded-md flex items-center justify-center gap-2 ${isDarkMode ? 'bg-[#001529] text-white placeholder-white' : 'bg-white text-black placeholder-gray-400'
              }`}
          >
          </div>
          

          <div className="flex justify-end items-center space-x-6">
            <Badge
              className="relative"
              style={{
                backgroundColor: '#f5222d',
                color: 'white',
                fontSize: '12px',
              }}
            >
              <button
                className={`flex items-center justify-center bg-transparent bg-[#eef3fb] hover:bg-slate-500 p-2 rounded-full ${isDarkMode ? "bg-[#313d4a]" : "text-black"
                  }`}
              >
                <MessageOutlined
                  className={`${isDarkMode ? "text-white" : "text-black"}`}
                  style={{ fontSize: "24px" }} // Adjust the size as needed
                />
              </button>
            </Badge>


            {/* User Profile */}
            <div className="relative inline-block text-left">
              <div
                onClick={toggleDropdown}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <img
                  src="https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/avatar-nam-nu-trang-2.jpg"
                  alt="User"
                  className="h-10 w-10 rounded-full"
                />
                <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                  <span className="font-semibold text-base">Admin</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-black'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-[300px] rounded-lg shadow-lg bg-black min-w-[200px] z-50">
                  <div className="py-1" role="menu">
                    <Link
                      to="profile"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 hover:translate-x-1 transform transition-transform duration-300 ease-in-out"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2 text-gray-400 group-hover:text-white transition-colors duration-300 ease-in-out"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5.121 17.804A3 3 0 015.997 17H9m6 0h2.503a3 3 0 01.876.804M9 16a3 3 0 006 0M3 13V7a4 4 0 014-4h10a4 4 0 014 4v6M7 7v6m10-6v6"
                        />
                      </svg>
                      My Profile
                    </Link>

                    <div className="border-t border-gray-600 my-1"></div>

                    <a
                      href="#logout"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 hover:translate-x-1 transform transition-transform duration-300 ease-in-out"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2 text-gray-400 group-hover:text-white transition-colors duration-300 ease-in-out"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Log Out
                    </a>
                  </div>
                </div>
              )}


            </div>

          </div>
        </Header>

        <div className='w-full h-full' style={{ backgroundColor: isDarkMode ? 'rgb(26, 34, 44)' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
          <div style={{ backgroundColor: isDarkMode ? 'rgb(26, 34, 44)' : '#fff' }}>
            <Outlet />
          </div>
        </div>
      </Layout>
    </Layout >
  );
};

export default App;
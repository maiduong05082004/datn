import React, { useState } from 'react';
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
} from '@ant-design/icons';
import {
  Badge,
  Menu,
  Layout,
  Switch,
  MenuProps,
} from 'antd';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation

const { Header, Content, Sider } = Layout;

// Sidebar items
const items1: MenuProps['items'] = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: "Quản Lý Tài Khoản",
    children: [
      { key: 'sub1-1', label: <NavLink to="/admin/listUser">Danh sách</NavLink> },
      { key: 'sub1-2', label: <NavLink to="/admin/addUser">Thêm Tài Khoản</NavLink> },
      { key: 'sub1-3', label: <NavLink to="/admin/updateUser">Sửa Tài Khoản</NavLink> },
      { key: 'sub1-4', label: <NavLink to="/admin/delete-account">Xóa Tài Khoản</NavLink> },
    ],
  },
  {
    key: 'sub3',
    icon: React.createElement(ShoppingCartOutlined),
    label: 'Quản Lý Sản Phẩm',
    children: [
      { key: 'sub3-1', label: <NavLink to="/admin/listProducts">Danh sách sản phẩm</NavLink> },
      { key: 'sub3-2', label: <NavLink to="/admin/addProducts">Thêm Sản phẩm</NavLink> },
      { key: 'sub3-3', label: <NavLink to="/admin/updateProducts">Cập nhật sản phẩm</NavLink> },

    ],
  },
  {
    key: 'sub4',
    icon: React.createElement(LaptopOutlined),
    label: 'Quản Lý Danh Mục',
    children: [
      { key: 'sub4-1', label: <NavLink to="/admin/listCategories">Danh sách</NavLink> },
      { key: 'sub4-2', label: <NavLink to="/admin/addCategories">Thêm mới danh mục</NavLink> },
      { key: 'sub4-3', label: <NavLink to="/admin/updateCategories">Cập nhật danh mục</NavLink> },
    ],
  },
  {
    key: 'sub5',
    icon: React.createElement(ProductOutlined),
    label: 'Quản Lý Đơn Hàng',
    children: [
      { key: 'sub5-1', label: <NavLink to="/admin/listBills">Danh sách</NavLink> },
      { key: 'sub5-2', label: <NavLink to="/admin">Danh sách</NavLink> },
      { key: 'sub5-3', label: 'Xóa Đơn Hàng' },
    ],
  },
  {
    key: 'sub6',
    icon: React.createElement(MessageOutlined),
    label: 'Quản Lý Bình Luận',
    children: [
      { key: 'sub6-1', label: <NavLink to="/admin/listComments">Danh sách bình luận</NavLink> },
      { key: 'sub6-2', label: 'Phê Duyệt Bình Luận' },
      { key: 'sub6-3', label: 'Xóa Bình Luận' },
    ],
  },
  {
    key: 'sub7',
    icon: React.createElement(GiftOutlined),
    label: 'Quản Lý Khuyến Mại',
    children: [
      { key: 'sub7-1', label: <NavLink to="/admin/listBanners">Danh sách</NavLink> },
      { key: 'sub7-2', label: <NavLink to="/admin/addBanners">Thêm mới</NavLink> },
      { key: 'sub7-3', label: <NavLink to="/admin/updateBanners">Cập nhật</NavLink> },
      { key: 'sub7-4', label: 'Xóa Khuyến Mại' },
    ],
  },
  {
    key: 'sub8',
    icon: React.createElement(BarChartOutlined),
    label: 'Thống Kê',
    children: [
      { key: 'sub8-1', label: 'Xem Thống Kê' },
      { key: 'sub8-2', label: 'Tải Xuống Thống Kê' },
    ],
  },
];

const DashboardPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <Content
      style={{
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#001529' : '#fff', // Dashboard background color
        color: isDarkMode ? '#fff' : '#000', // Dashboard text color
      }}
    >
      <h1>Dashboard Content</h1>
      <p>This is the content of the dashboard in {isDarkMode ? 'Dark Mode' : 'Light Mode'}.</p>
    </Content>
  );
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark" // Sidebar always stays in dark theme
        style={{
          height: '100vh',
          background: '#001529',
        }}
      >
        {/* Sidebar logo */}
        <div className='flex justify-center items-center' style={{ height: '64px', padding: '16px', background: '#001529', display: 'flex', alignItems: 'center' }}>
          <div className='pt-5'>
            <img src="https://bizweb.dktcdn.net/100/446/974/themes/849897/assets/logo.png?1725442106829" alt="" />
          </div>
        </div>

        {/* Sidebar Menu */}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={items1} style={{ marginTop: '16px' }} />
      </Sider>

      <Layout>
        {/* Top Header */}
        <Header
          className='h-[80px]'
          style={{
            background: isDarkMode ? '#001529' : '#fff',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #e8e8e8',
          }}
        >
          {/* Search Bar */}
          <div
            className={`w-[448px] h-[50px] border-none px-3 rounded-md flex items-center justify-center gap-2 ${isDarkMode ? 'bg-[#001529] text-white placeholder-white' : 'bg-white text-black placeholder-gray-400'
              }`}
          >
            <SearchOutlined style={{ fontSize: '20px' }} />
            <input
              type="text"
              className={`w-full text-xl bg-transparent focus:outline-none placeholder-${isDarkMode ? 'white' : 'gray-400'
                }`}
              placeholder="Type to search..."
            />
          </div>

          {/* Notifications, Messages, and Profile */}
          <div className="flex justify-end items-center space-x-6">
            {/* Theme Toggle Switch */}
            <div className="flex items-center">
              <Switch
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                onChange={toggleTheme}
                checked={isDarkMode}
                className={`${isDarkMode ? 'bg-blue-500' : 'bg-gray-400'
                  } w-[50px] h-[24px] rounded-full relative border border-blue-300`}
              />
            </div>

            {/* Notifications */}
            <Badge
              className="relative"
              style={{
                backgroundColor: '#f5222d',
                color: 'white',
                fontSize: '12px',
              }}
            >
              <button className={`bg-transparent bg-[#eef3fb] hover:bg-slate-500 p-2 rounded-full ${isDarkMode ? 'bg-[#313d4a]' : 'text-black'}`}>
                <BellOutlined
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  style={{ fontSize: '24px' }} // Adjust the size to 34px
                />
              </button>
            </Badge>

            {/* Messages */}
            <Badge
              className="relative"
              style={{
                backgroundColor: '#f5222d',
                color: 'white',
                fontSize: '12px',
              }}
            >
              <button className={`bg-transparent bg-[#eef3fb] hover:bg-slate-500 p-2 rounded-full ${isDarkMode ? 'bg-[#313d4a]' : 'text-black'}`}>
                <MessageOutlined
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  style={{ fontSize: '24px' }} // Adjust the size to 34px
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
                <div
                  className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-black"
                  style={{ minWidth: '200px' }}
                >
                  <div className="py-1" role="menu">
                    <a
                      href="#profile"
                      className="px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2 text-gray-400"
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
                    </a>
                    <a
                      href="#contacts"
                      className="px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.728 7.748A5.989 5.989 0 0012 8c-3.314 0-6 2.686-6 6a5.98 5.98 0 004.252 5.754M19.98 12a4.5 4.5 0 10-9 0v.042c.055-.007.11-.015.166-.015a3.333 3.333 0 110 6.666c-.057 0-.112-.007-.167-.015V19.5a3 3 0 010-6h.666"
                        />
                      </svg>
                      My Contacts
                    </a>
                    <a
                      href="#settings"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v8m4-4H8"
                        />
                      </svg>
                      Account Settings
                    </a>
                    <div className="border-t border-gray-600 my-1"></div>
                    <a
                      href="#logout"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2 text-gray-400"
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
    </Layout>
  );
};

export default App;

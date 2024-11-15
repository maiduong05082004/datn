import React, { useState } from 'react';
import { Layout, Input, Button, Avatar } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  MessageOutlined,
  SendOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ListBill from './list';
import DetailConfirm from './detailConfirm';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();
  const [isChatDrawerVisible, setIsChatDrawerVisible] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Lương Văn Tú đã trả lời về một bài viết. (Xem bài viết)', sender: 'other', type: 'text', avatar: '' },
    { text: 'Cho mình order với', sender: 'other', type: 'text', avatar: '' },
    { text: 'Ok anh ah', sender: 'user', type: 'text' }
  ]);
  const [messageText, setMessageText] = useState('');

  const openChatDrawer = () => setIsChatDrawerVisible(true);
  const closeChatDrawer = () => setIsChatDrawerVisible(false);

  const sendMessage = () => {
    if (messageText.trim()) {
      setMessages([...messages, { text: messageText, sender: 'user', type: 'text' }]);
      setMessageText('');
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md flex items-center justify-between px-4">
        <div className="flex items-center">
          <MenuOutlined className="text-xl mr-4 cursor-pointer" />
          <h2 className="text-xl font-semibold">ĐƠN HÀNG</h2>
        </div>

        <div className="flex-grow px-4">
          <Input
            placeholder="Mã đơn / Mã vận chuyển / Tên / Địa chỉ / Số điện thoại / Ghi chú"
            className="w-full rounded-full border-gray-300 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-6">
          <HomeOutlined className="text-2xl cursor-pointer" onClick={() => navigate('/home')} />
          <MessageOutlined className="text-2xl cursor-pointer" onClick={openChatDrawer} />
        </div>
      </Header>

      <Layout>
        <Content
          className=" bg-gray-100 transition-all duration-300"
          style={{
            width: isChatDrawerVisible ? 'calc(100% - 400px)' : '100%',
          }}
        >
          {/* <DetailConfirm/> */}
          <ListBill />
        </Content>

        <Sider
          width={400}
          theme="light"
          className="bg-white shadow-lg"
          style={{
            display: isChatDrawerVisible ? 'block' : 'none',
            overflow: 'auto',
            height: 'auto',
          }}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Lương Văn Tú</h3>
              <Button icon={<CloseOutlined />} onClick={closeChatDrawer} />
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'other' && (
                    <Avatar src={message.avatar} className="mr-2" />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[70%] ${
                      message.sender === 'user' ? 'bg-green-200 text-black' : 'bg-gray-200 text-black'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center p-4 space-x-2 border-t">
              <Input
                placeholder="Viết trả lời hoặc '/' để trả lời nhanh"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onPressEnter={sendMessage}
                className="flex-grow rounded-full border-gray-300 shadow-sm"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                className="rounded-full"
              />
            </div>
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default App;

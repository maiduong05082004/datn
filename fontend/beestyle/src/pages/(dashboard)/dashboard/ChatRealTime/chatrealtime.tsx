import React, { useState } from "react";
import { AudioOutlined, CloseOutlined, FileGifOutlined, MinusOutlined, PhoneOutlined, PictureOutlined, SendOutlined, SmileOutlined, VideoCameraOutlined } from '@ant-design/icons';

const ChatRealTime: React.FC<{ closeChat: () => void }> = ({ closeChat }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-16 right-4 w-[360px] h-[480px] bg-white text-black rounded-lg shadow-lg flex flex-col z-50">
      <header className="py-2 px-4 flex justify-between items-center bg-gray-200 rounded-t-lg">
        <h2 className="text-lg font-semibold">Người Dùng Chat</h2>
        <button className="w-8 h-8 "><PhoneOutlined /></button>
        <button className="w-8 h-8"><VideoCameraOutlined /></button>
        <button className="w-8 h-8"><MinusOutlined /></button>
        <button
          onClick={closeChat}
          className="w-8 h-8 flex justify-center items-center text-lg py-1 rounded-full hover:bg-red-600 hover:text-white transition-colors"
        >
          <CloseOutlined />
        </button>
      </header>

      {/* Messages */}
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"
                }`}
            >
              {msg}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet...</p>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center p-2 bg-blue-300 text-white rounded-b-lg">
        {/* Icons trước input */}
        <div className="flex items-center space-x-2 px-2">
          <AudioOutlined  style={{ fontSize: '20px' }} />
          <PictureOutlined  style={{ fontSize: '20px' }} />
          <FileGifOutlined  style={{ fontSize: '20px' }} />
          <SmileOutlined  style={{ fontSize: '20px' }} />
        </div>

        {/* Input để nhập tin nhắn */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Aa"
          className="flex-1 mx-2 px-2 py-2 border-none rounded-full focus:outline-none bg-gray-700 text-white placeholder-gray-400"
        />

        {/* Nút gửi tin nhắn */}
        <button
          onClick={sendMessage}
        >
          <SendOutlined style={{ fontSize: '24px' }} />
        </button>
      </div>
    </div>
  );
};

export default ChatRealTime;

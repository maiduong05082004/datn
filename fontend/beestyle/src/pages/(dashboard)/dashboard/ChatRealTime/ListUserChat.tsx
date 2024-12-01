import React, { useEffect, useState, useRef } from "react";
import axios from "axios"; // Sử dụng axios để gọi API
import echo from "@/echo"; // Giả sử bạn đã cấu hình Echo trong echo.js

type User = {
  id: number;
  name: string;
  avatar?: string;
};

type Message = {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  created_at: string;
};

const ListUserChat: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : null;

  // Lấy danh sách người dùng đã chat với admin (Dùng axios để gọi API)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admins/messages/chatted-users",
          {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng đã chat:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [token]);

  // Lắng nghe sự kiện tin nhắn mới thông qua Laravel Echo (Pusher)
  useEffect(() => {
    if (activeUser) {
      const channel = echo.channel(`chat.${activeUser.id}`);

      // Lắng nghe sự kiện 'MessageSent' từ server
      channel.listen("MessageSent", (event: { message: Message }) => {
        setMessages((prevMessages) => {
          // Thêm tin nhắn mới vào cuối
          return [...prevMessages, event.message];
        });
      });

      return () => {
        // Tắt lắng nghe khi component bị hủy
        channel.stopListening("MessageSent");
      };
    }
  }, [activeUser]);

  // Lấy tin nhắn của admin với người dùng được chọn (Dùng axios để gọi API)
  useEffect(() => {
    if (activeUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/admins/messages/${activeUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${cleanToken}`,
              },
            }
          );
          // Sắp xếp tin nhắn từ cũ đến mới (theo created_at)
          const sortedMessages = response.data.sort((a: Message, b: Message) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setMessages(sortedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [activeUser, token]);

  // Hàm gửi tin nhắn (Dùng axios để gọi API)
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeUser) {
      console.error("Message content or active user is missing.");
      return;
    }

    console.log("Sending message:", newMessage); // Log thông tin tin nhắn trước khi gửi

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admins/messages/send",
        {
          message: newMessage,
          receiver_id: activeUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );

      console.log("Message sent successfully:", response.data); // Log kết quả trả về từ server

      // Tạo tin nhắn mới từ response
      const newMsg = {
        id: response.data.id,
        message: newMessage,
        sender_id: response.data.sender_id,
        receiver_id: response.data.receiver_id,
        created_at: new Date().toISOString(),
      };

      // Thêm tin nhắn mới vào cuối danh sách
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      setNewMessage(""); // Xóa nội dung tin nhắn đã nhập
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  };

  // Lọc người dùng theo tìm kiếm
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Khi messages thay đổi, cuộn xuống dưới

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Danh sách người dùng */}
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi thay đổi input
          placeholder="Tìm kiếm người dùng"
          className="w-full p-2 mb-4 border rounded"
        />
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setActiveUser(user)} // Chọn người dùng để chat
              className={`flex items-center p-2 cursor-pointer rounded ${activeUser?.id === user.id ? "bg-gray-200" : ""}`}
            >
              <img
                src={user.avatar || "https://via.placeholder.com/40"}
                alt="avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-semibold">{user.name}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Khu vực chat */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          {activeUser ? (
            <h2 className="text-xl font-bold">{activeUser.name}</h2>
          ) : (
            <h2 className="text-xl font-bold">Chọn người dùng để trò chuyện</h2>
          )}
        </div>

        {/* Tin nhắn */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender_id === activeUser?.id ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.sender_id === activeUser?.id ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {message.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.created_at).toLocaleString()}
              </div>
            </div>
          ))}
          <div ref={messageEndRef}></div> {/* Đảm bảo cuộn xuống dưới */}
        </div>

        {/* Input */}
        {activeUser && (
          <div className="p-4 border-t border-gray-300 flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)} // Cập nhật giá trị của tin nhắn mới
              className="flex-1 p-2 border rounded mr-2"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListUserChat;

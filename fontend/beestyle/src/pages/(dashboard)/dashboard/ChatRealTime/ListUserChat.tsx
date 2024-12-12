import axiosInstance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

const ListUserChat: React.FC = () => {
  const [userId, setUserId] = useState<any>(null);
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: userMessage } = useQuery({
    queryKey: ['userMessage'],
    queryFn: async () => {
      return axiosInstance.get(`api/admins/messages/chatted-users`)
    },
  })

  const { data: support } = useQuery({
    queryKey: ['support', userId],
    queryFn: async () => {
      if (!userId) return;
      return axiosInstance.get(`api/admins/messages/${userId.id}`)
    },
    enabled: !!userId,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [support?.data]);


  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return axiosInstance.post(`api/admins/messages/send`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['support', userId],
      }),
    setMessage("")
    scrollToBottom();
    }
  })

  const handleSend = async () => {
    const data = { receiver_id: userId.id, content: message }
    mutate(data)
  }

  return (
    <div className="flex h-[calc(100vh-50px)] bg-gray-100 relative">
      {/* Danh sách người dùng */}
      <div className="w-[20%] border-r border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
        <input
          type="text"

          placeholder="Tìm kiếm người dùng"
          className="w-full p-2 mb-4 border rounded"
        />
        <ul className="space-y-2">
          {userMessage?.data.map((item: any, index: any) => (
            <li key={index + 1} onClick={() => setUserId(item)} className={`flex items-center p-2 cursor-pointer rounded`} >
              <img src="https://w7.pngwing.com/pngs/741/68/png-transparent-user-computer-icons-user-miscellaneous-cdr-rectangle-thumbnail.png" alt="avatar" className="w-10 h-10 rounded-full mr-3" />
              <div className="truncate w-full">
                <h4 className="font-semibold">{item.name}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Khu vực chat */}
      <div className="w-[80%] bg-white h-[100%]">
        <div className="p-4 border-b border-gray-300 flex items-center justify-start h-[60px]">
          {userId ?
            <div className="flex items-center">
              <img src="https://w7.pngwing.com/pngs/741/68/png-transparent-user-computer-icons-user-miscellaneous-cdr-rectangle-thumbnail.png" alt="avatar" className="w-10 h-10 rounded-full mr-3" />
              <span className="text-[16px] font-[500]">{userId.name}</span>
            </div> :
            <h2 className="text-xl font-bold">Chọn người dùng để trò chuyện</h2>}
        </div>


        <div className="overflow-y-auto whitespace-nowrapw h-[calc(100%-130px)]">
          <div className="">
            {support && support?.data.slice().reverse().map((item: any, index: any) => (
              <div key={index + 1} className={`${item.sender_id !== userId.id ? "justify-end" : "justify-start"} flex p-[10px]`}>
                <div className={`${item.sender_id !== userId.id ? "bg-blue-500 text-white" : "bg-slate-200"}  rounded-[5px] p-[5px_10px] max-w-[250px]`}>
                  {item.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="absolute bottom-0 border-t border-gray-300 w-[80%] felx items-center px-[20px]">
            <div className="flex items-center py-[10px] ">
              <input type="file" accept="image/*" className="border" />
              {/* <img alt="preview" className="w-12 h-12 object-cover rounded-md" /> */}
              <div className="px-[10px] w-[100%]">
                <input onKeyPress={(e) => e.key === 'Enter' && handleSend()} type="text" className="flex-1 w-[100%] p-[10px] border rounded" placeholder="Nhập tin nhắn..." onChange={(e: any) => setMessage(e.target.value)} value={message} />
              </div>
              <div onClick={() => handleSend()} className="bg-blue-500 text-white cursor-pointer px-[30px] py-[10px] rounded-md" >
                Gửi
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListUserChat;



// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import echo from "@/echo"; // Pusher Echo đã cấu hình trong echo.js
// import { useQueryClient } from "@tanstack/react-query";

// type User = {
//   id: number;
//   name: string;
//   avatar?: string;
// };

// type Message = {
//   id: number;
//   content: string;
//   sender_id: number;
//   receiver_id: number;
//   created_at: string;
//   image_url?: string;
// };

// const ListUserChat: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [activeUser, setActiveUser] = useState<any | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null); // Thêm preview hình ảnh
//   const messageEndRef = useRef<HTMLDivElement>(null);
//   const queryClient = useQueryClient()

//   const token = localStorage.getItem("user");
//   const cleanToken = token ? token.replace(/"/g, "") : null;

//   // Lấy danh sách người dùng đã chat
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/admins/messages/chatted-users",
//           {
//             headers: {
//               Authorization: `Bearer ${cleanToken}`,
//             },
//           }
//         );
//         setUsers(response.data);
//       } catch (error: any) {
//         console.error("Lỗi khi lấy danh sách người dùng:", error.response?.data || error.message);
//       }
//     };

//     fetchUsers();
//   }, [token]);

 
  

//   // Lấy tin nhắn khi người dùng chọn
//   useEffect(() => {
//     if (activeUser) {
//       const fetchMessages = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:8000/api/admins/messages/${activeUser.id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${cleanToken}`,
//               },
//             }
//           );
//           const sortedMessages = response.data.sort((a: Message, b: Message) =>
//             new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//           );
//           setMessages(sortedMessages);
//         } catch (error) {
//           console.error("Error fetching messages:", error);
//         }
//       };

//       fetchMessages();
//     }
//   }, [activeUser]);

//   useEffect(() => {
//     if (activeUser) {
//       const channel = echo.private(`chat.${activeUser.id}`);

//       console.log(activeUser.id);
      
  
//       console.log(`Đã tham gia vào kênh chat.${activeUser.id}`);
  
//       channel.listen("ChatEvent.newMessage", (event: { message: Message }) => {
//         const newMessage = event.message;
//           console.log("Nhận được tin nhắn mới:", newMessage.content);
  
//         // Kiểm tra xem người gửi có phải là người khác không (không phải mình)
//         if (newMessage.sender_id !== activeUser.id) {
//           console.log(`Tin nhắn mới từ người dùng ${newMessage.sender_id}:`, newMessage.content);
//         }
  
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       });
      
  
//       console.log(`Đang lắng nghe sự kiện 'ChatEvent' trên kênh chat.${activeUser.id}`);

//       // Cleanup khi không còn cần lắng nghe sự kiện
//       return () => {
//         console.log(`Ngừng lắng nghe sự kiện 'ChatEvent' trên kênh chat.${activeUser.id}`);
//         channel.stopListening("ChatEvent");
//       };
//     }
//   }, [activeUser]);

//   // Hàm gửi tin nhắn
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() && !image) {
//       console.error("Message content or image is missing.");
//       return;
//     }
  
//     console.log("Sending message:", newMessage);
  
//     try {
//       const formData = new FormData();
//       formData.append("content", newMessage);
//       formData.append("receiver_id", activeUser?.id);
  
//       // Nếu có hình ảnh, thêm vào formData
//       if (image) {
//         formData.append("image_url", image);
//       }
  
//       const response = await axios.post(
//         "http://localhost:8000/api/admins/messages/send",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${cleanToken}`,
//             "Content-Type": "multipart/form-data", // Đảm bảo gửi file đúng kiểu
//           },
//         }
//       );
  
//       console.log("Message sent successfully:", response.data);
  
//       const newMsg = {
//         id: response.data.id,
//         content: newMessage,
//         sender_id: response.data.sender_id,
//         receiver_id: response.data.receiver_id,
//         created_at: new Date().toISOString(),
//         image_url: response.data.image_url, // Dùng image_url trả về từ server nếu có
//       };
  
//       setMessages((prevMessages) => [...prevMessages, newMsg]);
//       setNewMessage(""); // Clear the message input
//       setImage(null); // Clear the image input
//       setImagePreview(null); // Clear the image preview
  
//       // Log gửi tin nhắn
//       console.log("Tin nhắn đã được gửi đi và sẽ được nhận realtime.");
//     } catch (error: any) {
//       console.error("Error sending message:", error.response?.data || error.message);
//     }
//   };
//   // Lọc người dùng theo tìm kiếm
//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Cuộn xuống dưới khi có tin nhắn mới
//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   // Xử lý thay đổi hình ảnh
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImage(file);
      
//       // Cập nhật hình ảnh xem trước
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Danh sách người dùng */}
//       <div className="w-1/3 border-r border-gray-300 p-4">
//         <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật khi người dùng nhập vào ô tìm kiếm
//           placeholder="Tìm kiếm người dùng"
//           className="w-full p-2 mb-4 border rounded"
//         />
//         <ul className="space-y-2">
//           {filteredUsers.map((user) => (
//             <li
//               key={user.id}
//               onClick={() => setActiveUser(user)} // Chọn người dùng để bắt đầu trò chuyện
//               className={`flex items-center p-2 cursor-pointer rounded ${activeUser?.id === user.id ? "bg-gray-200" : ""}`}
//             >
//               <img
//                 src={user.avatar || "https://via.placeholder.com/40"}
//                 alt="avatar"
//                 className="w-10 h-10 rounded-full mr-3"
//               />
//               <div className="truncate w-full">
//                 <h4 className="font-semibold">{user.name}</h4>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Khu vực chat */}
//       <div className="flex-1 flex flex-col bg-white">
//         {/* Header */}
//         <div className="p-4 border-b border-gray-300 flex items-center justify-between">
//           {activeUser ? (
//             <h2 className="text-xl font-bold">{activeUser.name}</h2>
//           ) : (
//             <h2 className="text-xl font-bold">Chọn người dùng để trò chuyện</h2>
//           )}
//         </div>

//         {/* Tin nhắn */}
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`mb-4 flex ${message.sender_id === activeUser?.id ? "justify-start" : "justify-end"}`}
//             >
//               <div
//                 className={`inline-block px-4 py-2 rounded-lg ${message.sender_id === activeUser?.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//               >
//                 {message.content}
//                 {message.image_url && (
//                   <div className="mt-2">
//                     <img
//                       src={message.image_url}
//                       alt="image"
//                       className="max-w-xs rounded-md"
//                       onError={() => console.log("Image failed to load")}
//                     />
//                     <div className="text-xs text-gray-500 mt-1">{message.image_url}</div>
//                   </div>
//                 )}
//               </div>
//               <div className="text-xs text-gray-500 ml-2">{message.created_at}</div>
//             </div>
//           ))}
//           <div ref={messageEndRef}></div>
//         </div>

//         {/* Gửi tin nhắn */}
//         <div className="p-4 border-t border-gray-300">
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               className="flex-1 p-2 border rounded"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Nhập tin nhắn..."
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="border"
//             />
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="preview"
//                 className="w-12 h-12 object-cover rounded-md"
//               />
//             )}
//             <button
//               onClick={handleSendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md"
//             >
//               Gửi
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListUserChat;


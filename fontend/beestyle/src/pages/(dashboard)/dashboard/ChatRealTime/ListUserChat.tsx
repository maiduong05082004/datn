import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, Spin } from "antd";
import { any } from "joi";
import React, { useEffect, useRef, useState } from "react";

const ListUserChat: React.FC = () => {
  const [userId, setUserId] = useState<any>(null);
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const { data: userMessage, isLoading: isLoadingUserMessage } = useQuery({
    queryKey: ['userMessage'],
    queryFn: async () => {
      return instance.get(`api/admins/messages/chatted-users`)
    },
  })

  const { data: support, isLoading } = useQuery({
    queryKey: ['support', userId],
    queryFn: async () => {
      if (!userId) return;
      return instance.get(`api/admins/messages/${userId.id}`)
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
      console.log(data);
      
      return instance.post(`api/admins/messages/send`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['support', userId],
      }),
        setMessage("")
      scrollToBottom();
    }
  })
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!userId || !message) return;

    const formData = new FormData();
    formData.append("receiver_id", userId.id);
    formData.append("content", message);

    if (image) {
      formData.append("image_url", image);
    }

    mutate(formData);
  };


  if (isLoadingUserMessage && isLoading) {
    return <Spin tip="Loading..." className="flex justify-center items-center h-screen" />
  }

  return (
    <div className="flex h-[calc(100vh-65px)] bg-gray-100 relative">
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
      {userId ?
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
                  <div className={`${item.sender_id !== userId.id ? "bg-blue-500 text-white" : "bg-slate-200"}  rounded-[5px] p-[5px_10px] max-w-[200px] text-right`}>
                    {item.image_url && <img src={item.image_url} alt="sent-image" className="mt-2 max-w-[150px] mb-2" />}
                    {item.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="absolute bottom-0 border-t border-gray-300 w-[80%] flex items-center px-5 bg-white">
              <div className="flex items-center w-full py-2">
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-md px-4 py-2 cursor-pointer transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18V5a2 2 0 012-2h10a2 2 0 012 2v13" />
                  </svg>
                </label>
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="image_url"
                  onChange={handleImageChange}
                />

                <div className="flex-1 px-3">
                  <input
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tin nhắn..."
                    onChange={(e: any) => setMessage(e.target.value)}
                    value={message}
                  />
                </div>

                <div
                  onClick={() => handleSend()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-md cursor-pointer transition duration-200"
                >
                  Gửi
                </div>
              </div>
            </div>

          </div>

        </div> :
        <div className="bg-white w-[80%] h-[100%]">
          <div className="text-[18px] text-center m-auto mt-[25%]">
            <div className="font-[700] text-[20px]">Chào bạn!</div>
            <div className="font-[500]">Đây là kênh chat trực tiếp.</div>
            <div className="font-[500]">Vui lòng chọn đoạn chat để hỗ trợ khách hàng.</div>
          </div>
        </div>
      }
    </div>
  );
};

export default ListUserChat;

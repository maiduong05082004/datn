import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";

const ListUserChat: React.FC = () => {
  const [userId, setUserId] = useState<any>(null);
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const handleSend = async () => {
    const data = { receiver_id: userId.id, content: message }
    mutate(data)
  }

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

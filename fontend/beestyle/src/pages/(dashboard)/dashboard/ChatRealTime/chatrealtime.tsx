import React, { useState } from "react";

const ChatRealTime: React.FC<{ isDarkMode: boolean; closeChat: () => void }> = ({
  isDarkMode,
  closeChat,
}) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input.trim()]);
      setInput("");
    }
  };

  return (
    <div
      className={`fixed bottom-16 right-4 w-80 h-96 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } rounded-lg shadow-lg flex flex-col z-50`}
    >
      {/* Header */}
      <header
        className={`py-2 px-4 flex justify-between items-center ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-t-lg`}
      >
        <h2 className="text-lg font-semibold">Chat Real-Time</h2>
        <button
          onClick={closeChat}
          className={`text-sm px-2 py-1 rounded ${
            isDarkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-black"
          } hover:bg-red-600 hover:text-white`}
        >
          Close
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                index % 2 === 0
                  ? isDarkMode
                    ? "bg-gray-600"
                    : "bg-gray-300"
                  : isDarkMode
                  ? "bg-gray-700"
                  : "bg-gray-200"
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
      <div
        className={`flex items-center p-2 ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 px-4 py-2 border rounded-l focus:outline-none ${
            isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300"
          }`}
        />
        <button
          onClick={sendMessage}
          className={`px-4 py-2 rounded-r font-semibold ${
            isDarkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRealTime;

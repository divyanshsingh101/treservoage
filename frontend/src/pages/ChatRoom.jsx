import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Connects to the backend

function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit("registerUser", { userId: user._id }); // Send userId to backend
      socket.emit("joinGroup", { groupId: "team-chat" });
  
      socket.on("loadMessages", (msgs) => setMessages(msgs));
      socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    }
    
    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && user?._id) {
      const newMessage = {
        groupId: "team-chat",
        userId: user._id, // Ensure correct userId field
        username: user?.name || "Anonymous",
        message,
        time: new Date().toLocaleTimeString(), // Add the time the message is sent
      };
      socket.emit("sendMessage", newMessage);
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Chat Room</h1>
      
      <div className="bg-white rounded-xl shadow-md h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.userId === user?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${
                  msg.userId === user?._id 
                    ? 'bg-gray-300 text-black text-right' 
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg p-4`}
                style={msg.userId === user?._id ? { alignSelf: 'flex-end' } : {}}>
                  <div className="font-semibold mb-1">{msg.username}</div>
                  <p>{msg.message}</p>
                  <div className="text-sm mt-1 text-gray-500">Sent at: {new Date(msg.time).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-200"
            />
            <button
              type="submit"
              className="bg-gray-300 text-black p-3 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;

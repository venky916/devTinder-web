import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/appStore';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

type Message = {
  firstName: string;
  text: string;
  lastName: string;
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSelector((store: RootState) => store.user);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null); // Store the socket instance

  const [typing, setTyping] = useState(false);

  const fetchMessages = async () => {
    const chat = await axios.get(BASE_URL + 'chat/' + targetUserId, {
      withCredentials: true,
    });
    const chatMessages = chat?.data?.messages.map((msg: any) => ({
      firstName: msg?.senderId?.firstName,
      lastName: msg?.senderId?.lastName,
      text: msg?.text,
    }));
    setMessages((messages) => [...messages, ...chatMessages]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const { _id: userId, firstName, lastName } = user! ?? {};

  useEffect(() => {
    if (!user || !userId) {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);

    // Create socket connection once
    const socket = createSocketConnection();
    setSocket(socket);

    // Join the chat room
    socket.emit('joinChat', { firstName, targetUserId, userId });

    // Listen for new messages
    socket.on('messageReceived', ({ firstName, lastName, text }) => {
      // console.log(firstName,lastName,text)
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    socket.on('typing', () => setTyping(true));

    socket.on('stop typing', () => setTyping(false));

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [user, userId, targetUserId]);

  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    // Emit the message
    socket.emit('sendMessage', {
      firstName,
      lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    socket.emit('stop typing', { userId, targetUserId });

    // Clear the input
    setNewMessage('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-10/12 max-w-3xl mx-auto bg-gray-500 shadow-lg rounded-lg p-6 mt-10 h-[90vh] flex flex-col">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-center border-b pb-3 mb-4 text-gray-800">
        Chat
      </h1>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-600 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              firstName === msg.firstName ? 'chat-end' : 'chat-start'
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              {msg?.firstName}
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">{msg?.text}</div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
        ))}
      </div>

      {typing && <p>typing......</p>}

      {/* Input Area */}
      <div className="flex items-center mt-4 gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => {
            socket.emit('typing', { userId, targetUserId });
            setNewMessage(e.target.value);
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="mobile-container h-screen flex flex-col">
      <div className="flex-1 p-4">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
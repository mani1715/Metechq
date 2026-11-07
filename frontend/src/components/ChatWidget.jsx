import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-600 to-brand-600 text-white p-3.5 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 group chat-widget-button"
      aria-label="Open Chat"
      data-testid="floating-chat-button"
      style={{
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <MessageCircle className="h-6 w-6 group-hover:animate-pulse" style={{ strokeWidth: 2 }} />

      {/* Tooltip - hidden on mobile */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
        Chat with us & Share Testimonial
      </span>
    </button>
  );
};

export default ChatWidget;

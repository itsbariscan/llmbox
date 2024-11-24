import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { Loader, MessagesSquare } from 'lucide-react';

const MessageList = ({ messages, isLoading, searchQuery = '' }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = React.useState(true);

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledNearBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setAutoScroll(isScrolledNearBottom);
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery
    ? messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const renderSearchResults = () => {
    if (!searchQuery) return null;
    
    const matchCount = filteredMessages.length;
    if (matchCount === 0) {
      return (
        <div className="sticky top-0 z-10 p-2 text-center text-sm bg-yellow-50 
                     dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200
                     border border-yellow-200 dark:border-yellow-800 rounded-lg">
          No messages found matching "{searchQuery}"
        </div>
      );
    }
    
    return (
      <div className="sticky top-0 z-10 p-2 text-center text-sm bg-blue-50 
                   dark:bg-blue-900/20 text-blue-800 dark:text-blue-200
                   border border-blue-200 dark:border-blue-800 rounded-lg">
        Found {matchCount} message{matchCount !== 1 ? 's' : ''} matching "{searchQuery}"
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
      onScroll={handleScroll}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {renderSearchResults()}
        
        {filteredMessages.length === 0 && !isLoading && !searchQuery && (
          <div className="text-center mt-20">
            <div className="inline-flex items-center justify-center w-16 h-16 
                        rounded-full bg-primary-100 dark:bg-primary-900/20 
                        text-primary-600 dark:text-primary-400 mb-4">
              <MessagesSquare size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to LLMBox
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              Start a conversation or upload a file to begin. I'm here to help with analysis, 
              coding, and any questions you might have.
            </p>
          </div>
        )}

        {filteredMessages.map((message) => (
          <Message 
            key={message.id} 
            message={message}
            highlight={searchQuery}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start animate-slide-up">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-4 
                        bg-white dark:bg-gray-800 border border-gray-200 
                        dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Loader className="animate-spin" size={16} />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
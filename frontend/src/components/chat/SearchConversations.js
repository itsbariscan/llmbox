import React, { useState } from 'react';
import { Search, MessagesSquare, X } from 'lucide-react';
import useConversationStore from '../../store/conversationStore';

const SearchConversations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { conversations } = useConversationStore();

  const filteredConversations = conversations.filter(conv => 
    (conv.title || 'New Chat').toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="relative">
        <input
          id="conversation-search"
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-10 rounded-lg
                   bg-gray-100 dark:bg-gray-800
                   text-gray-900 dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   border border-gray-200 dark:border-gray-700
                   focus:outline-none focus:ring-2 
                   focus:ring-primary-500 focus:border-transparent"
        />
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 
                   text-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {filteredConversations.length} results found
        </div>
      )}
    </div>
  );
};

export default SearchConversations;
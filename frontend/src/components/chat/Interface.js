import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';
import useConversationStore from '../../store/conversationStore';

const ChatInterface = ({ onToggleSidebar }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    getActiveConversation,
    addMessage,
    activeConversationId,
    settings,
    addConversation
  } = useConversationStore();

  useEffect(() => {
    if (!activeConversationId) {
      addConversation();
    }
  }, [activeConversationId, addConversation]);

  const handleFileSelect = (files) => {
    // If files is an array, use it directly; otherwise, wrap it in an array
    const fileArray = Array.isArray(files) ? files : [files];
    
    // Check each file's size
    const validFiles = fileArray.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 50MB limit.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const sendMessage = async (content) => {
    if (!content.trim() && !selectedFiles.length) return;

    setIsLoading(true);
    
    try {
      let response;
      const temperature = parseFloat(settings?.temperature || 0.7);
      
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
          formData.append('files', file);
        });
        formData.append('message', content);
        formData.append('model', settings.model);
        formData.append('temperature', temperature);

        const userMessage = {
          role: 'user',
          content,
          id: Date.now(),
          hasFiles: true,
          fileNames: selectedFiles.map(f => f.name),
          model: settings.model
        };
        addMessage(activeConversationId, userMessage);

        response = await fetch('http://localhost:3001/api/chat/upload', {
          method: 'POST',
          body: formData
        });
      } else {
        const userMessage = {
          role: 'user',
          content,
          id: Date.now(),
          model: settings.model
        };
        addMessage(activeConversationId, userMessage);

        const conversation = getActiveConversation();
        const messages = conversation?.messages || [];

        response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model: settings.model,
            temperature: temperature
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get response');
      }

      const data = await response.json();

      addMessage(activeConversationId, {
        role: 'assistant',
        content: data.content,
        id: Date.now() + 1,
        model: data.model
      });

    } catch (error) {
      console.error('Chat error:', error);
      addMessage(activeConversationId, {
        role: 'system',
        content: `Error: ${error.message}. Please try again.`,
        id: Date.now() + 1,
        isError: true
      });
    } finally {
      setIsLoading(false);
      setSelectedFiles([]);
    }
  };

  const conversation = getActiveConversation();
  const messages = conversation?.messages || [];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header 
        onToggleSidebar={onToggleSidebar}
        onSearch={handleSearch}
      />

      <div className="flex-1 overflow-y-auto">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>

      <MessageInput 
        onSend={sendMessage} 
        isLoading={isLoading}
        onFileSelect={handleFileSelect}
        selectedFiles={selectedFiles}
      />
    </div>
  );
};

export default ChatInterface;
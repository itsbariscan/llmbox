import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const MessageInput = ({ onSend, isLoading, onFileSelect, selectedFiles }) => {
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length && onFileSelect) {
      // Combine new files with existing ones
      const newFiles = [...(selectedFiles || []), ...acceptedFiles];
      onFileSelect(newFiles);
    }
    setIsDragging(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt', '.md', '.js', '.py', '.html', '.css'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
    },
    multiple: true,
    noClick: true,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || selectedFiles?.length > 0) && !isLoading) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event?.target?.files || []);
    if (files.length && onFileSelect) {
      // Combine new files with existing ones
      const newFiles = [...(selectedFiles || []), ...files];
      onFileSelect(newFiles);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto p-4" {...getRootProps()}>
        {isDragging && (
          <div className="absolute inset-0 bg-primary-500/10 border-2 border-dashed border-primary-500 rounded-lg z-50 flex items-center justify-center">
            <p className="text-primary-600 dark:text-primary-400 text-lg font-medium">
              Drop files here...
            </p>
          </div>
        )}

        {selectedFiles?.length > 0 && (
          <div className="mb-2 space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={index} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Upload size={16} />
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect(selectedFiles.filter((_, i) => i !== index));
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 
                       bg-gray-50 dark:bg-gray-900 focus-within:ring-2 
                       focus-within:ring-primary-500 focus-within:border-transparent">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isDragging ? 'Drop files here or type your message...' : 'Type your message...'}
              disabled={isLoading}
              className="w-full px-4 py-3 pr-24 bg-transparent
                       text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400
                       resize-none outline-none min-h-[44px] max-h-[200px]
                       disabled:opacity-50"
              style={{ overflowY: message.split('\n').length > 1 ? 'auto' : 'hidden' }}
            />
            <div className="absolute right-2 bottom-1 flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.js,.py,.java,.cpp,.html,.css"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isLoading}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 
                         dark:hover:text-gray-300 hover:bg-gray-100 
                         dark:hover:bg-gray-800 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={20} />
              </button>
              <button
                type="submit"
                disabled={isLoading || (!message.trim() && !selectedFiles?.length)}
                className="p-2 rounded-lg bg-primary-600 text-white
                         hover:bg-primary-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
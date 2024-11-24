import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MODELS } from '../../config/constants';

const Message = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getModelName = (modelId) => {
    const model = Object.values(MODELS).find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  // Custom renderer for code blocks
  const components = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (!inline && language) {
        return (
          <div className="relative group mt-4 mb-4">
            <div className="absolute right-2 top-2 z-10">
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="p-2 rounded bg-gray-800/50 hover:bg-gray-800/75 
                         text-gray-300 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200"
                title="Copy code"
              >
                <Copy size={14} />
              </button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.75rem',
                background: '#1a1b26',
                padding: '1rem',
              }}
              showLineNumbers={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className={`font-mono text-sm px-1.5 py-0.5 rounded
            ${message.role === 'user' 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}
          {...props}
        >
          {children}
        </code>
      );
    }
  };

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-4 group animate-slide-up`}
    >
      <div
        className={`relative max-w-[85%] ${
          message.role === 'user'
            ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm'
            : message.isError
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-sm'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm'
        } p-4 shadow-sm`}
      >
        {/* File attachment */}
        {message.hasFile && (
          <div className="text-xs opacity-75 mb-2 flex items-center gap-1">
            <span className="w-4 h-4">📎</span>
            {message.fileName}
          </div>
        )}
        
        {/* Model info */}
        {message.role === 'assistant' && message.model && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <span className="w-4 h-4">🤖</span>
            {getModelName(message.model)}
          </div>
        )}
        
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow overflow-x-auto">
            {message.role === 'user' ? (
              <p className="whitespace-pre-wrap text-white">{message.content}</p>
            ) : (
              <ReactMarkdown 
                components={components}
                className={`prose ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none`}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors
              ${message.role === 'user' 
                ? 'text-white/70 hover:text-white hover:bg-white/10' 
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Copy message"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="absolute bottom-1 right-1 text-xs opacity-50">
          {new Date(message.id).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Message;
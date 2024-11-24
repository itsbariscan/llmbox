// frontend/src/components/chat/Header.js
import React, { useState } from 'react';
import { Menu, Pencil, Check, X } from 'lucide-react';
import useConversationStore from '../../store/conversationStore';

const Header = ({ onToggleSidebar }) => {
  const { getActiveConversation, updateConversationTitle } = useConversationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  
  const activeConversation = getActiveConversation();
  const title = activeConversation?.title || 'New Chat';

  const handleEditStart = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleEditSave = () => {
    if (editTitle.trim() && activeConversation) {
      updateConversationTitle(activeConversation.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle('');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b 
                     border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 
                   dark:text-gray-400 dark:hover:bg-gray-800 
                   transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1 flex items-center min-w-0 group">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSave();
                  if (e.key === 'Escape') handleEditCancel();
                }}
                className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                         text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent min-w-0"
                autoFocus
                placeholder="Enter conversation title"
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEditSave}
                  className="p-1.5 rounded-md text-gray-600 hover:text-green-500 
                           dark:text-gray-400 dark:hover:text-green-400
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-colors"
                  title="Save"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-1.5 rounded-md text-gray-600 hover:text-red-500
                           dark:text-gray-400 dark:hover:text-red-400
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-colors"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h1>
              <button
                onClick={handleEditStart}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 
                         dark:text-gray-500 dark:hover:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors opacity-0 group-hover:opacity-100"
                title="Edit title"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
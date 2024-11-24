// frontend/src/layouts/MainLayout.js
import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Sun, 
  Moon, 
  Settings as SettingsIcon, 
  MessagesSquare, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Pencil, 
  Check, 
  X 
} from 'lucide-react';
import useConversationStore from '../store/conversationStore';
import { useTheme } from '../context/ThemeContext';
import SearchInput from '../components/shared/SearchInput';

const MainLayout = ({ children, isSidebarOpen, onToggleSidebar, onOpenSettings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const { isDark, toggleTheme } = useTheme();
  
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation,
    addConversation,
    deleteConversation,
    updateConversationTitle
  } = useConversationStore();

  const handleNewChat = useCallback(() => {
    const newId = addConversation();
    setActiveConversation(newId);
  }, [addConversation, setActiveConversation]);

  const handleEditStart = useCallback((conv) => {
    setEditingId(conv.id);
    setEditingTitle(conv.title || 'New Chat');
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingTitle.trim()) {
      updateConversationTitle(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  }, [editingId, editingTitle, updateConversationTitle]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditingTitle('');
  }, []);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    (conv.title || 'New Chat').toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}
      
      {/* Mobile toggle button */}
      <button
        onClick={onToggleSidebar}
        className="absolute top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 
                 shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden
                 text-gray-600 dark:text-gray-400 hover:bg-gray-100 
                 dark:hover:bg-gray-700 transition-colors"
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40 
          transition-all duration-300 ease-in-out flex
          ${isSidebarOpen ? 'w-[320px]' : 'w-[72px]'}
          ${isDark 
            ? 'bg-gray-900 border-r border-gray-800' 
            : 'bg-white border-r border-gray-200'}
        `}
      >
        {/* Minimized Sidebar */}
        <div className={`
          flex flex-col items-center py-4 w-[72px] flex-shrink-0
          border-r border-gray-200 dark:border-gray-800
        `}>
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800
                          text-gray-900 dark:text-white">
              <MessagesSquare size={24} />
            </div>
            <button
              onClick={handleNewChat}
              className="p-3 rounded-xl text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="New Chat"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-3 rounded-xl text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Settings"
            >
              <SettingsIcon size={24} />
            </button>
            <button
              onClick={onToggleSidebar}
              className="p-3 rounded-xl text-gray-600 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                       hidden lg:block"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
          </div>
        </div>

        {/* Expanded Sidebar Content */}
        <div className={`
          flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${isSidebarOpen ? 'w-[248px] opacity-100' : 'w-0 opacity-0'}
        `}>
          {isSidebarOpen && (
            <>
              {/* Search input */}
              <div className="p-4">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onClear={() => setSearchTerm('')}
                  placeholder="Search conversations..."
                />
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {searchTerm && filteredConversations.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div 
                      key={conv.id}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg 
                        cursor-pointer transition-all duration-200 ease-in-out
                        ${conv.id === activeConversationId 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                      `}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                                    bg-gray-200/50 dark:bg-gray-700/50">
                        <MessagesSquare size={16} />
                      </div>
                      
                      {editingId === conv.id ? (
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave();
                              if (e.key === 'Escape') handleEditCancel();
                            }}
                            className="flex-1 min-w-0 bg-white dark:bg-gray-700 text-sm px-2 py-1 rounded-md
                                     border border-gray-300 dark:border-gray-600
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                     focus:border-transparent"
                            autoFocus
                            placeholder="Enter conversation title"
                          />
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSave();
                              }}
                              className="p-1.5 rounded-md text-gray-600 hover:text-green-500 
                                       dark:text-gray-400 dark:hover:text-green-400
                                       hover:bg-gray-200 dark:hover:bg-gray-700
                                       transition-colors"
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCancel();
                              }}
                              className="p-1.5 rounded-md text-gray-600 hover:text-red-500
                                       dark:text-gray-400 dark:hover:text-red-400
                                       hover:bg-gray-200 dark:hover:bg-gray-700
                                       transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="truncate text-sm font-medium">
                              {conv.title || 'New Chat'}
                            </span>
                            {conv.lastUpdated && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(conv.lastUpdated).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100
                                      transition-opacity duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(conv);
                              }}
                              className="p-1.5 rounded-md text-gray-600 hover:text-blue-500 
                                       dark:text-gray-400 dark:hover:text-blue-400
                                       hover:bg-gray-200 dark:hover:bg-gray-700
                                       transition-colors"
                              title="Edit title"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this conversation?')) {
                                  deleteConversation(conv.id);
                                }
                              }}
                              className="p-1.5 rounded-md text-gray-600 hover:text-red-500
                                       dark:text-gray-400 dark:hover:text-red-400
                                       hover:bg-gray-200 dark:hover:bg-gray-700
                                       transition-colors"
                              title="Delete conversation"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
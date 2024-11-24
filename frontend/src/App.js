// frontend/src/App.js
import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import ChatInterface from './components/chat/Interface';
import Settings from './components/settings/Settings';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    console.log('Toggling sidebar:', !isSidebarOpen);
    setSidebarOpen(prev => !prev);
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-white dark:bg-gray-900">
        <MainLayout 
          onOpenSettings={() => setIsSettingsOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        >
          <ChatInterface onToggleSidebar={handleToggleSidebar} />
        </MainLayout>
        <Settings 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
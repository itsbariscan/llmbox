// frontend/src/store/conversationStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useConversationStore = create(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      settings: {
        theme: 'system',
        model: 'claude-3-opus-20240229',
        temperature: 0.7,
        maxTokens: 4096
      },

      addConversation: () => {
        const newConversation = {
          id: Date.now(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        set(state => {
          const newState = {
            conversations: [...state.conversations, newConversation],
            activeConversationId: newConversation.id,
          };
          console.log('Added conversation:', newState);
          return newState;
        });

        return newConversation.id;
      },

      addMessage: (conversationId, message) => {
        set(state => {
          const newState = {
            conversations: state.conversations.map(conv =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, message],
                    lastUpdated: new Date().toISOString(),
                    title: conv.messages.length === 0 && message.role === 'user' 
                      ? message.content.slice(0, 30) + '...'
                      : conv.title,
                  }
                : conv
            ),
          };
          console.log('Added message:', message, 'New state:', newState);
          return newState;
        });
      },

      updateConversationTitle: (id, newTitle) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id
              ? {
                  ...conv,
                  title: newTitle,
                  lastUpdated: new Date().toISOString()
                }
              : conv
          ),
        }));
      },

      deleteConversation: (id) => {
        set(state => ({
          conversations: state.conversations.filter(conv => conv.id !== id),
          activeConversationId: state.activeConversationId === id
            ? state.conversations[0]?.id || null
            : state.activeConversationId
        }));
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find(
          conv => conv.id === state.activeConversationId
        );
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'llmbox-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Hydrated state:', state);
      },
    }
  )
);

export default useConversationStore;
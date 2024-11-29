import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message } from '../types';
import { generateId } from '../lib/utils';

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  createChat: (modelId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setCurrentChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,

      createChat: (modelId) => {
        const newChat: Chat = {
          id: generateId(),
          title: 'New Chat',
          messages: [],
          modelId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
      },

      addMessage: (message) => {
        const { currentChatId, chats } = get();
        if (!currentChatId) return;

        const newMessage: Message = {
          id: generateId(),
          ...message,
          timestamp: Date.now(),
        };

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: Date.now(),
                  title:
                    chat.messages.length === 0 && message.isUser
                      ? message.content.slice(0, 30) + '...'
                      : chat.title,
                }
              : chat
          ),
        }));

        return newMessage.id;
      },

      updateMessage: (messageId, updates) => {
        const { currentChatId } = get();
        if (!currentChatId) return;

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, ...updates }
                      : msg
                  ),
                }
              : chat
          ),
        }));
      },

      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId });
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          currentChatId:
            state.currentChatId === chatId
              ? state.chats[0]?.id ?? null
              : state.currentChatId,
        }));
      },

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        }));
      },
    }),
    {
      name: 'nymai-storage',
    }
  )
);
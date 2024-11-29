import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

function ChatList() {
  const { chats, currentChatId, setCurrentChat, deleteChat } = useChatStore();

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={cn(
            "group flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-dark-300 transition-colors",
            currentChatId === chat.id && "bg-dark-300"
          )}
          onClick={() => setCurrentChat(chat.id)}
        >
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 truncate">{chat.title}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(chat.updatedAt)} ago
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteChat(chat.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-400 rounded transition-all"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ))}
      {chats.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          No chats yet. Start a new conversation!
        </div>
      )}
    </div>
  );
}

export default ChatList;
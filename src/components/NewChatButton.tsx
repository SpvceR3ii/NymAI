import React from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface NewChatButtonProps {
  onClick: () => void;
  className?: string;
}

export function NewChatButton({ onClick, className }: NewChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-2 rounded-lg",
        "bg-nymred-500 hover:bg-nymred-600 text-white transition-colors",
        className
      )}
    >
      <PlusCircle className="w-5 h-5" />
      <span>New Chat</span>
    </button>
  );
}
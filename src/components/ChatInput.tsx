import React from 'react';
import { Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, className, disabled }: ChatInputProps) {
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full min-h-[80px] p-4 pr-12 rounded-lg bg-dark-300 border border-dark-400 
                 text-gray-100 focus:border-nymred-500 focus:outline-none focus:ring-1 
                 focus:ring-nymred-500 resize-none placeholder:text-gray-500"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={cn(
          "absolute right-4 bottom-4 p-2 rounded-full",
          "bg-nymred-500 text-white hover:bg-nymred-600 transition-colors",
          "disabled:bg-dark-400 disabled:cursor-not-allowed"
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
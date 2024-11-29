import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PerformanceMetrics } from './PerformanceMetrics';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  className?: string;
}

function ChatMessage({ message, className }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg",
        message.isUser ? "bg-dark-300" : "bg-dark-300/50",
        className
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        message.isUser ? "bg-nymred-500" : "bg-dark-400"
      )}>
        {message.isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-300">
            {message.isUser ? "You" : "Assistant"}
          </p>
          {!message.isUser && message.performance && (
            <PerformanceMetrics
              totalTokens={message.performance.totalTokens}
              tokensPerSecond={message.performance.tokensPerSecond}
              duration={message.performance.duration}
            />
          )}
        </div>
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
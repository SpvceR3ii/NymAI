import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadingScreenProps {
  className?: string;
}

export function LoadingScreen({ className }: LoadingScreenProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-dark-100 flex items-center justify-center z-50",
      "animate-fade-in transition-opacity duration-300",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Flame className="w-16 h-16 text-nymred-500 animate-pulse" />
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-nymred-500 animate-slide-up">
            NymAI
          </h1>
          <p className="text-gray-400 mt-2 animate-slide-up animation-delay-100">
            Loading your AI experience...
          </p>
        </div>
        <div className="w-48 h-1 bg-dark-300 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-nymred-500 animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface PerformanceMetricsProps {
  totalTokens: number;
  tokensPerSecond: number;
  duration: number;
  className?: string;
}

export function PerformanceMetrics({ 
  totalTokens, 
  tokensPerSecond, 
  duration,
  className 
}: PerformanceMetricsProps) {
  return (
    <div className={cn("flex items-center gap-4 text-xs text-gray-400", className)}>
      <div className="flex items-center gap-1">
        <Zap className="w-3 h-3" />
        <span>{tokensPerSecond.toFixed(1)} tokens/s</span>
      </div>
      <div>
        {totalTokens} tokens
      </div>
      <div>
        {duration.toFixed(2)}s
      </div>
    </div>
  );
}
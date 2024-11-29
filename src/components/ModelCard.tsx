import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Cpu, HardDrive, Clock } from 'lucide-react';
import { ModelInfo } from '../types';
import { cn } from '../lib/utils';

interface ModelCardProps {
  model: ModelInfo;
  className?: string;
}

function ModelCard({ model, className }: ModelCardProps) {
  return (
    <div className={cn("bg-dark-200 rounded-lg p-4 border border-dark-300", className)}>
      <h3 className="text-lg font-semibold text-nymred-400 mb-4">{model.name}</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-300">
          <Cpu className="w-4 h-4" />
          <span className="text-sm">
            {model.details.parameter_size} Parameters
            {model.details.quantization_level && ` (${model.details.quantization_level})`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <HardDrive className="w-4 h-4" />
          <span className="text-sm">
            {(model.size / 1024 / 1024 / 1024).toFixed(2)} GB
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            Modified {formatDistanceToNow(new Date(model.modified))} ago
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-dark-400">
          <p className="text-sm text-gray-400">
            Family: {model.details.family}
          </p>
          {model.details.families && (
            <p className="text-sm text-gray-400 mt-1">
              Compatible: {model.details.families.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModelCard;
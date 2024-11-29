import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModelSelectorProps {
  models: string[];
  selectedModel: string;
  onModelSelect: (model: string) => void;
  className?: string;
}

export function ModelSelector({ models, selectedModel, onModelSelect, className }: ModelSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredModels = models.filter(model => 
    model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search models..."
          className="w-full rounded-lg bg-dark-200 border border-dark-300 text-gray-100 pl-10 pr-4 py-2 
                   focus:border-nymred-500 focus:outline-none focus:ring-1 focus:ring-nymred-500
                   placeholder:text-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mt-2 max-h-60 overflow-auto rounded-lg border border-dark-300 bg-dark-200">
        {filteredModels.map((model) => (
          <button
            key={model}
            className={cn(
              "w-full px-4 py-2 text-left text-gray-100 hover:bg-dark-300 transition-colors",
              selectedModel === model && "bg-nymred-500/20 text-nymred-400"
            )}
            onClick={() => onModelSelect(model)}
          >
            {model}
          </button>
        ))}
      </div>
    </div>
  );
}
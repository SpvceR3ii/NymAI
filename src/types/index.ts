export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  performance?: {
    totalTokens: number;
    tokensPerSecond: number;
    duration: number;
  };
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

export interface ModelInfo {
  name: string;
  modified: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}
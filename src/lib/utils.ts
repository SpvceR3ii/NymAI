import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ModelInfo } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const OLLAMA_BASE_URL = 'http://localhost:11434/api';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchModels(): Promise<string[]> {
  try {
    const response = await fetchWithTimeout(`${OLLAMA_BASE_URL}/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export async function fetchModelInfo(modelName: string): Promise<ModelInfo | null> {
  try {
    const response = await fetchWithTimeout(`${OLLAMA_BASE_URL}/show`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching model info:', error);
    return null;
  }
}

export async function streamResponse(
  model: string, 
  prompt: string, 
  onChunk: (text: string, metrics?: { total_tokens: number; eval_count: number; eval_duration: number }) => void
) {
  try {
    const response = await fetchWithTimeout(`${OLLAMA_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let currentResponse = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (!line) continue;
        try {
          const json = JSON.parse(line);
          currentResponse += json.response;
          
          if (json.done) {
            const duration = json.eval_duration || 0;
            onChunk(currentResponse, {
              total_tokens: json.total_tokens || 0,
              eval_count: json.eval_count || 0,
              eval_duration: duration
            });
          } else {
            onChunk(currentResponse);
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
  } catch (error) {
    console.error('Error streaming response:', error);
    throw error;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
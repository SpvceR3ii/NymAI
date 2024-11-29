import React, { Suspense, lazy } from 'react';
import { fetchModels, fetchModelInfo, streamResponse } from './lib/utils';
import { ModelSelector } from './components/ModelSelector';
import { ChatInput } from './components/ChatInput';
import { NewChatButton } from './components/NewChatButton';
import { Flame, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useChatStore } from './store/chatStore';
import { ModelInfo } from './types';
import { cn } from './lib/utils';
import { LoadingScreen } from './components/LoadingScreen';
import { useLoadingState } from './hooks/useLoadingState';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load components that are not immediately needed
const ChatMessage = lazy(() => import('./components/ChatMessage'));
const ModelCard = lazy(() => import('./components/ModelCard'));
const ChatList = lazy(() => import('./components/ChatList'));

function App() {
  const { isLoading } = useLoadingState();
  const [models, setModels] = React.useState<string[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  const [modelInfo, setModelInfo] = React.useState<ModelInfo | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { 
    chats, 
    currentChatId, 
    createChat, 
    addMessage,
    updateMessage,
  } = useChatStore();

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const memoizedCurrentChat = React.useMemo(() => currentChat, [currentChat?.id, currentChat?.messages.length]);

  React.useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await fetchModels();
        if (availableModels.length === 0) {
          setError('No models found. Please ensure Ollama is running and has models installed.');
          return;
        }
        setModels(availableModels);
        setSelectedModel(availableModels[0]);
        setError(null);
      } catch (err) {
        setError('Failed to connect to Ollama. Please ensure it is running on http://localhost:11434');
      }
    };
    loadModels();
  }, []);

  React.useEffect(() => {
    const loadModelInfo = async () => {
      if (selectedModel) {
        const info = await fetchModelInfo(selectedModel);
        setModelInfo(info);
      }
    };
    loadModelInfo();
  }, [selectedModel]);

  const handleNewChat = React.useCallback(() => {
    if (selectedModel) {
      createChat(selectedModel);
    }
  }, [selectedModel, createChat]);

  const handleModelSelect = React.useCallback((model: string) => {
    setSelectedModel(model);
    createChat(model);
  }, [createChat]);

  const handleSubmit = React.useCallback(async (prompt: string) => {
    if (!selectedModel || !currentChatId || isProcessing) return;

    const messageId = addMessage({ content: prompt, isUser: true });
    setIsProcessing(true);

    try {
      let currentResponse = '';
      await streamResponse(selectedModel, prompt, (text, metrics) => {
        currentResponse = text;
        if (metrics) {
          updateMessage(messageId, {
            content: currentResponse,
            isUser: false,
            performance: {
              totalTokens: metrics.total_tokens,
              tokensPerSecond: metrics.total_tokens / metrics.eval_duration,
              duration: metrics.eval_duration
            }
          });
        } else {
          updateMessage(messageId, {
            content: currentResponse,
            isUser: false
          });
        }
      });
    } catch (err) {
      updateMessage(messageId, {
        content: 'Failed to get response from Ollama. Please try again.',
        isUser: false
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedModel, currentChatId, isProcessing, addMessage, updateMessage]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-dark-100 flex text-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-dark-200 border-r border-dark-300 transform transition-transform duration-200 ease-in-out z-20",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-6 h-6 text-nymred-500" />
            <h1 className="text-lg font-semibold text-nymred-500">NymAI</h1>
          </div>
          <NewChatButton onClick={handleNewChat} className="mb-4" />
          <ErrorBoundary>
            <Suspense fallback={<div className="animate-pulse bg-dark-300 h-full rounded-lg" />}>
              <div className="flex-1 overflow-y-auto">
                <ChatList />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-200 ease-in-out",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <header className="bg-dark-200 border-b border-dark-300 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
              className="max-w-xs"
            />
          </div>
        </header>

        <main className="flex-1 flex gap-4 p-4 overflow-hidden">
          {error ? (
            <div className="w-full flex items-center justify-center">
              <div className="bg-dark-200 p-6 rounded-lg border border-nymred-500/50">
                <h2 className="text-xl font-semibold text-nymred-500 mb-2">Connection Error</h2>
                <p className="text-gray-300">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Model Info */}
              <ErrorBoundary>
                <Suspense fallback={<div className="w-64 animate-pulse bg-dark-300 rounded-lg" />}>
                  {modelInfo && (
                    <div className="w-64 flex-shrink-0">
                      <ModelCard model={modelInfo} />
                    </div>
                  )}
                </Suspense>
              </ErrorBoundary>

              {/* Chat Area */}
              <div className="flex-1 bg-dark-200 rounded-lg border border-dark-300 overflow-hidden flex flex-col">
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex-1 animate-pulse bg-dark-300" />}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {memoizedCurrentChat?.messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                        />
                      ))}
                    </div>
                  </Suspense>
                </ErrorBoundary>

                <div className="border-t border-dark-300 p-4">
                  <ChatInput
                    onSubmit={handleSubmit}
                    disabled={isProcessing || !selectedModel}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
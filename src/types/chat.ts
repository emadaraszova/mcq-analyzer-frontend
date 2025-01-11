export interface ChatAnswerProps {
    sessionId: string;
    prompt: string;
    model: string;
    isStreaming: boolean;
    onResponseReady: () => void;
    onResponse: (response: string) => void; 
  }
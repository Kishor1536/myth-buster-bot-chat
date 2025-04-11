
import React from 'react';
import { Bot, User, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  status?: 'busted' | 'confirmed' | 'checking';
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  const statusIcons = {
    busted: <XCircle className="h-5 w-5 text-myth-busted" />,
    confirmed: <CheckCircle className="h-5 w-5 text-myth-confirmed" />,
    checking: <HelpCircle className="h-5 w-5 text-myth-checking animate-pulse-slow" />
  };

  return (
    <div className={cn(
      "flex gap-3 mb-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-10 duration-300",
      isBot ? "" : "ml-auto"
    )}>
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0",
        isBot ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
      )}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      
      <div className={cn(
        "flex flex-col p-4 rounded-lg shadow-sm",
        isBot 
          ? "bg-white border border-gray-200 rounded-tl-none" 
          : "bg-indigo-500 text-white rounded-tr-none"
      )}>
        {isBot && message.status && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {statusIcons[message.status]}
              <span className={cn(
                "text-sm font-medium",
                message.status === 'busted' ? "text-myth-busted" :
                message.status === 'confirmed' ? "text-myth-confirmed" : 
                "text-myth-checking"
              )}>
                {message.status === 'busted' ? 'Myth Busted' : 
                 message.status === 'confirmed' ? 'Fact Confirmed' : 'Checking...'}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
        
        <p className={cn(
          "text-sm md:text-base whitespace-pre-wrap",
          !isBot && "text-white"
        )}>
          {message.content}
        </p>
        
        {!isBot && (
          <span className="text-xs text-indigo-200 self-end mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

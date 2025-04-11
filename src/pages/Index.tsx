
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import ChatMessage, { MessageType } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useGrokAPI } from '@/hooks/useGrokAPI';
import { Bot } from 'lucide-react';

const Index = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome',
      content: "Hello! I'm HealthMythBuster. Ask me about any health-related myth, and I'll tell you if it's true or false based on current scientific evidence.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const { analyzeHealthMyth, isLoading } = useGrokAPI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add temporary bot response
    const tempBotId = uuidv4();
    const tempBotMessage: MessageType = {
      id: tempBotId,
      content: "Analyzing your health claim...",
      sender: 'bot',
      status: 'checking',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, tempBotMessage]);
    
    // Get response from Grok
    const response = await analyzeHealthMyth(content);
    
    // Update bot message with response
    setMessages(prev => 
      prev.map(msg => 
        msg.id === tempBotId 
          ? { 
              ...msg, 
              content: response.content,
              status: response.status,
              timestamp: new Date()
            } 
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-auto p-4 pb-24">
        <div className="container mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="bg-blue-100 p-6 rounded-full mb-4">
                <Bot size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to HealthMythBuster</h2>
              <p className="text-gray-600 max-w-md">
                Ask me about any health-related myth, and I'll use scientific evidence to verify if it's true or false.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;


import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0 z-10">
      <div className="container mx-auto flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            className="w-full rounded-lg border border-gray-300 bg-white p-3 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[50px] max-h-[150px]"
            placeholder="Enter a health myth to verify..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            style={{ 
              height: 'auto', 
              minHeight: '50px',
              maxHeight: '150px'
            }}
          />
          <div className="absolute bottom-2 right-2">
            <Button
              onClick={handleSendMessage}
              disabled={message.trim() === '' || disabled}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

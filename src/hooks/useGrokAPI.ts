
import { useState } from 'react';
import { createMythBusterPrompt } from '@/utils/prompts';
import { useToast } from '@/hooks/use-toast';
import { analyzeHealthMythWithGroq, getGroqAPIKey } from '@/utils/groqAPI';

export const useGrokAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [hasApiKey, setHasApiKey] = useState(() => !!getGroqAPIKey());

  const checkApiKey = () => {
    const hasKey = !!getGroqAPIKey();
    setHasApiKey(hasKey);
    return hasKey;
  };

  const analyzeHealthMyth = async (myth: string) => {
    setIsLoading(true);
    
    try {
      if (!checkApiKey()) {
        return {
          content: "To analyze health myths, please add your GROQ API key in the settings at the top right.",
          status: 'checking' as const
        };
      }
      
      // Use GROQ API instead
      return await analyzeHealthMythWithGroq(myth);
    } catch (error) {
      console.error('Error analyzing myth:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the myth. Please try again.",
        variant: "destructive"
      });
      return {
        content: "Sorry, I encountered an error while analyzing this myth. Please try again.",
        status: 'checking' as const
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeHealthMyth, isLoading, hasApiKey, checkApiKey };
};


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGroqAPIKey, setGroqAPIKey } from '@/utils/groqAPI';
import { Settings, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  onKeySet: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = getGroqAPIKey();
    setHasKey(!!storedKey);
  }, [isOpen]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setGroqAPIKey(apiKey.trim());
      setHasKey(true);
      setIsOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your GROQ API key has been saved successfully",
      });
      onKeySet();
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid GROQ API key",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1" 
        onClick={() => setIsOpen(true)}
      >
        <Settings size={16} />
        {hasKey ? (
          <span className="flex items-center">
            API Key <Check size={14} className="text-green-500 ml-1" />
          </span>
        ) : (
          <span>Set API Key</span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>GROQ API Key</DialogTitle>
            <DialogDescription>
              Enter your GROQ API key to enable health myth analysis. 
              Your key is stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <Input 
                id="apiKey" 
                type="password"
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="grk_..."
                className="col-span-3"
              />
            </div>
            <p className="text-xs text-gray-500">
              Get your API key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">GROQ Console</a>
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveKey}>
              <Check size={16} className="mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyModal;

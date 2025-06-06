
import React from 'react';
import { Stethoscope } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';

interface HeaderProps {
  onApiKeySet?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onApiKeySet = () => {} }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-8 w-8" />
          <h1 className="text-xl md:text-2xl font-bold">Health Myth Buster</h1>
        </div>
        <div className="flex items-center gap-2">
          <ApiKeyModal onKeySet={onApiKeySet} />
          <p className="hidden md:block text-sm">Debunking health myths with science</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

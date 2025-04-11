
import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-8 w-8" />
          <h1 className="text-xl md:text-2xl font-bold">HealthMythBuster</h1>
        </div>
        <p className="hidden md:block text-sm">Debunking health myths with AI</p>
      </div>
    </header>
  );
};

export default Header;

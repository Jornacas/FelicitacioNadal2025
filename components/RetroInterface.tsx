
import React from 'react';

interface RetroInterfaceProps {
  children: React.ReactNode;
  title?: string;
}

const RetroInterface: React.FC<RetroInterfaceProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen amstrad-blue amstrad-border p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-8 text-yellow-400 text-xs">
        EIXOS CREATIVA CPC 464 128K RAM
      </div>
      <div className="absolute top-4 right-8 text-yellow-400 text-xs">
        (C) 1984 AMSTRAD CONSUMER ELECTRONICS PLC
      </div>
      
      {title && (
        <h1 className="text-2xl md:text-4xl text-yellow-400 mb-8 text-center animate-pulse">
          {title}
        </h1>
      )}

      <div className="w-full max-w-4xl bg-black border-4 border-yellow-400 p-6 relative">
        {children}
      </div>

      <div className="mt-8 text-yellow-400 text-sm flex gap-4">
        <span className="animate-bounce">Ready _</span>
      </div>
    </div>
  );
};

export default RetroInterface;


import React from 'react';

interface RetroInterfaceProps {
  children: React.ReactNode;
  title?: string;
}

const RetroInterface: React.FC<RetroInterfaceProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen h-full amstrad-blue amstrad-border p-2 sm:p-4 md:p-8 flex flex-col items-center justify-start sm:justify-center relative overflow-auto">
      <div className="hidden sm:block absolute top-2 left-4 sm:top-4 sm:left-8 text-yellow-400 text-[8px] sm:text-xs">
        EIXOS CREATIVA CPC 464 128K RAM
      </div>
      <div className="hidden sm:block absolute top-2 right-4 sm:top-4 sm:right-8 text-yellow-400 text-[8px] sm:text-xs">
        (C) 1984 AMSTRAD
      </div>

      {title && (
        <h1 className="text-lg sm:text-2xl md:text-4xl text-yellow-400 mb-2 sm:mb-4 md:mb-8 text-center animate-pulse mt-2 sm:mt-0">
          {title}
        </h1>
      )}

      <div className="w-full max-w-4xl bg-black border-2 sm:border-4 border-yellow-400 p-2 sm:p-4 md:p-6 relative">
        {children}
      </div>

      <div className="hidden sm:flex mt-4 md:mt-8 text-yellow-400 text-xs sm:text-sm gap-4">
        <span className="animate-bounce">Ready _</span>
      </div>
    </div>
  );
};

export default RetroInterface;

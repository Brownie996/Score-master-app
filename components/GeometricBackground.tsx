
import React from 'react';

export const GeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Static Colorful Geometric Shapes */}
      {/* Circle Top Left */}
      <div className="absolute top-[-5%] left-[-5%] w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-400/10 rotate-12"></div>
      
      {/* Square Middle Right */}
      <div className="absolute top-[30%] right-[-10%] w-48 h-48 bg-pink-500/5 dark:bg-pink-400/10 rotate-45 rounded-3xl"></div>
      
      {/* Triangle Bottom Left */}
      <div 
        className="absolute bottom-[10%] left-[-5%] w-0 h-0 border-l-[100px] border-l-transparent border-b-[150px] border-b-blue-500/5 border-r-[100px] border-r-transparent dark:border-b-blue-400/10 -rotate-12"
      ></div>

      {/* Another Circle Bottom Right */}
      <div className="absolute bottom-[-10%] right-[10%] w-80 h-80 rounded-full bg-amber-500/5 dark:bg-amber-400/10"></div>
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05]" 
        style={{ 
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      ></div>
    </div>
  );
};

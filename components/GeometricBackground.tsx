
import React from 'react';

export const GeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="150" fill="#FF5F6D" />
        <rect x="700" y="100" width="200" height="200" fill="#4facfe" transform="rotate(45 800 200)" />
        <polygon points="400,800 600,800 500,600" fill="#a18cd1" />
        <circle cx="850" cy="850" r="100" fill="#84fab0" />
        <rect x="50" y="600" width="150" height="150" fill="#FFC371" rx="20" />
      </svg>
    </div>
  );
};

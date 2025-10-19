import React from 'react';
import { Sun } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message, showIcon = true }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-6 h-6',
    lg: 'w-10 h-10', 
    xl: 'w-14 h-14'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {showIcon && (
        <div className="relative">
          {/* Spinning outer ring */}
          <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin`}></div>
          
          {/* Solar icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sun className={`${iconSizes[size]} text-amber-500 animate-solar-pulse`} />
          </div>
        </div>
      )}
      
      {message && (
        <div className="text-center">
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
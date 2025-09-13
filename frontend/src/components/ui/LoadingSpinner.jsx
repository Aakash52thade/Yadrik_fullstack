// src/components/ui/LoadingSpinner.jsx - Loading Spinner Component
import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className={`inline-block animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

// Inline loading spinner for buttons or components
export const InlineSpinner = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
  );
};

export default LoadingSpinner;
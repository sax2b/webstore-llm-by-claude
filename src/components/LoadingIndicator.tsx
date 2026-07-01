import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  text?: string;
  fullPage?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text, fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      <Loader2 className="text-[#1E88E5] animate-spin" />
      {text && <p className="text-[#2C2C2C] font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingIndicator;
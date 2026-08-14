import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[300px]", className)}>
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
      <p className="text-text-secondary font-sans text-sm animate-pulse">Loading data...</p>
    </div>
  );
}

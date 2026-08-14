import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-input border bg-surface px-4 py-2 text-[14px] font-medium text-text transition-all duration-200 outline-none",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-text-muted",
            error
              ? "border-semantic-danger focus:ring-2 focus:ring-semantic-danger/20"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-semantic-danger font-medium animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

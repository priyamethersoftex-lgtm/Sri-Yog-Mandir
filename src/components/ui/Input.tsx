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
            "flex h-11 w-full rounded-xl border bg-surface px-4 py-2 text-[14px] font-medium text-primary transition-all duration-200 outline-none",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-secondary/50",
            error
              ? "border-semantic-danger focus:ring-2 focus:ring-semantic-danger/20"
              : "border-theme focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-semantic-danger animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";
    
    const variants = {
      primary: "bg-primary hover:bg-primary-hover text-white shadow-sm focus:ring-primary",
      secondary: "bg-brand-dark hover:bg-opacity-90 text-white shadow-sm focus:ring-brand-dark dark:bg-brand-light dark:text-brand-dark",
      outline: "border border-border-strong text-text hover:bg-surface-muted focus:ring-primary",
      danger: "bg-semantic-danger hover:bg-opacity-90 text-white shadow-sm focus:ring-semantic-danger",
      ghost: "text-text-secondary hover:text-text hover:bg-surface-muted focus:ring-primary",
    };
    
    const sizes = {
      sm: "text-[12px] h-8 px-3",
      md: "text-[13px] h-9 px-4",
      lg: "text-[14px] h-10 px-6",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

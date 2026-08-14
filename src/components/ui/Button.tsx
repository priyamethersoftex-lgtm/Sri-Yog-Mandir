import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-sans font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";
    
    const variants = {
      primary: "bg-gradient-to-r from-brand-500 via-brand-600 to-coral-500 hover:from-brand-600 hover:to-coral-600 text-white shadow-lotus focus:ring-brand-500",
      secondary: "bg-plum-900 hover:bg-plum-800 text-white shadow-plum focus:ring-plum-700 dark:bg-plum-700 dark:hover:bg-plum-600",
      teal: "bg-teal-500 hover:bg-teal-600 text-white shadow-teal focus:ring-teal-500",
      outline: "border border-brand-500/30 text-primary hover:bg-brand-500/10 hover:border-brand-500/60 focus:ring-brand-500",
      danger: "bg-coral-500 hover:bg-coral-600 text-white shadow-md focus:ring-coral-500",
      ghost: "text-secondary hover:text-primary hover:bg-brand-500/10 focus:ring-brand-500",
    };
    
    const sizes = {
      sm: "text-[13px] px-3 py-1.5 rounded-md",
      md: "text-[14px] px-4 py-2",
      lg: "text-[15px] px-6 py-2.5 rounded-xl",
      icon: "p-2",
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

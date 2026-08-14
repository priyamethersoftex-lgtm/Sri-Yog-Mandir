import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'brand' | 'teal' | 'plum' | 'coral';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-bold tracking-wide rounded-full shadow-xs";
  
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-[11px]",
  };

  const variants = {
    default: "bg-plum-500/10 text-plum-600 dark:text-plum-300 border border-plum-500/20",
    success: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25",
    warning: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25",
    danger: "bg-coral-500/10 text-coral-600 dark:text-coral-400 border border-coral-500/25",
    info: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25",
    brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/25",
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25",
    plum: "bg-plum-500/10 text-plum-600 dark:text-plum-300 border border-plum-500/25",
    coral: "bg-coral-500/10 text-coral-600 dark:text-coral-400 border border-coral-500/25",
    outline: "border border-brand-500/30 text-primary",
  };

  return (
    <div className={cn(baseStyles, sizes[size], variants[variant], className)} {...props} />
  );
}

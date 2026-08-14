import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'primary';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold tracking-wide rounded-badge border border-transparent";
  
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  };

  const variants = {
    default: "bg-surface-muted text-text-secondary border-border",
    success: "bg-semantic-success/10 text-semantic-success border-semantic-success/20",
    warning: "bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20",
    danger: "bg-semantic-danger/10 text-semantic-danger border-semantic-danger/20",
    info: "bg-semantic-info/10 text-semantic-info border-semantic-info/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    outline: "border-border-strong text-text",
  };

  return (
    <div className={cn(baseStyles, sizes[size], variants[variant], className)} {...props} />
  );
}

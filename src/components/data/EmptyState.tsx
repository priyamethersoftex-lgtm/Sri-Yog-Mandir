import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px]", className)}>
      <div className="bg-brand-500/10 p-4 rounded-full mb-4 border border-brand-500/20">
        <Icon className="w-8 h-8 text-brand-500" />
      </div>
      <h3 className="text-[16px] font-bold tracking-tight text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-[13px] leading-relaxed text-text-secondary max-w-sm mb-6">{description}</p>
      )}
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
}

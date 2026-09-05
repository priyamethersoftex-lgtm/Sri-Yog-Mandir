import React from 'react';
import { cn } from '../../utils/cn';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  breadcrumbs,
  action,
  children,
  className
}: PageContainerProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto flex flex-col min-h-full space-y-6 animate-fade-in", className)}>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="space-y-1">

          <h1 className="text-[22px] font-sans font-bold text-text tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[13px] leading-relaxed text-text-muted font-medium">{description}</p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}

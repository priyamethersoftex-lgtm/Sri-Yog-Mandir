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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex text-sm text-secondary/70 mb-2">
              {breadcrumbs.map((bc, idx) => (
                <div key={idx} className="flex items-center">
                  {idx > 0 && <span className="mx-2 text-secondary/40">/</span>}
                  {bc.href ? (
                    <a href={bc.href} className="hover:text-brand-500 transition-colors">{bc.label}</a>
                  ) : (
                    <span className="text-primary font-medium">{bc.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}
          <h1 className="text-[32px] sm:text-[36px] font-heading font-bold text-primary tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] text-secondary max-w-2xl">{description}</p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

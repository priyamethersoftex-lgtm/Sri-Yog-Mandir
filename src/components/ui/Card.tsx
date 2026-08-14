import React from 'react';
import { cn } from '../../utils/cn';

const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-8' };

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  variant?: 'default' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', hover = false, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          variant === 'glass' ? 'glass' : '',
          hover && 'cursor-pointer hover:scale-[1.01] hover:shadow-lg',
          paddingMap[padding],
          className
        )}
        style={
          variant === 'default'
            ? {
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-sm)',
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4 mb-4", className)}
      style={{ borderBottom: '1px solid var(--border-default)' }}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[17px] font-bold leading-none tracking-tight", className)}
      style={{ color: 'var(--text-primary)' }}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center pt-4 mt-4", className)} style={{ borderTop: '1px solid var(--border-default)' }} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

import React from 'react';
import { cn } from '../../utils/cn';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'select' | 'textarea';
  options?: { label: string; value: string }[];
  children?: React.ReactNode;
}

export const FormField = React.forwardRef<any, FormFieldProps>(
  ({ label, error, className, as = 'input', options, children, ...props }, ref) => {
    const inputClass = cn(
      "w-full bg-surface border rounded-input px-4 h-10 text-[14px] text-text transition-all duration-200 focus:outline-none focus:ring-2 font-medium",
      error 
        ? "border-semantic-danger focus:ring-semantic-danger/20" 
        : "border-border focus:border-primary focus:ring-primary/20",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted",
      className
    );

    return (
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
        
        {as === 'input' && (
          <input ref={ref} className={inputClass} {...(props as any)} />
        )}
        
        {as === 'textarea' && (
          <textarea ref={ref} className={cn(inputClass, "resize-y min-h-[100px]")} {...(props as any)} />
        )}
        
        {as === 'select' && (
          <select ref={ref} className={cn(inputClass, "appearance-none bg-no-repeat")} style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234A2E56%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '0.65em auto' }} {...(props as any)}>
            {children || options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
        
        {error && (
          <p className="text-[12px] text-semantic-danger font-medium animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

import React from 'react';
import { cn } from '../../utils/cn';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1 border-b border-theme/50 overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium font-sans whitespace-nowrap border-b-2 transition-colors",
            activeTab === tab
              ? "border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
              : "border-transparent text-text-secondary hover:text-text-primary hover:border-brand-500/30"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

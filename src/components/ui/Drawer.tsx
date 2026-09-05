import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, subtitle, children }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex justify-end transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ zIndex: 99998 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out bg-surface border-l border-border ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex-none p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold tracking-tight text-text">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl opacity-70 hover:opacity-100 transition-colors bg-black/5 hover:bg-black/10 cursor-pointer text-text"
            >
              <X size={20} />
            </button>
          </div>
          {subtitle && (
            <p className="text-sm text-text-muted">
              {subtitle}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ scrollbarWidth: 'thin' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

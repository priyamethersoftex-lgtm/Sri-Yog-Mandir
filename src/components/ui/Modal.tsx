import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  noPadding?: boolean;
  dark?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  noPadding = false,
  dark = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 99999 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-full flex items-start sm:items-center justify-center p-4 sm:p-6 text-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 transition-opacity duration-280"
          style={{
            backgroundColor: dark ? 'rgba(0,0,0,0.92)' : 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(6px)',
            opacity: visible ? 1 : 0,
          }}
          onClick={onClose}
        />

        {/* Panel */}
        <div
          className={`relative w-full ${maxWidth} transition-all duration-280 text-left`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {noPadding ? (
            children
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

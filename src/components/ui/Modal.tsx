import { useEffect, useRef, useId } from "react";
import type { HTMLAttributes } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export type BaseModalProps = HTMLAttributes<HTMLDialogElement> & {
  isOpen: boolean;
  onClose: () => void;
  description?: string;
};

export type ModalProps = BaseModalProps &
  (
    | { title: string; ariaLabel?: string }
    | { title?: string; ariaLabel: string }
  );

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  ariaLabel,
  children,
  className = "",
  ...props
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
        
        if (previousFocusRef.current) {
          try {
            previousFocusRef.current.focus();
          } catch {
            // Safe fallback if element is no longer focusable
          }
          previousFocusRef.current = null;
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    // Handle native ESC key
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      aria-label={!title && ariaLabel ? ariaLabel : undefined}
      className={`backdrop:bg-primary/20 backdrop:backdrop-blur-sm bg-surface p-0 rounded-lg shadow-modal border border-border w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 focus:outline-none transition-all ${className}`}
      {...props}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              {title && <h2 id={titleId} className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
              {description && <p id={descId} className="text-sm text-text-muted mt-2">{description}</p>}
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close modal" className="h-8 w-8 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </dialog>
  );
};

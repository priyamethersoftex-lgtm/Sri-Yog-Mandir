import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ImagePreviewModalProps {
  selectedImg: string | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ selectedImg, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (selectedImg) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedImg]);

  if (!mounted && !selectedImg) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 99999 }}
    >
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative max-w-5xl w-auto max-h-[90vh] flex items-center justify-center transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>

        {/* image */}
        <img
          src={selectedImg || ""}
          alt="Preview"
          className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
};

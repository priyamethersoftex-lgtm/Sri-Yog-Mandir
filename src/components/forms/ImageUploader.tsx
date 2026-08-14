import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface ImageUploaderProps {
  value?: string;
  onChange: (base64: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUploader({ value, onChange, onRemove, className }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-theme">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Replace
            </Button>
            {onRemove && (
              <Button type="button" variant="danger" size="sm" onClick={onRemove}>
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-theme rounded-lg flex flex-col items-center justify-center text-text-secondary hover:bg-background hover:text-text-primary cursor-pointer transition-colors"
        >
          <Upload className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium">Click to upload image</p>
          <p className="text-xs mt-1 text-text-secondary">JPG, PNG (max 2MB)</p>
        </div>
      )}
      
      {error && <p className="text-sm text-semantic-danger">{error}</p>}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

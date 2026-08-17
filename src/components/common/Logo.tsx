import React from 'react';
import yogaMandirImage from '../../assets/yogaMandirImage.png';

export interface LogoProps {
  variant?: 'light' | 'dark' | 'colored';
  showSubtitle?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
  imageClassName?: string;
  subtitleClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'colored',
  showSubtitle = true,
  className = '',
  size = 'md',
  title = 'Sri Yoga Mandir',
  subtitle = 'श्री योगा मंदिर',
  imageClassName = '',
  subtitleClassName = '',
}) => {
  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg md:text-xl',
    lg: 'text-xl sm:text-2xl md:text-3xl',
  };

  const subtitleSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px] sm:text-[12px]',
    md: 'text-[11px] sm:text-[14px]',
    lg: 'text-[12px] sm:text-[16px]',
  };

  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-slate-950'
      : 'text-plum-950';

  const subtitleColor =
    variant === 'light' ? 'text-amber-200' : 'text-saffron-500';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* YogaMandir Logo Image */}
      <img
        src={yogaMandirImage}
        alt="Sri Yoga Mandir Logo"
        className={`${iconSizes[size]} object-contain flex-shrink-0 drop-shadow-md transition-transform hover:scale-105 rounded-full ${imageClassName}`}
      />

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center gap-0.5">
        <span
          className={`font-serif font-bold tracking-wide ${titleSizes[size]} ${textColor} whitespace-nowrap leading-tight`}
        >
          {title}
        </span>
        {showSubtitle && subtitle && (
          <span
            className={`font-hindi ${subtitleSizes[size]} ${subtitleColor} font-semibold tracking-widest whitespace-nowrap leading-tight ${subtitleClassName}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;

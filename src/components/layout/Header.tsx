import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, ChevronLeft, ChevronRight, Hotel } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const PAGE_TITLE_MAP: Record<string, string> = {
  'switch-onoff': 'Switch On/Off',
};

function getPageTitle(path: string) {
  const seg = path.replace(/^\//, '').split('/');
  if (!seg[0]) return { section: 'Home', page: 'Dashboard' };

  const sectionName = seg[0].charAt(0).toUpperCase() + seg[0].slice(1);
  let pageName = 'Overview';

  if (seg.length > 1) {
    const lastSeg = seg[seg.length - 1];
    if (seg[1] === 'profile') {
      pageName = 'Profile';
    } else if (PAGE_TITLE_MAP[lastSeg]) {
      pageName = PAGE_TITLE_MAP[lastSeg];
    } else {
      pageName = lastSeg.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }
  }

  return {
    section: sectionName,
    page: pageName === 'List' || pageName === 'Add' || pageName === 'Profile' ? `${sectionName} ${pageName}` : pageName
  };
}

interface HeaderProps {
  isOpen?: boolean;
  onMenuClick: () => void;
  onToggle?: () => void;
}

export default function Header({ onMenuClick, isOpen = true, onToggle }: HeaderProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const theme = isDark ? 'dark' : 'light';
  const { section, page } = getPageTitle(location.pathname);

  return (
    <header 
      className="h-[60px] flex-shrink-0 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 sticky top-0 z-30"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {onToggle && (
          <button
            onClick={onToggle}
            className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 flex-shrink-0"
            style={{ color: 'var(--color-text-secondary)' }}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        )}

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 sm:-ml-2 rounded-xl transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 flex-shrink-0"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Toggle menu"
        >
          <Menu size={19} />
        </button>

        <div 
          className="flex-col justify-center flex-1 min-w-0 pl-2 sm:pl-3"
          style={{ borderLeft: '1px solid var(--color-border)' }}
        >
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] overflow-hidden" style={{ color: 'var(--color-text-muted)' }}>
            <span className="truncate flex-shrink-0">{section}</span>
            {section !== page && (
              <>
                <span className="opacity-40 flex-shrink-0">/</span>
                <span className="truncate" style={{ color: 'var(--color-text-secondary)' }}>{page}</span>
              </>
            )}
          </div>
          <h1 
            className="text-sm font-bold truncate leading-tight sm:mt-0.5"
            style={{ color: 'var(--color-text)' }}
          >
            {page}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={toggleTheme}
          id="theme-toggle-btn"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="relative flex items-center w-10 h-5 rounded-full p-0.5 transition-all duration-300 cursor-pointer mx-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-surface-muted)',
            border: `1px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border-strong)'}`
          }}
        >
          <Sun
            size={10}
            className="absolute left-1 text-amber-500 transition-opacity duration-200"
            style={{ opacity: theme === 'light' ? 1 : 0 }}
          />
          <Moon
            size={10}
            className="absolute right-1 text-indigo-200 transition-opacity duration-200"
            style={{ opacity: theme === 'dark' ? 1 : 0 }}
          />
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300"
            style={{
              backgroundColor: '#ffffff',
              transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)'
            }}
          >
            {theme === 'dark' ? (
              <Moon size={10} style={{ color: '#4f46e5' }} />
            ) : (
              <Sun size={10} style={{ color: '#f59e0b' }} />
            )}
          </span>
        </button>

        <div 
          className="hidden sm:flex items-center gap-2 pl-3 ml-1.5"
          style={{ borderLeft: '1px solid var(--color-border)' }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-primary">
             <Hotel size={14} className="text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold leading-none" style={{ color: 'var(--color-text)' }}>
              Banaras Yog Mandir
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Admin Portal
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

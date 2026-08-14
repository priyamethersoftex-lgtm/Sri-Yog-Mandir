import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* Auto-collapse on narrow screens */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(!e.matches);
    if (mq.matches) setSidebarOpen(false);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />

        <main className="flex-1 overflow-y-auto relative h-[calc(100vh-60px)] custom-scrollbar">
          <div className="p-4 sm:p-5 lg:p-6 xl:p-8 pb-24 w-full h-full max-w-[1920px] mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[50] bg-black/20 dark:bg-black/60 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

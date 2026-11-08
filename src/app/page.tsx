'use client';

import React, { useState, useEffect } from 'react';
import App from '../App';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900/95 flex items-center justify-center select-none">
        <div className="text-white text-center">
          <div className="w-10 h-10 rounded-xl bg-[#E53935] mx-auto flex items-center justify-center font-black text-white text-lg mb-3 shadow-lg animate-pulse">
            S
          </div>
          <div className="text-sm font-bold tracking-tight text-white">ShaQ DIDI</div>
          <div className="text-xs text-slate-400 mt-1">Loading experience...</div>
        </div>
      </div>
    );
  }

  return <App />;
}

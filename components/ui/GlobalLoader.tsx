"use client";

import { useEffect, useState } from "react";

export function GlobalLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Initial static HTML matching the unmounted state to avoid hydration issues
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0b]">
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0b] flex-col transition-all duration-700">
      <div className="relative flex items-center justify-center">
        {/* Spinner ring */}
        <div className="w-16 h-16 border-2 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500 absolute" />
        
        {/* Core dot */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-xs font-black tracking-[0.3em] text-slate-500 uppercase overflow-hidden">
        <span className="block animate-pulse">Initializing</span>
      </div>
    </div>
  );
}

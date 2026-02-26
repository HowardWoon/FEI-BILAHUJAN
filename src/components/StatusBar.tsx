import React from 'react';

interface StatusBarProps {
  theme?: 'light' | 'dark';
}

export default function StatusBar({ theme = 'light' }: StatusBarProps) {
  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  
  return (
    <div className={`flex justify-between items-center px-8 pt-6 pb-2 w-full z-50 ${textColor}`}>
      <span className="text-[15px] font-semibold">9:30</span>
      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[18px]">signal_cellular_4_bar</span>
        <span className="material-symbols-outlined text-[18px]">wifi</span>
        <span className="material-symbols-outlined text-[18px]">battery_full</span>
      </div>
    </div>
  );
}

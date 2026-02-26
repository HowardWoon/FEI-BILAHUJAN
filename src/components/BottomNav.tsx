import React from 'react';

interface BottomNavProps {
  activeTab: 'map' | 'report' | 'alert';
  onTabChange: (tab: 'map' | 'report' | 'alert') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 pt-3 pb-6 flex flex-col z-50">
      <div className="flex justify-between items-center w-full mb-2">
        <button 
          onClick={() => onTabChange('map')}
          className={`flex flex-col flex-1 items-center gap-1 transition-colors ${activeTab === 'map' ? 'text-[#6366F1]' : 'text-slate-400 hover:text-[#6366F1]'}`}
        >
          <span className="material-icons-round text-[26px]">map</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Map</span>
        </button>

        <button 
          onClick={() => onTabChange('report')}
          className={`flex flex-col flex-1 items-center gap-1 transition-colors ${activeTab === 'report' ? 'text-[#ec5b13]' : 'text-slate-400 hover:text-[#ec5b13]'}`}
        >
          <span className="material-icons-round text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Report</span>
        </button>
        
        <button 
          onClick={() => onTabChange('alert')}
          className={`flex flex-col flex-1 items-center gap-1 transition-colors relative ${activeTab === 'alert' ? 'text-[#6366F1]' : 'text-slate-400 hover:text-[#6366F1]'}`}
        >
          <span className="material-icons-round text-[26px]">notifications</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Alert</span>
          {activeTab !== 'alert' && (
            <div className="absolute top-0 right-1/4 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          )}
        </button>
      </div>
      
      <div className="text-center w-full mb-1">
        <p className="text-[8px] text-slate-400 font-medium">Copyright © 2026 FEI. Developed for KitaHack 2026.</p>
      </div>
      
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full"></div>
    </nav>
  );
}

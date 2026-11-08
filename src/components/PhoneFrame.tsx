import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  widthClass?: string;
  minHeightClass?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  widthClass = 'w-[340px] sm:w-[370px]',
  minHeightClass = 'min-h-[640px]',
}) => {
  return (
    <div
      className={`relative ${widthClass} rounded-[3rem] bg-slate-950 p-3.5 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.85)] border-[4px] border-slate-800 ring-1 ring-white/15 mx-auto select-none`}
    >
      {/* Top Dynamic Island with Camera Sensor */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-28 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-blue-950/80" />
        </span>
        <div className="w-10 h-1.5 bg-slate-900 rounded-full" />
      </div>

      {/* Screen Content Wrapper */}
      <div
        className={`rounded-[2.2rem] overflow-hidden bg-white shadow-inner ${minHeightClass} flex flex-col relative border border-slate-100`}
      >
        {/* Subtle Top Status Bar */}
        <div className="w-full pt-1.5 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 select-none shrink-0 z-30">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3 h-3 stroke-[2.2]" />
            <Wifi className="w-3 h-3 stroke-[2.2]" />
            <BatteryMedium className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>

        {/* Child Screen Component */}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

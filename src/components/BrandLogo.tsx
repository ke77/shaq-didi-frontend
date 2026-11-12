import React from 'react';
import { Utensils } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      {/* ShaQ text */}
      <div
        className={`font-black tracking-tight text-[#212121] leading-none ${
          isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
        }`}
      >
        ShaQ
      </div>
      {/* DIDI with fork/spoon in Tomato Red */}
      <div
        className={`font-black tracking-wider text-[#212121] flex items-center leading-none mt-0.5 ${
          isSm ? 'text-sm' : isLg ? 'text-lg' : 'text-base'
        }`}
      >
        <span>D</span>
        <span className="text-[#FF6347] mx-0.5 inline-flex items-center">
          <Utensils className={`shrink-0 ${isSm ? 'w-3 h-3' : isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
        </span>
        <span>D</span>
        <span className="text-[#FF6347] font-black">I</span>
      </div>
    </div>
  );
};

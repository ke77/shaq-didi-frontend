import React from 'react';
import { FoodJointItem } from '../data/foodJoints';
import { MapPin, Star, Clock } from 'lucide-react';

interface FoodCardProps {
  item: FoodJointItem;
  onClick: (item: FoodJointItem) => void;
  compact?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onClick, compact = false }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="group cursor-pointer select-none flex flex-col"
    >
      {/* Food Image Container with default shadow (not on hover) */}
      <div
        className={`relative w-full overflow-hidden bg-slate-100 rounded-2xl shadow-md ${
          compact ? 'aspect-[4/3]' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Subtle glassmorphic tag on image corner */}
        <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-[10px] sm:text-[11px] font-medium text-white flex items-center gap-1 border border-white/15 shadow-xs pointer-events-none">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          <span>4.9</span>
          <span className="text-white/60">·</span>
          <span>15-20 min</span>
        </div>
      </div>

      {/* Card Info matching design with elevated hierarchy */}
      <div className="pt-2.5 pb-1 px-0.5 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-bold text-slate-900 leading-snug truncate group-hover:text-[#E53935] transition-colors ${
              compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
            }`}
            title={item.name}
          >
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-slate-400 font-normal truncate mt-0.5">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <p className={`truncate ${compact ? 'text-[11px]' : 'text-xs'}`}>
            {item.location}
          </p>
        </div>
      </div>
    </div>
  );
};

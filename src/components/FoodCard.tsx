import React from 'react';
import { FoodJointItem } from '../data/foodJoints';

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
        className={`relative w-full overflow-hidden bg-slate-100 rounded-xl shadow-md ${
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
      </div>

      {/* Card Info matching screenshot exactly */}
      <div className="pt-2.5 pb-1 px-0.5 flex flex-col">
        <h3
          className={`font-bold text-slate-800 leading-snug truncate group-hover:text-[#E53935] transition-colors ${
            compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
          }`}
          title={item.name}
        >
          {item.name}
        </h3>
        <p
          className={`text-slate-400 font-normal truncate mt-0.5 ${
            compact ? 'text-[11px]' : 'text-xs'
          }`}
        >
          {item.location}
        </p>
      </div>
    </div>
  );
};

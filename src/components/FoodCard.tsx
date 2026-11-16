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
        className={`relative w-full overflow-hidden bg-[#F4F7FA] rounded-2xl shadow-md ${
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

        {/* Time remaining badge on image corner */}
        {item.prepTime && (
          <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-[#212121]/55 backdrop-blur-md text-[10px] sm:text-[11px] font-medium text-white flex items-center gap-1 border border-white/15 shadow-xs pointer-events-none">
            <Clock className="w-2.5 h-2.5 text-white/90" />
            <span>{item.prepTime}</span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="pt-2.5 pb-1 px-0.5 flex flex-col">
        {/* Row with joint name on the left and rating on the far right */}
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`font-bold text-[#212121] leading-snug truncate min-w-0 flex-1 group-hover:text-[#FF6347] transition-colors ${
              compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base lg:text-xl'
            }`}
            title={item.name}
          >
            {item.name}
          </h3>

          {item.rating > 0 && (
            <div
              className="flex items-center gap-1 shrink-0 text-[#212121] font-semibold tabular-nums"
              title={`Rating: ${item.rating.toFixed(1)} out of 5`}
            >
              <Star className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5 lg:w-4 lg:h-4'} text-[#FFC300] fill-[#FFC300] shrink-0`} />
              <span className={compact ? 'text-[11px]' : 'text-xs lg:text-sm'}>
                {item.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Location row (truncated with ellipsis if too long) */}
        <div className="flex items-center gap-1 text-[#757575] font-normal min-w-0 mt-0.5">
          <MapPin className={`${compact ? 'w-3 h-3' : 'w-3 h-3 lg:w-4 lg:h-4'} text-[#B5B5B5] shrink-0`} />
          <p
            className={`truncate ${compact ? 'text-[11px]' : 'text-xs lg:text-base'}`}
            title={item.location}
          >
            {item.location}
          </p>
        </div>
      </div>
    </div>
  );
};

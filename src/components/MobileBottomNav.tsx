import React from 'react';
import { Home, History, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'profile') => void;
  orderCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  orderCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DEE6EE] py-2.5 px-6 shadow-[0_-4px_25px_rgba(33,33,33,0.06)] lg:hidden">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors active:scale-95 ${
            activeTab === 'home' ? 'text-[#E53935]' : 'text-[#B5B5B5] hover:text-[#757575]'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* Tab 2: Order History */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors active:scale-95 relative ${
            activeTab === 'history' ? 'text-[#E53935]' : 'text-[#B5B5B5] hover:text-[#757575]'
          }`}
        >
          <History className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight">Order History</span>
          {orderCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#FF6347] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {orderCount}
            </span>
          )}
        </button>

        {/* Tab 3: Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors active:scale-95 ${
            activeTab === 'profile' ? 'text-[#E53935]' : 'text-[#B5B5B5] hover:text-[#757575]'
          }`}
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};

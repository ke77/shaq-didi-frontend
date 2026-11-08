import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { FoodCard } from './FoodCard';
import { FOOD_ITEMS, FoodJointItem } from '../data/foodJoints';
import { Search, Bell, Home, History, User } from 'lucide-react';

interface MobileHomeProps {
  onSelectFood: (item: FoodJointItem) => void;
  orderCount: number;
  activeTab: 'home' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'profile') => void;
  onLogout: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

export const MobileHome: React.FC<MobileHomeProps> = ({
  onSelectFood,
  orderCount,
  activeTab,
  onTabChange,
  onLogout,
  onOpenNotifications,
  unreadNotificationCount = 1,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(true);

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.jointName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-white flex flex-col min-h-[640px] select-none relative">
      {/* Top Mobile Bar matching screenshot 2 */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        {/* Brand Logo */}
        <BrandLogo size="sm" />

        {/* Right Action Icons: Search & Notification Bell with green badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="w-9 h-9 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Toggle Search"
          >
            <Search className="w-4 h-4 text-slate-600" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-9 h-9 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {/* Green notification badge matching screenshot */}
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* Greeting matching screenshot */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hi, Isaiah!
          </h1>
          <p className="text-slate-400 font-normal text-xs sm:text-sm mt-0.5">
            Browse food joints and place orders
          </p>
        </div>

        {/* Search Bar on Mobile (Explicitly requested by user) */}
        {showSearchInput && (
          <div className="mb-5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search food joints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#E53935] focus:bg-white focus:ring-1 focus:ring-[#E53935] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2-Column Grid matching screenshot 2 */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} onClick={onSelectFood} compact={true} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            <p>No food joints matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-[#E53935] font-semibold"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar (PWA) matching screenshot 2 exactly */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-6 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {/* Tab 1: Home (active red) */}
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-[#E53935]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* Tab 2: Order History */}
          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
              activeTab === 'history' ? 'text-[#E53935]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-medium">Order History</span>
            {orderCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E53935] text-white text-[9px] font-bold px-1 rounded-full">
                {orderCount}
              </span>
            )}
          </button>

          {/* Tab 3: Profile */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'profile' ? 'text-[#E53935]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

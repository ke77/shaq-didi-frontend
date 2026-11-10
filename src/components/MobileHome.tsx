import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { FoodCard } from './FoodCard';
import { FOOD_ITEMS, FoodJointItem } from '../data/foodJoints';
import { MobileSidebarDrawer } from './MobileSidebarDrawer';
import { Search, Bell, Home, History, User, Menu } from 'lucide-react';

interface MobileHomeProps {
  onSelectFood: (item: FoodJointItem) => void;
  orderCount: number;
  activeTab: 'home' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'profile') => void;
  onLogout: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  onToggleRole?: () => void;
}

const CATEGORIES = ['All', 'Popular', 'Local Dishes', 'Rice & Bowls', 'Grills'] as const;

export const MobileHome: React.FC<MobileHomeProps> = ({
  onSelectFood,
  orderCount,
  activeTab,
  onTabChange,
  onLogout,
  onOpenNotifications,
  unreadNotificationCount = 1,
  onToggleRole,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSearchInput, setShowSearchInput] = useState(true);

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.jointName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-white flex flex-col min-h-[640px] select-none relative">
      {/* Top Mobile Bar matching screenshot 2 */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        {/* Brand Logo */}
        <BrandLogo size="sm" />

        {/* Right Action Icons: Notification Bell first, then Hamburger Menu on the right (borderless) */}
        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {/* Green notification badge matching screenshot */}
              {unreadNotificationCount > 0 && (
                <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              )}
            </button>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
            title="Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-700 stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {/* Greeting matching screenshot without the standby pill */}
        <div className="mb-3.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hi, Isaiah!
          </h1>
          <p className="text-slate-400 font-normal text-xs sm:text-sm mt-0.5">
            Browse food joints and place orders
          </p>
        </div>

        {/* Search Bar on Mobile */}
        {showSearchInput && (
          <div className="mb-3.5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search food joints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#E53935] focus:bg-white focus:ring-1 focus:ring-[#E53935] transition-all"
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

        {/* Horizontal Category Filter Pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 no-scrollbar scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#FFEAE6] text-[#E53935] ring-1 ring-red-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Grid matching screenshot 2 */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} onClick={onSelectFood} compact={true} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            <p className="font-semibold text-slate-600">No food joints match "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 text-[#E53935] font-semibold hover:underline"
            >
              Reset Search & Filter
            </button>
          </div>
        )}
      </div>

      {/* Slide-over Mobile Navigation Drawer matching desktop sidebar */}
      <MobileSidebarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onNavigateTab={onTabChange}
        onOpenNotifications={onOpenNotifications}
        onToggleRole={onToggleRole}
        onLogout={onLogout}
        orderCount={orderCount}
        unreadNotificationCount={unreadNotificationCount}
      />
    </div>
  );
};

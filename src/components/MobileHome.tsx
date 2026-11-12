import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { FoodCard } from './FoodCard';
import { FOOD_ITEMS, FoodJointItem } from '../data/foodJoints';
import { MobileSidebarDrawer } from './MobileSidebarDrawer';
import { UserProfile } from '../types';
import { Search, Bell, Menu, Flame, TrendingUp } from 'lucide-react';

interface MobileHomeProps {
  currentUser: UserProfile;
  onSelectFood: (item: FoodJointItem) => void;
  orderCount: number;
  activeTab: 'home' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'profile') => void;
  onLogout: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  onToggleRole?: () => void;
}

const CATEGORIES = ['All', 'Popular', 'Most Ordered', 'Local Dishes', 'Rice & Bowls', 'Grills'] as const;

export const MobileHome: React.FC<MobileHomeProps> = ({
  currentUser,
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

  const firstName = currentUser.fullName.split(' ')[0] || 'Isaiah';

  const filteredItems = FOOD_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.featuredDish.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.menu.some((m) => m.name.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Popular' && item.isPopular) ||
      (selectedCategory === 'Most Ordered' && item.isMostOrdered) ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const showCategorizedDashboard = selectedCategory === 'All' && !searchQuery.trim();
  const popularJoints = FOOD_ITEMS.filter((item) => item.isPopular);
  const mostOrderedJoints = [...FOOD_ITEMS]
    .filter((item) => item.isMostOrdered)
    .sort((a, b) => b.orderCount - a.orderCount);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen select-none relative">
      {/* Top Mobile Bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[#F4F7FA] sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        <BrandLogo size="sm" />

        {/* Right Action Icons: Borderless Notification Bell first, then Hamburger Menu */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#212121] hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#212121]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6347] ring-2 ring-white"></span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#212121] hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer"
            title="Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#212121] stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        <div className="mb-3.5">
          <h1 className="text-2xl font-bold text-[#212121] tracking-tight">
            Hi, {firstName}!
          </h1>
          <p className="text-[#757575] font-normal text-xs sm:text-sm mt-0.5">
            Select a food joint to view menu and order
          </p>
        </div>

        {/* Search Bar on Mobile */}
        <div className="mb-3.5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#B5B5B5] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search food joints or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#F4F7FA] border border-[#DEE6EE] text-xs sm:text-sm text-[#212121] placeholder:text-[#B5B5B5] focus:outline-none focus:border-[#FF6347] focus:bg-white focus:ring-1 focus:ring-[#FF6347] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-[#757575] hover:text-[#212121]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Filter Pills (Hidden Scrollbar) */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3.5 no-scrollbar scroll-smooth"
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
                  ? 'bg-[#FFEBE7] text-[#E53935] ring-1 ring-[#FF6E6A]/40'
                  : 'bg-[#F4F7FA] text-[#757575] hover:bg-[#DEE6EE]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Categorized Sections: Popular & Most Ordered (PS Story 3) */}
        {showCategorizedDashboard ? (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#FF6347]" />
                  <h2 className="text-sm font-bold text-[#212121] tracking-tight">Popular</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Popular')}
                  className="text-[11px] font-semibold text-[#E53935]"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {popularJoints.map((item) => (
                  <FoodCard key={item.id} item={item} onClick={onSelectFood} compact={true} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#FFA500]" />
                  <h2 className="text-sm font-bold text-[#212121] tracking-tight">Most Ordered</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Most Ordered')}
                  className="text-[11px] font-semibold text-[#E53935]"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {mostOrderedJoints.map((item) => (
                  <FoodCard key={`mo-${item.id}`} item={item} onClick={onSelectFood} compact={true} />
                ))}
              </div>
            </section>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} onClick={onSelectFood} compact={true} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#757575] text-xs">
            <p className="font-semibold text-[#212121]">No food joints match "{searchQuery}"</p>
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

      {/* Slide-over Mobile Navigation Drawer */}
      <MobileSidebarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
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

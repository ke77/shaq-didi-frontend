import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { FoodCard } from './FoodCard';
import { FOOD_ITEMS, FoodJointItem } from '../data/foodJoints';
import { PWAInstallButton } from './PWAInstallButton';
import { UserProfile } from '../types';
import { Home, History, LogOut, Search, Bell, CheckCircle2, Utensils, Flame, TrendingUp } from 'lucide-react';

interface DesktopHomeProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onSelectFood: (item: FoodJointItem) => void;
  orderCount: number;
  activeNavTab: 'home' | 'history' | 'notifications';
  onNavTabChange: (tab: 'home' | 'history' | 'notifications') => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  onToggleRole?: () => void;
}

const CATEGORIES = ['All', 'Popular', 'Most Ordered', 'Local Dishes', 'Rice & Bowls', 'Grills'] as const;

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'IA';

export const DesktopHome: React.FC<DesktopHomeProps> = ({
  currentUser,
  onLogout,
  onSelectFood,
  orderCount,
  activeNavTab,
  onNavTabChange,
  onOpenNotifications,
  unreadNotificationCount = 0,
  onToggleRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showNotifications, setShowNotifications] = useState(false);

  const firstName = currentUser.fullName.split(' ')[0] || 'Isaiah';
  const initials = getInitials(currentUser.fullName);

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
    <div className="w-full bg-white flex min-h-screen text-[#212121] select-none">
      {/* Left Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#DEE6EE] flex flex-col justify-between p-6 bg-white">
        <div>
          {/* Logo at top */}
          <div className="mb-10 pl-1">
            <BrandLogo size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => onNavTabChange('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNavTab === 'home'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => onNavTabChange('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNavTab === 'history'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Order History</span>
              {orderCount > 0 && (
                <span className="ml-auto bg-[#FF6347] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                  {orderCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenNotifications ? onOpenNotifications() : onNavTabChange('notifications')
              }
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNavTab === 'notifications'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="ml-auto bg-[#FFA500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBE7]/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </nav>

          {/* In-App Role Switcher */}
          {onToggleRole && (
            <div className="mt-8 pt-4 border-t border-[#DEE6EE]">
              <button
                type="button"
                onClick={onToggleRole}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBE7]/50 border border-dashed border-[#CDD5E1] transition-all cursor-pointer"
              >
                <span>NSP Dispatch View</span>
                <span className="text-[10px] text-[#B5B5B5] font-normal">Switch →</span>
              </button>
            </div>
          )}
        </div>

        {/* PWA Install prompt in Sidebar */}
        <div className="pt-4 border-t border-[#DEE6EE]">
          <PWAInstallButton variant="sidebar" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header / Breadcrumbs Bar */}
        <header className="h-16 border-b border-[#DEE6EE] px-8 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#E53935]">Home</span>
            <span className="text-[#CDD5E1] font-light text-xs">/</span>
            <span className="text-xs text-[#757575] font-medium">Haatso Station Joint Dispatch</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] rounded-full transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6347] border-2 border-white rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#DEE6EE] p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-bold text-[#212121] pb-2 border-b border-[#DEE6EE] flex items-center justify-between">
                    <span>Notifications</span>
                    <span className="text-[10px] text-[#DB8F05] font-semibold">
                      {unreadNotificationCount} unread
                    </span>
                  </div>
                  <div className="space-y-2 mt-2 text-xs">
                    <div className="p-2 rounded-lg bg-[#F4F7FA] border border-[#DEE6EE] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6347] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#212121]">Dispatch Personnel Ready</p>
                        <p className="text-[11px] text-[#757575]">
                          Haatso Station NSP team is coordinating staff orders.
                        </p>
                      </div>
                    </div>
                  </div>
                  {onOpenNotifications && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        onOpenNotifications();
                      }}
                      className="w-full mt-2.5 pt-2 border-t border-[#DEE6EE] text-center text-xs font-semibold text-[#E53935] hover:text-[#FF6347] cursor-pointer block"
                    >
                      View All Notifications →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar Badge */}
            <div
              className="w-8 h-8 rounded-full bg-[#FF6E6A] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-[#FFEBE7] transition-all"
              title={`${currentUser.fullName} (Permanent Staff)`}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Greeting Banner */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#212121] tracking-tight">
              Hi, {firstName}!
            </h1>
            <p className="text-[#757575] font-normal text-sm md:text-base mt-1">
              Select a food joint to view its menu and place an order
            </p>
          </div>

          {/* Search Bar + Category Filter Buttons */}
          <div className="mb-8 space-y-4">
            <div className="max-w-md">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#B5B5B5] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search food joints, dishes, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F7FA] border border-[#DEE6EE] text-sm text-[#212121] placeholder:text-[#B5B5B5] focus:outline-none focus:border-[#FF6347] focus:bg-white focus:ring-1 focus:ring-[#FF6347] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs text-[#757575] hover:text-[#212121] cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Buttons (Popular, Most Ordered, etc.) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#FFEBE7] text-[#E53935] ring-1 ring-[#FF6E6A]/40'
                      : 'bg-[#F4F7FA] hover:bg-[#DEE6EE]/60 text-[#757575] hover:text-[#212121]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Categorized Dashboard Sections: Popular & Most Ordered (PS Story 3) */}
          {showCategorizedDashboard ? (
            <div className="space-y-10">
              {/* Section 1: Popular Food Joints */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF6347]" />
                    <h2 className="text-lg font-bold text-[#212121] tracking-tight">Popular</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('Popular')}
                    className="text-xs font-semibold text-[#E53935] hover:text-[#FF6347] cursor-pointer"
                  >
                    See all
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularJoints.map((item) => (
                    <FoodCard key={item.id} item={item} onClick={onSelectFood} />
                  ))}
                </div>
              </section>

              {/* Section 2: Most Ordered Food Joints */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#FFA500]" />
                    <h2 className="text-lg font-bold text-[#212121] tracking-tight">Most Ordered</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('Most Ordered')}
                    className="text-xs font-semibold text-[#E53935] hover:text-[#FF6347] cursor-pointer"
                  >
                    See all
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mostOrderedJoints.map((item) => (
                    <FoodCard key={`mo-${item.id}`} item={item} onClick={onSelectFood} />
                  ))}
                </div>
              </section>
            </div>
          ) : filteredItems.length > 0 ? (
            <div>
              <h2 className="text-lg font-bold text-[#212121] tracking-tight mb-4">
                {searchQuery.trim() ? `Results for "${searchQuery}"` : selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <FoodCard key={item.id} item={item} onClick={onSelectFood} />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-[#757575]">
              <div className="w-12 h-12 rounded-full bg-[#F4F7FA] flex items-center justify-center mx-auto mb-3 text-[#B5B5B5]">
                <Utensils className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-semibold text-[#212121]">No food joints match your filter.</p>
              <p className="text-xs text-[#757575] mt-1">Try searching for Daavi, Jollof, or reset your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs text-[#E53935] font-semibold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

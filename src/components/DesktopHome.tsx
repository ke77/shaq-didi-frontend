import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { FoodCard } from './FoodCard';
import { FOOD_ITEMS, FoodJointItem } from '../data/foodJoints';
import { PWAInstallButton } from './PWAInstallButton';
import { Home, History, LogOut, Search, Bell, CheckCircle2 } from 'lucide-react';

interface DesktopHomeProps {
  onLogout: () => void;
  onSelectFood: (item: FoodJointItem) => void;
  orderCount: number;
  activeNavTab: 'home' | 'history' | 'notifications';
  onNavTabChange: (tab: 'home' | 'history' | 'notifications') => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

export const DesktopHome: React.FC<DesktopHomeProps> = ({
  onLogout,
  onSelectFood,
  orderCount,
  activeNavTab,
  onNavTabChange,
  onOpenNotifications,
  unreadNotificationCount = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

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
    <div className="w-full bg-white flex min-h-[680px] text-slate-800 select-none">
      {/* Left Sidebar matching screenshot 1 (PS_Home) */}
      <aside className="w-56 shrink-0 border-r border-slate-100 flex flex-col justify-between p-6">
        <div>
          {/* Logo at top */}
          <div className="mb-10 pl-1">
            <BrandLogo size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => onNavTabChange('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeNavTab === 'home'
                  ? 'bg-red-50 text-[#E53935]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => onNavTabChange('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeNavTab === 'history'
                  ? 'bg-red-50 text-[#E53935]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Order History</span>
              {orderCount > 0 && (
                <span className="ml-auto bg-[#E53935] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {orderCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenNotifications ? onOpenNotifications() : onNavTabChange('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeNavTab === 'notifications'
                  ? 'bg-red-50 text-[#E53935]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* PWA Install prompt in Sidebar */}
        <div className="pt-4 border-t border-slate-100">
          <PWAInstallButton variant="sidebar" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Breadcrumbs Bar */}
        <header className="h-16 border-b border-slate-100 px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-[#E53935]">
            {activeNavTab === 'home' ? 'Home' : 'Order History'}
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200/80 p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Notifications</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Live
                    </span>
                  </div>
                  <div className="space-y-2 mt-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800">Dispatch Personnel Assigned</p>
                        <p className="text-[11px] text-slate-500">Haatso Station personnel is coordinating orders.</p>
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
                      className="w-full mt-2.5 pt-2 border-t border-slate-100 text-center text-xs font-semibold text-[#E53935] hover:text-[#d32f2f] cursor-pointer block"
                    >
                      View All Notifications →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar Badge "IA" (Isaiah) matching screenshot */}
            <div
              className="w-8 h-8 rounded-full bg-[#E53935] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-red-300 transition-all"
              title="Isaiah (Permanent Staff)"
            >
              IA
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Hi, Isaiah!
            </h1>
            <p className="text-slate-400 font-normal text-sm md:text-base mt-1">
              Browse food joints and place orders
            </p>
          </div>

          {/* Search Bar matching screenshot */}
          <div className="mb-8 max-w-sm">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100/70 border border-slate-200/60 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#E53935] focus:bg-white focus:ring-1 focus:ring-[#E53935] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 3-Column Food Grid matching screenshot */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} onClick={onSelectFood} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No food joints found matching "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-[#E53935] font-semibold hover:underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

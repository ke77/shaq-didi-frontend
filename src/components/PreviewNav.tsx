import React from 'react';
import {
  Smartphone,
  Monitor,
  Columns,
  Eye,
  LogIn,
  UserPlus,
  Home as HomeIcon,
  UtensilsCrossed,
  Clock,
  Truck,
  User,
  Bell,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ViewMode = 'responsive' | 'desktop' | 'mobile' | 'side-by-side';

export type ActiveAppScreen =
  | 'home'
  | 'signin'
  | 'signup'
  | 'order-info'
  | 'order-history-ps'
  | 'order-history-nsp'
  | 'profile'
  | 'notifications';

interface PreviewNavProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  activeScreen: ActiveAppScreen;
  onScreenChange: (screen: ActiveAppScreen) => void;
  unreadNotificationCount?: number;
}

export const PreviewNav: React.FC<PreviewNavProps> = ({
  currentMode,
  onModeChange,
  activeScreen,
  onScreenChange,
  unreadNotificationCount = 0,
}) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2.5 sticky top-0 z-40 select-none shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Wordmark & Active Screen */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#E53935] flex items-center justify-center font-black text-white text-xs">
            S
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            ShaQ DIDI
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-700 pl-2">
            {activeScreen === 'home'
              ? 'Homepage (PS_Home)'
              : activeScreen === 'signin'
              ? 'User Sign In'
              : activeScreen === 'signup'
              ? 'Sign Up & Onboarding'
              : activeScreen === 'order-info'
              ? 'Order Info (Personnel Dispatch)'
              : activeScreen === 'order-history-ps'
              ? 'PS Order History'
              : activeScreen === 'order-history-nsp'
              ? 'NSP Assigned Orders'
              : activeScreen === 'notifications'
              ? 'Notifications'
              : 'User Profile'}
          </span>
        </div>

        {/* Screen Switcher: Home / Sign In / Sign Up */}
        <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onScreenChange('home')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'home'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('signin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'signin'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('signup')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'signup'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('order-info')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'order-info'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Order Info</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('order-history-ps')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'order-history-ps'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Permanent Staff Order History"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">PS History</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('order-history-nsp')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'order-history-nsp'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="National Service Personnel Assigned Orders"
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">NSP Orders</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('profile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeScreen === 'profile'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Profile"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Profile</span>
          </button>

          <button
            type="button"
            onClick={() => onScreenChange('notifications')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer relative ${
              activeScreen === 'notifications'
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Right side: Viewport Controls & PWA Install Button */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button in Header */}
          <PWAInstallButton variant="header" />

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
            <button
              type="button"
              onClick={() => onModeChange('responsive')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                currentMode === 'responsive'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Auto responsive based on screen size"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Responsive</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                currentMode === 'desktop'
                  ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                currentMode === 'mobile'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Mobile PWA View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile PWA</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('side-by-side')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                currentMode === 'side-by-side'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Mockup Side-by-Side (Desktop + Mobile Services)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Side-by-Side</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

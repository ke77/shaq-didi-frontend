'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Home,
  History,
  Bell,
  LogOut,
  User,
  ArrowLeftRight,
  X,
  ChevronRight,
  UtensilsCrossed,
} from 'lucide-react';

export interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'home' | 'history' | 'profile';
  onNavigateTab: (tab: 'home' | 'history' | 'profile') => void;
  onOpenNotifications?: () => void;
  onToggleRole?: () => void;
  onLogout: () => void;
  orderCount?: number;
  unreadNotificationCount?: number;
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigateTab,
  onOpenNotifications,
  onToggleRole,
  onLogout,
  orderCount = 0,
  unreadNotificationCount = 0,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative ml-auto w-[85%] max-w-xs h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Mini Card */}
            <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-100">
              <div
                onClick={() => {
                  onNavigateTab('profile');
                  onClose();
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5745] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs shrink-0 group-hover:ring-2 group-hover:ring-red-200 transition-all">
                  IA
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#E53935] transition-colors">
                    Isaiah Amoh Mensah
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">isaiaham@gmail.com</p>
                  <span className="inline-block mt-0.5 text-[9px] font-semibold text-[#E53935] bg-red-50 px-1.5 py-0.2 rounded">
                    Permanent Staff
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>

            {/* Navigation Links matching Desktop Sidebar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              <p className="px-3 pt-1 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Menu
              </p>

              {/* 1. Home */}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab('home');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-red-50 text-[#E53935] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Home</span>
              </button>

              {/* 2. Order History */}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab('history');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-red-50 text-[#E53935] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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

              {/* 3. Notifications */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenNotifications) onOpenNotifications();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* 4. Profile */}
              <button
                type="button"
                onClick={() => {
                  onNavigateTab('profile');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-red-50 text-[#E53935] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>

              {/* 5. Switch to NSP View */}
              {onToggleRole && (
                <div className="pt-3 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleRole();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#E53935] bg-slate-50 hover:bg-red-50/50 border border-dashed border-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#E53935]" />
                      <span>NSP Dispatch View</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Switch →</span>
                  </button>
                </div>
              )}

              {/* 6. Logout */}
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>

            {/* Drawer Footer with PWA Install */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <PWAInstallButton variant="sidebar" />
              <p className="text-[10px] text-center text-slate-400 font-medium">
                ShaQ DIDI · Haatso Station Dispatch
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

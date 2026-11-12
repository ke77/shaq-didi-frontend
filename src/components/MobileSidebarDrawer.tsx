'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { UserProfile } from '../types';
import {
  Home,
  History,
  Bell,
  LogOut,
  User,
  ArrowLeftRight,
  X,
  ChevronRight,
} from 'lucide-react';

export interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activeTab: 'home' | 'history' | 'profile';
  onNavigateTab: (tab: 'home' | 'history' | 'profile') => void;
  onOpenNotifications?: () => void;
  onToggleRole?: () => void;
  onLogout: () => void;
  orderCount?: number;
  unreadNotificationCount?: number;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'IA';

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeTab,
  onNavigateTab,
  onOpenNotifications,
  onToggleRole,
  onLogout,
  orderCount = 0,
  unreadNotificationCount = 0,
}) => {
  const initials = getInitials(currentUser.fullName);

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
            className="fixed inset-0 bg-[#212121]/50 backdrop-blur-xs"
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
            <div className="p-5 border-b border-[#DEE6EE] flex items-center justify-between">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#DEE6EE] flex items-center justify-center text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
                title="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Mini Card */}
            <div className="px-5 py-4 bg-[#F4F7FA] border-b border-[#DEE6EE]">
              <div
                onClick={() => {
                  onNavigateTab('profile');
                  onClose();
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF6E6A] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs shrink-0 group-hover:ring-2 group-hover:ring-[#FFEBE7] transition-all">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#212121] truncate group-hover:text-[#FF6347] transition-colors">
                    {currentUser.fullName}
                  </h4>
                  <p className="text-[11px] text-[#757575] truncate">{currentUser.email}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#E53935]">
                    {currentUser.role === 'NSP' ? 'National Service Personnel' : 'Permanent Staff'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#B5B5B5] group-hover:text-[#212121] transition-colors shrink-0" />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              <p className="px-3 pt-1 pb-1 text-[10px] font-bold tracking-wider text-[#B5B5B5] uppercase">
                Menu
              </p>

              <button
                type="button"
                onClick={() => {
                  onNavigateTab('home');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-[#FFEBE7] text-[#E53935]'
                    : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateTab('history');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'history'
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
                onClick={() => {
                  if (onOpenNotifications) onOpenNotifications();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] transition-all cursor-pointer"
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
                onClick={() => {
                  onNavigateTab('profile');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#FFEBE7] text-[#E53935]'
                    : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>

              {onToggleRole && (
                <div className="pt-3 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleRole();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#757575] hover:text-[#E53935] bg-[#F4F7FA] hover:bg-[#FFEBE7]/50 border border-dashed border-[#CDD5E1] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF6347]" />
                      <span>NSP Dispatch View</span>
                    </div>
                    <span className="text-[10px] text-[#B5B5B5]">Switch →</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBE7]/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>

            <div className="p-4 border-t border-[#DEE6EE] bg-[#F4F7FA]/60 space-y-3">
              <PWAInstallButton variant="sidebar" />
              <p className="text-[10px] text-center text-[#B5B5B5] font-medium">
                ShaQ DIDI · Haatso Station Dispatch
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

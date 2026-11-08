'use client';

import React, { useState } from 'react';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { AppNotification } from '../data/notifications';
import { BrandLogo } from './BrandLogo';
import { Home, History, LogOut } from 'lucide-react';

interface NotificationViewProps {
  notifications: AppNotification[];
  onBack?: () => void;
  onGoHome?: () => void;
  onGoOrderHistory?: () => void;
  onLogout?: () => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onNotificationClick?: (notif: AppNotification) => void;
  isStandaloneScreen?: boolean;
}

export const NotificationView: React.FC<NotificationViewProps> = ({
  notifications,
  onBack,
  onGoHome,
  onGoOrderHistory,
  onLogout,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  isStandaloneScreen = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'orders'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'orders') return n.type === 'order_assigned' || n.type === 'order_completed';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`w-full flex flex-col items-center select-none ${isStandaloneScreen ? 'py-4' : ''}`}>
      {/* Page Title Label matching mobile mockup canvas style */}
      <div className="w-full max-w-[380px] sm:max-w-[400px] mb-2 px-2 flex items-center justify-between">
        <h2 className="text-xl font-medium text-slate-400 tracking-tight">Notification</h2>
        {unreadCount > 0 && (
          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Main Mobile Card matching image_937fe657.png */}
      <div className="w-full max-w-[380px] sm:max-w-[400px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col min-h-[640px] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Section */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Circular Back Button matching screenshot */}
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer border border-slate-100"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notification</h1>
          </div>

          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] text-[#E53935] hover:text-[#d32f2f] font-semibold cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List matching image_937fe657.png */}
        <div className="flex-1 px-5 pt-1 pb-4 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                <Bell className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
              <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                You're all caught up! Order updates and personnel assignments will show up here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick && onNotificationClick(notif)}
                className={`bg-[#F8F9FA] rounded-2xl p-4 border transition-all cursor-pointer relative ${
                  notif.read ? 'border-slate-100' : 'border-slate-200/90 shadow-2xs ring-1 ring-emerald-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Bell Icon matching screenshot */}
                  <div className="shrink-0 mt-0.5">
                    <Bell className="w-5 h-5 text-slate-500 stroke-[1.8]" />
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-tight">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Unread" />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                      {notif.message}
                    </p>

                    <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                      {notif.date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Screen Indicator Bar matching smartphone UI */}
        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-auto mb-2 shrink-0" />
      </div>
    </div>
  );
};

export const DesktopNotificationView: React.FC<NotificationViewProps> = ({
  notifications,
  onGoHome,
  onGoOrderHistory,
  onLogout,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'orders'>('all');
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'orders') return n.type === 'order_assigned' || n.type === 'order_completed';
    return true;
  });

  return (
    <div className="w-full bg-white flex min-h-[660px] text-slate-800 select-none rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50">
      {/* Left Sidebar matching PS_Home & Order History */}
      <aside className="w-56 shrink-0 border-r border-slate-100 flex flex-col justify-between p-6 bg-white">
        <div>
          {/* Logo at top */}
          <div className="mb-10 pl-1">
            <BrandLogo size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              type="button"
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={onGoOrderHistory}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Order History</span>
            </button>

            {/* Active Notification Tab */}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-[#FFEAE6] text-[#E53935] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-[#E53935] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header matching desktop theme */}
        <header className="h-16 border-b border-slate-100 px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-[#E53935]">Notifications</div>

          <div className="flex items-center gap-4">
            {/* Bell Icon with badge */}
            <div className="relative p-2 text-[#E53935] bg-red-50/80 rounded-full">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Profile Avatar Badge "IA" matching screenshot */}
            <div className="w-9 h-9 rounded-full bg-[#E55934] text-white font-semibold text-sm flex items-center justify-center shadow-xs">
              IA
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 flex-1 flex flex-col overflow-y-auto">
          {/* Header Title & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                All Notifications
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Stay updated on your food deliveries, personnel assignments, and order milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && onMarkAllAsRead && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}

              {notifications.length > 0 && onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills matching PS_Home / History tabs */}
          <div className="flex items-center gap-2 pt-5 pb-4">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('orders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'orders'
                  ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Orders ({notifications.filter((n) => n.type.includes('order')).length})
            </button>
          </div>

          {/* List of Notification cards */}
          <div className="space-y-3.5 flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                  <Bell className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-slate-800">You're all caught up!</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  There are no notifications in this category. You will receive updates when new orders are placed or assigned.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick && onNotificationClick(notif)}
                  className={`bg-[#F8F9FA] hover:bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                    notif.read
                      ? 'border-slate-100 hover:border-slate-300/80 hover:shadow-xs'
                      : 'border-slate-200 bg-[#FCFDFD] shadow-xs ring-1 ring-emerald-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Bell Icon in soft circular accent */}
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 group-hover:text-[#E53935] group-hover:border-red-200 transition-colors shrink-0 shadow-xs">
                      <Bell className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1 max-w-2xl">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                        <span>{notif.date}</span>
                        {notif.orderId && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 font-semibold">{notif.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="shrink-0 flex items-center gap-2 self-center">
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#E53935] group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

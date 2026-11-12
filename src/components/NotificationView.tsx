'use client';

import React, { useState } from 'react';
import { ArrowLeft, Bell, CheckCheck, Trash2, ArrowRight, Home, History, LogOut } from 'lucide-react';
import { AppNotification } from '../data/notifications';
import { BrandLogo } from './BrandLogo';
import { UserProfile } from '../types';

interface NotificationViewProps {
  currentUser?: UserProfile;
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

const getInitials = (name?: string) =>
  (name || 'Isaiah Amoh Mensah')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'IA';

export const NotificationView: React.FC<NotificationViewProps> = ({
  notifications,
  onBack,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none relative">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col px-4 pt-4 pb-12">
        <div className="pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#212121] shadow-sm hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer border border-[#DEE6EE]"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5 text-[#212121] stroke-[2.5]" />
              </button>
            )}
            <h1 className="text-xl font-bold text-[#212121] tracking-tight">Notification</h1>
          </div>

          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] text-[#E53935] hover:text-[#FF6347] font-semibold cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="flex-1 pt-1 pb-4 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F4F7FA] flex items-center justify-center text-[#B5B5B5] mb-3">
                <Bell className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-[#212121]">No Notifications</h3>
              <p className="text-xs text-[#757575] max-w-[200px] mt-1">
                You're all caught up! Order updates and personnel assignments will show up here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick && onNotificationClick(notif)}
                className={`bg-[#F4F7FA] rounded-2xl p-4 border transition-all cursor-pointer relative ${
                  notif.read ? 'border-[#DEE6EE]' : 'border-[#FF6E6A]/50 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <Bell className="w-5 h-5 text-[#757575] stroke-[1.8]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#212121] tracking-tight leading-tight">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6347] shrink-0" title="Unread" />
                      )}
                    </div>

                    <p className="text-xs text-[#757575] leading-relaxed mt-0.5">
                      {notif.message}
                    </p>

                    <p className="text-[11px] text-[#B5B5B5] font-medium mt-1.5">
                      {notif.date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const DesktopNotificationView: React.FC<NotificationViewProps> = ({
  currentUser,
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
  const initials = getInitials(currentUser?.fullName);

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'orders') return n.type === 'order_assigned' || n.type === 'order_completed';
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-white flex text-[#212121] select-none">
      {/* Left Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#DEE6EE] flex flex-col justify-between p-6 bg-white">
        <div>
          <div className="mb-10 pl-1">
            <BrandLogo size="md" />
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={onGoOrderHistory}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Order History</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#FFEBE7] text-[#E53935] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-[#FFA500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBE7]/60 transition-colors cursor-pointer"
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
        <header className="h-16 border-b border-[#DEE6EE] px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-[#E53935]">Notifications</div>

          <div className="flex items-center gap-4">
            <div className="relative p-2 text-[#E53935] bg-[#FFEBE7] rounded-full">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6347] border-2 border-white rounded-full" />
              )}
            </div>

            <div className="w-9 h-9 rounded-full bg-[#FF6E6A] text-white font-semibold text-sm flex items-center justify-center shadow-xs">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#DEE6EE]">
            <div>
              <h2 className="text-2xl font-bold text-[#212121] tracking-tight">
                All Notifications
              </h2>
              <p className="text-xs text-[#757575] mt-1">
                Stay updated on your food deliveries, personnel assignments, and order milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && onMarkAllAsRead && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#212121] bg-[#F4F7FA] hover:bg-[#DEE6EE]/60 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}

              {notifications.length > 0 && onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E53935] bg-[#FFEBE7] hover:bg-[#FF6E6A]/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-5 pb-4">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] bg-[#F4F7FA] hover:bg-[#DEE6EE]/60'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] bg-[#F4F7FA] hover:bg-[#DEE6EE]/60'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('orders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'orders'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] bg-[#F4F7FA] hover:bg-[#DEE6EE]/60'
              }`}
            >
              Orders ({notifications.filter((n) => n.type.includes('order')).length})
            </button>
          </div>

          <div className="space-y-3.5 flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F4F7FA] flex items-center justify-center text-[#B5B5B5] mb-3">
                  <Bell className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-[#212121]">You're all caught up!</h3>
                <p className="text-xs text-[#757575] max-w-sm mt-1">
                  There are no notifications in this category. You will receive updates when new orders are placed or assigned.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick && onNotificationClick(notif)}
                  className={`bg-[#F4F7FA] hover:bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                    notif.read
                      ? 'border-[#DEE6EE] hover:border-[#CDD5E1]'
                      : 'border-[#FF6E6A]/50 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#DEE6EE] flex items-center justify-center text-[#757575] group-hover:text-[#FF6347] group-hover:border-[#FF6E6A]/50 transition-colors shrink-0 shadow-xs">
                      <Bell className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-bold text-[#212121] tracking-tight">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEBE7] text-[#E53935]">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[#757575] leading-relaxed mt-1 max-w-2xl">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-[#B5B5B5] font-medium">
                        <span>{notif.date}</span>
                        {notif.orderId && (
                          <>
                            <span>•</span>
                            <span className="text-[#757575] font-semibold">{notif.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

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

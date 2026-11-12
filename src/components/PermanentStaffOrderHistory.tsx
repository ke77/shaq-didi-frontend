import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EmptyClipboardGraphic } from './EmptyClipboardGraphic';
import { FoodJointItem } from '../data/foodJoints';
import { OrderRecord } from './OrderHistoryView';
import { UserProfile } from '../types';
import { Home, History, LogOut, Bell, MapPin, CheckCircle2, Clock } from 'lucide-react';

interface PermanentStaffOrderHistoryProps {
  currentUser: UserProfile;
  orders: OrderRecord[];
  onGoHome: () => void;
  onLogout: () => void;
  onReorder?: (item: FoodJointItem) => void;
  onCancelOrder?: (orderId: string) => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'IA';

export const PermanentStaffOrderHistory: React.FC<PermanentStaffOrderHistoryProps> = ({
  currentUser,
  orders,
  onGoHome,
  onLogout,
  onReorder,
  onCancelOrder,
  onOpenNotifications,
  unreadNotificationCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');
  const [showNotifications, setShowNotifications] = useState(false);

  const initials = getInitials(currentUser.fullName);

  // Pending = current active orders; Completed = previous orders
  const currentOrders = orders.filter((o) => o.status === 'Pending');
  const previousOrders = orders.filter((o) => o.status === 'Completed');

  const displayedOrders = activeTab === 'current' ? currentOrders : previousOrders;

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
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#FFEBE7] text-[#E53935] transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Order History</span>
            </button>

            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="ml-auto bg-[#FFA500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBE7]/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 border-b border-[#DEE6EE] px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-[#E53935]">
            Order History
          </div>

          <div className="flex items-center gap-4">
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
                        <p className="font-semibold text-[#212121]">Dispatch Update</p>
                        <p className="text-[11px] text-[#757575]">Haatso Station personnel is on duty.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="w-8 h-8 rounded-full bg-[#FF6E6A] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-[#FFEBE7] transition-all"
              title={`${currentUser.fullName} (Permanent Staff)`}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 flex flex-col">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('current')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'current'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
              }`}
            >
              Pending Orders ({currentOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('previous')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'previous'
                  ? 'bg-[#FFEBE7] text-[#E53935]'
                  : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
              }`}
            >
              Previous Orders ({previousOrders.length})
            </button>
          </div>

          {displayedOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center my-auto animate-in fade-in duration-150">
              <EmptyClipboardGraphic className="w-48 h-48 mb-3" />

              <p className="text-xs sm:text-sm text-[#757575] leading-relaxed font-normal mb-4">
                You have no {activeTab === 'current' ? 'pending' : 'previous'} orders.{' '}
                <button
                  onClick={onGoHome}
                  className="font-bold text-[#212121] hover:text-[#FF6347] cursor-pointer inline transition-colors"
                >
                  Go Home
                </button>
                <br />
                and make an Order
              </p>

              <button
                type="button"
                onClick={onGoHome}
                className="px-6 py-2.5 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Go Home
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-4 border border-[#DEE6EE] shadow-xs hover:border-[#CDD5E1] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <img
                      src={order.item.image}
                      alt={order.item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-[#F4F7FA] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#212121] text-sm">{order.item.name}</h4>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            order.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#FFA500]/15 text-[#DB8F05] border border-[#FFA500]/30'
                          }`}
                        >
                          {order.status === 'Completed' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {order.status}
                        </span>
                      </div>

                      {order.menuItemName && (
                        <p className="text-xs font-medium text-[#212121] mt-0.5">
                          {order.menuItemName}
                        </p>
                      )}

                      <div className="text-xs text-[#757575] flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#B5B5B5]" />
                          {order.item.location}
                        </span>
                        {order.amount && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-[#212121] tabular-nums">
                              GH₵ {order.amount}
                            </span>
                          </>
                        )}
                        {order.personnel && (
                          <>
                            <span>·</span>
                            <span className="text-[#E53935] font-medium">
                              Personnel: {order.personnel.split(' (')[0]}
                            </span>
                          </>
                        )}
                        <span>·</span>
                        <span>{order.date}</span>
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-[#757575] italic mt-1.5 bg-[#F4F7FA] px-2.5 py-1 rounded">
                          "{order.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DEE6EE] shrink-0">
                    {order.status === 'Completed' && onReorder && (
                      <button
                        type="button"
                        onClick={() => onReorder(order.item)}
                        className="px-3.5 py-1.5 rounded-lg border border-[#FF6347] text-[#E53935] hover:bg-[#FFEBE7] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Order Again
                      </button>
                    )}
                    {order.status === 'Pending' && onCancelOrder && (
                      <button
                        type="button"
                        onClick={() => onCancelOrder(order.id)}
                        className="px-3.5 py-1.5 rounded-lg border border-[#CDD5E1] text-[#757575] hover:text-[#E53935] hover:border-[#FF6347] hover:bg-[#FFEBE7]/40 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EmptyClipboardGraphic } from './EmptyClipboardGraphic';
import { FoodJointItem } from '../data/foodJoints';
import { OrderRecord } from './OrderHistoryView';
import { Home, History, LogOut, Bell, MapPin, CheckCircle2 } from 'lucide-react';

interface PermanentStaffOrderHistoryProps {
  orders: OrderRecord[];
  onGoHome: () => void;
  onLogout: () => void;
  onReorder?: (item: FoodJointItem) => void;
  onCancelOrder?: (orderId: string) => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

export const PermanentStaffOrderHistory: React.FC<PermanentStaffOrderHistoryProps> = ({
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

  // Filter orders by tab
  const currentOrders = orders.filter((o) => o.status === 'Preparing' || o.status === 'Dispatched');
  const previousOrders = orders.filter((o) => o.status === 'Delivered');

  const displayedOrders = activeTab === 'current' ? currentOrders : previousOrders;

  return (
    <div className="w-full min-h-screen bg-white flex text-slate-800 select-none">
      {/* Left Sidebar matching screenshot image_373135d4.png */}
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

            {/* Active Order History Tab matching screenshot */}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-[#FFEAE6] text-[#E53935] transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Order History</span>
            </button>

            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header matching screenshot */}
        <header className="h-16 border-b border-slate-100 px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-[#E53935]">
            Order History
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
                        <p className="font-semibold text-slate-800">Dispatch Update</p>
                        <p className="text-[11px] text-slate-500">Haatso Station personnel is on duty.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Badge "IA" */}
            <div
              className="w-8 h-8 rounded-full bg-[#FF5745] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-red-300 transition-all"
              title="Isaiah Amoh Mensah (Permanent Staff)"
            >
              IA
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 flex flex-col">
          {/* Sub Navigation Tabs: Current Order / Previous Orders matching screenshot */}
          <div className="flex items-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('current')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'current'
                  ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Current Order
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('previous')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'previous'
                  ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Previous Orders
            </button>
          </div>

          {/* Conditional Display: Empty State vs Order List */}
          {displayedOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center my-auto animate-in fade-in duration-150">
              {/* Graphic of two clipboards matching screenshot image_373135d4.png */}
              <EmptyClipboardGraphic className="w-48 h-48 mb-3" />

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-4">
                You have no order.{' '}
                <button
                  onClick={onGoHome}
                  className="font-bold text-slate-900 hover:text-[#E53935] cursor-pointer inline transition-colors"
                >
                  Go Home
                </button>
                <br />
                and make an Order
              </p>

              {/* Red Go Home button matching screenshot */}
              <button
                type="button"
                onClick={onGoHome}
                className="px-6 py-2.5 rounded-md bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Go Home
              </button>
            </div>
          ) : (
            /* Populated Orders List */
            <div className="space-y-4 max-w-3xl">
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={order.item.image}
                      alt={order.item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{order.item.name}</h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Preparing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {order.item.location}
                        </span>
                        {order.amount && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-slate-800">
                              Amount: GH₵ {order.amount}
                            </span>
                          </>
                        )}
                        {order.personnel && (
                          <>
                            <span>·</span>
                            <span className="text-[#E53935] font-medium">
                              Assigned: {order.personnel}
                            </span>
                          </>
                        )}
                        <span>·</span>
                        <span>{order.date}</span>
                      </div>
                      {order.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 px-2 py-1 rounded">
                          "{order.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                    {order.status === 'Delivered' && onReorder && (
                      <button
                        type="button"
                        onClick={() => onReorder(order.item)}
                        className="px-3.5 py-1.5 rounded-lg border border-[#E53935] text-[#E53935] hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Order Again
                      </button>
                    )}
                    {order.status !== 'Delivered' && onCancelOrder && (
                      <button
                        type="button"
                        onClick={() => onCancelOrder(order.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Cancel
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

import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EmptyClipboardGraphic } from './EmptyClipboardGraphic';
import { FoodJointItem } from '../data/foodJoints';
import { OrderRecord } from './OrderHistoryView';
import {
  Bell,
  Home,
  History,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface MobileOrderHistoryProps {
  orders: OrderRecord[];
  orderCount: number;
  activeNavTab: 'home' | 'history' | 'profile';
  onNavTabChange: (tab: 'home' | 'history' | 'profile') => void;
  onGoHome: () => void;
  onReorder?: (item: FoodJointItem) => void;
  onCancelOrder?: (orderId: string) => void;
}

export const MobileOrderHistory: React.FC<MobileOrderHistoryProps> = ({
  orders,
  orderCount,
  activeNavTab,
  onNavTabChange,
  onGoHome,
  onReorder,
  onCancelOrder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'current' | 'previous'>('current');
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter orders by sub tab
  const currentOrders = orders.filter((o) => o.status === 'Preparing' || o.status === 'Dispatched');
  const previousOrders = orders.filter((o) => o.status === 'Delivered');
  const displayedOrders = activeSubTab === 'current' ? currentOrders : previousOrders;

  return (
    <div className="w-full bg-white flex flex-col min-h-screen select-none relative pb-28">
      {/* Mobile Top Bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        <BrandLogo size="sm" />

        <div className="flex items-center gap-3">
          {/* Notification Bell with green badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/80 p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>Order Updates</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Haatso Station personnel is coordinating dispatched meal orders.
                </p>
              </div>
            )}
          </div>

          {/* User Avatar IA */}
          <div
            onClick={() => onNavTabChange('profile')}
            className="w-8 h-8 rounded-full bg-[#FF5745] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-red-300 transition-all"
            title="Profile"
          >
            IA
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-slate-400 font-normal text-xs mt-0.5">
            Your dispatch and kitchen orders
          </p>
        </div>

        {/* Sub-tabs: Current Order / Previous Orders matching design */}
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setActiveSubTab('current')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'current'
                ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Current Order ({currentOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('previous')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'previous'
                ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Previous Orders ({previousOrders.length})
          </button>
        </div>

        {/* Empty State vs Order Items */}
        {displayedOrders.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
            <EmptyClipboardGraphic className="w-40 h-40 mb-2" />

            <p className="text-xs text-slate-700 leading-relaxed font-normal mb-4">
              You have no order.{' '}
              <button
                type="button"
                onClick={onGoHome}
                className="font-bold text-slate-900 hover:text-[#E53935] cursor-pointer inline transition-colors"
              >
                Go Home
              </button>
              <br />
              and make an Order
            </p>

            <button
              type="button"
              onClick={onGoHome}
              className="px-5 py-2 rounded-md bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Go Home
            </button>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={order.item.image}
                    alt={order.item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {order.item.name}
                      </h4>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
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

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span className="flex items-center gap-0.5 text-slate-600 font-medium">
                        <MapPin className="w-3 h-3 text-[#E53935]" />
                        {order.item.location}
                      </span>
                      {order.amount && (
                        <>
                          <span>·</span>
                          <span className="font-bold text-slate-900">
                            GH₵ {order.amount}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>{order.date}</span>
                    </div>

                    {order.personnel && (
                      <p className="text-[10px] text-[#E53935] font-medium mt-1 truncate">
                        Runner: {order.personnel.split(' (')[0]}
                      </p>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md italic">
                    "{order.notes}"
                  </p>
                )}

                <div className="flex items-center justify-end pt-1 border-t border-slate-100 gap-2">
                  {order.status === 'Delivered' && onReorder && (
                    <button
                      type="button"
                      onClick={() => onReorder(order.item)}
                      className="px-3 py-1 rounded-md border border-[#E53935] text-[#E53935] hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Order Again
                    </button>
                  )}
                  {order.status !== 'Delivered' && onCancelOrder && (
                    <button
                      type="button"
                      onClick={() => onCancelOrder(order.id)}
                      className="px-3 py-1 rounded-md border border-slate-200 text-slate-500 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EmptyClipboardGraphic } from './EmptyClipboardGraphic';
import { FoodJointItem } from '../data/foodJoints';
import { OrderRecord } from './OrderHistoryView';
import { UserProfile } from '../types';
import { Bell, MapPin, CheckCircle2, Clock } from 'lucide-react';

interface MobileOrderHistoryProps {
  currentUser: UserProfile;
  orders: OrderRecord[];
  orderCount: number;
  activeNavTab: 'home' | 'history' | 'profile';
  onNavTabChange: (tab: 'home' | 'history' | 'profile') => void;
  onGoHome: () => void;
  onReorder?: (item: FoodJointItem) => void;
  onCancelOrder?: (orderId: string) => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'IA';

export const MobileOrderHistory: React.FC<MobileOrderHistoryProps> = ({
  currentUser,
  orders,
  onNavTabChange,
  onGoHome,
  onReorder,
  onCancelOrder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'current' | 'previous'>('current');
  const [showNotifications, setShowNotifications] = useState(false);

  const initials = getInitials(currentUser.fullName);

  const currentOrders = orders.filter((o) => o.status === 'Pending');
  const previousOrders = orders.filter((o) => o.status === 'Completed');
  const displayedOrders = activeSubTab === 'current' ? currentOrders : previousOrders;

  return (
    <div className="w-full bg-white flex flex-col min-h-screen select-none relative pb-28">
      {/* Mobile Top Bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[#F4F7FA] sticky top-0 bg-white/95 backdrop-blur-xs z-20">
        <BrandLogo size="sm" />

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#212121] hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#212121]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6347] ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#DEE6EE] p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-bold text-[#212121] pb-1.5 border-b border-[#DEE6EE] flex items-center justify-between">
                  <span>Order Updates</span>
                  <span className="text-[10px] text-[#DB8F05] font-semibold">Live</span>
                </div>
                <p className="text-xs text-[#757575] mt-2">
                  Haatso Station personnel is coordinating dispatched meal orders.
                </p>
              </div>
            )}
          </div>

          <div
            onClick={() => onNavTabChange('profile')}
            className="w-8 h-8 rounded-full bg-[#FF6E6A] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-[#FFEBE7] transition-all"
            title="Profile"
          >
            {initials}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#212121] tracking-tight">
            Order History
          </h1>
          <p className="text-[#757575] font-normal text-xs mt-0.5">
            Track pending orders and review past deliveries
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setActiveSubTab('current')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'current'
                ? 'bg-[#FFEBE7] text-[#E53935]'
                : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
            }`}
          >
            Pending ({currentOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('previous')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'previous'
                ? 'bg-[#FFEBE7] text-[#E53935]'
                : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
            }`}
          >
            Previous Orders ({previousOrders.length})
          </button>
        </div>

        {/* Empty State vs Order Items */}
        {displayedOrders.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
            <EmptyClipboardGraphic className="w-40 h-40 mb-2" />

            <p className="text-xs text-[#757575] leading-relaxed font-normal mb-4">
              You have no {activeSubTab === 'current' ? 'pending' : 'previous'} orders.{' '}
              <button
                type="button"
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
              className="px-5 py-2 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Go Home
            </button>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-3.5 border border-[#DEE6EE] shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={order.item.image}
                    alt={order.item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-[#F4F7FA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="font-bold text-[#212121] text-xs sm:text-sm truncate">
                        {order.item.name}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#FFA500]/15 text-[#DB8F05] border border-[#FFA500]/30'
                        }`}
                      >
                        {order.status === 'Completed' ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Clock className="w-2.5 h-2.5" />
                        )}
                        {order.status}
                      </span>
                    </div>

                    {order.menuItemName && (
                      <p className="text-[11px] font-medium text-[#212121] truncate mt-0.5">
                        {order.menuItemName}
                      </p>
                    )}

                    <div className="text-[11px] text-[#757575] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span className="flex items-center gap-0.5 text-[#757575] font-medium">
                        <MapPin className="w-3 h-3 text-[#FF6347]" />
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
                      <span>·</span>
                      <span>{order.date}</span>
                    </div>

                    {order.personnel && (
                      <p className="text-[10px] text-[#E53935] font-medium mt-1 truncate">
                        Personnel: {order.personnel.split(' (')[0]}
                      </p>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <p className="text-[11px] text-[#757575] bg-[#F4F7FA] px-2.5 py-1 rounded-md italic">
                    "{order.notes}"
                  </p>
                )}

                <div className="flex items-center justify-end pt-1.5 border-t border-[#DEE6EE] gap-2">
                  {order.status === 'Completed' && onReorder && (
                    <button
                      type="button"
                      onClick={() => onReorder(order.item)}
                      className="px-3 py-1 rounded-md border border-[#FF6347] text-[#E53935] hover:bg-[#FFEBE7] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Order Again
                    </button>
                  )}
                  {order.status === 'Pending' && onCancelOrder && (
                    <button
                      type="button"
                      onClick={() => onCancelOrder(order.id)}
                      className="px-3 py-1 rounded-md border border-[#CDD5E1] text-[#757575] hover:text-[#E53935] hover:border-[#FF6347] text-xs font-medium transition-colors cursor-pointer"
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

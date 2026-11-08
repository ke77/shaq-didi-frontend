import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EmptyClipboardGraphic } from './EmptyClipboardGraphic';
import { OrderRecord } from './OrderHistoryView';
import { Bell, MapPin, CheckCircle2, Truck, RefreshCw, UserCheck } from 'lucide-react';

interface NspOrderHistoryProps {
  orders: OrderRecord[];
  onUpdateStatus: (orderId: string, status: 'Preparing' | 'Dispatched' | 'Delivered') => void;
  onRefresh?: () => void;
}

export const NspOrderHistory: React.FC<NspOrderHistoryProps> = ({
  orders,
  onUpdateStatus,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'previous'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // In NSP view, "today" orders are pending or in dispatch, "previous" are delivered
  const todayOrders = orders.filter((o) => o.status === 'Preparing' || o.status === 'Dispatched');
  const previousOrders = orders.filter((o) => o.status === 'Delivered');

  const displayedOrders = activeTab === 'today' ? todayOrders : previousOrders;

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="w-full bg-white flex flex-col min-h-[660px] text-slate-800 select-none rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50">
      {/* Top Header matching screenshot image_704d4003.png */}
      <header className="h-16 border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between bg-white">
        {/* Brand Logo on Left */}
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="hidden sm:inline text-xs font-semibold text-slate-400 border-l border-slate-200 pl-2">
            NSP Dispatch Portal
          </span>
        </div>

        {/* Right Action Icons: Notification bell with green badge and Avatar */}
        <div className="flex items-center gap-4">
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
                  <span>Assigned Order Alerts</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">New Order Available</p>
                      <p className="text-[11px] text-slate-500">Haatso Station personnel dispatch active.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar Badge "IA" / NSP */}
          <div
            className="w-8 h-8 rounded-full bg-[#FF5745] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:ring-2 hover:ring-red-300 transition-all"
            title="National Service Personnel (NSP Dispatch)"
          >
            IA
          </div>
        </div>
      </header>

      {/* Main Content Area matching screenshot image_704d4003.png */}
      <main className="flex-1 p-6 sm:p-10 flex flex-col max-w-5xl w-full mx-auto">
        {/* Title: Manage Your Assigned Orders */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
          Manage Your Assigned Orders
        </h1>

        {/* Sub Navigation Tabs: Today / Previous Orders matching screenshot */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#FFEAE6] text-[#E53935] shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Today
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

        {/* Empty State vs Assigned Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center my-auto animate-in fade-in duration-150">
            {/* Dual clipboard illustration */}
            <EmptyClipboardGraphic className="w-48 h-48 mb-3" />

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-5">
              No Orders Assigned Yet
            </p>

            {/* Red Refresh button matching screenshot image_704d4003.png */}
            <button
              type="button"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="px-6 py-2 rounded-md bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        ) : (
          /* Populated Assigned Orders List */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>{displayedOrders.length} {displayedOrders.length === 1 ? 'order' : 'orders'} in this view</span>
              <button
                onClick={handleRefreshClick}
                className="text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Feed</span>
              </button>
            </div>

            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={order.item.image}
                    alt={order.item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {order.item.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'Dispatched'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
                        {order.item.location}
                      </span>
                      {order.amount && (
                        <>
                          <span>·</span>
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            Collect: GH₵ {order.amount}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span className="text-slate-400">{order.date}</span>
                    </div>

                    {/* Staff delivery note */}
                    {order.notes && (
                      <div className="mt-1.5 text-xs text-slate-600 bg-amber-50/70 border border-amber-100 px-2.5 py-1 rounded-md">
                        <span className="font-semibold text-amber-900">Note:</span> {order.notes}
                      </div>
                    )}

                    {order.personnel && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Assigned Runner: <span className="font-medium text-slate-700">{order.personnel}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* NSP Status Update Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {order.status === 'Preparing' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order.id, 'Dispatched')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Mark Dispatched</span>
                    </button>
                  )}

                  {order.status === 'Dispatched' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order.id, 'Delivered')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

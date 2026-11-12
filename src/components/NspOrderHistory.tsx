import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EmptyClipboardGraphic } from './EmptyClipboardGraphic';
import { OrderRecord } from './OrderHistoryView';
import { UserProfile } from '../types';
import {
  Bell,
  MapPin,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Clock,
  User,
  LogOut,
  Eye,
  X,
  Phone,
  Calendar,
} from 'lucide-react';

interface NspOrderHistoryProps {
  currentUser: UserProfile;
  orders: OrderRecord[];
  onUpdateStatus: (orderId: string, status: 'Pending' | 'Completed') => void;
  onRefresh?: () => void;
  onToggleRole?: () => void;
  onLogout?: () => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'NS';

export const NspOrderHistory: React.FC<NspOrderHistoryProps> = ({
  currentUser,
  orders,
  onUpdateStatus,
  onRefresh,
  onToggleRole,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'previous'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const initials = getInitials(currentUser.fullName);

  // "Today" shows pending assigned orders; "Previous Orders" shows Completed orders (NSP Story 2 & 3)
  const todayOrders = orders.filter((o) => o.status === 'Pending');
  const previousOrders = orders.filter((o) => o.status === 'Completed');

  const displayedOrders = activeTab === 'today' ? todayOrders : previousOrders;

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 550);
  };

  const handleMarkCompleted = (orderId: string) => {
    onUpdateStatus(orderId, 'Completed');
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'Completed' } : null));
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col text-[#212121] select-none">
      {/* Top Header */}
      <header className="h-16 border-b border-[#DEE6EE] px-4 sm:px-8 flex items-center justify-between bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" />
          <span className="hidden sm:inline text-xs font-semibold text-[#757575] border-l border-[#DEE6EE] pl-2.5">
            National Service Personnel
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleRole && (
            <button
              type="button"
              onClick={onToggleRole}
              className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#DEE6EE] text-[#757575] hover:text-[#E53935] hover:border-[#FF6347]/40 hover:bg-[#FFEBE7]/40 transition-colors cursor-pointer whitespace-nowrap"
            >
              Staff View
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] rounded-full transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {todayOrders.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6347] border-2 border-white rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#DEE6EE] p-3 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-bold text-[#212121] pb-2 border-b border-[#DEE6EE] flex items-center justify-between">
                  <span>Assigned Order Alerts</span>
                  <span className="text-[10px] text-[#DB8F05] font-semibold">
                    {todayOrders.length} pending
                  </span>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#F4F7FA] border border-[#DEE6EE] flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-[#FF6347] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#212121]">Dispatch Queue</p>
                      <p className="text-[11px] text-[#757575]">
                        {todayOrders.length > 0
                          ? `You have ${todayOrders.length} pending order(s) for today.`
                          : 'All assigned orders have been completed.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBE7]/50 rounded-full transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Profile Avatar Badge */}
          <div
            className="w-8 h-8 rounded-full bg-[#FF6E6A] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs"
            title={`${currentUser.fullName} (National Service Personnel)`}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-10 flex flex-col max-w-5xl w-full mx-auto">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#212121] tracking-tight">
            Manage Your Assigned Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] mt-0.5">
            Signed in as {currentUser.fullName}
          </p>
        </div>

        {/* Sub Navigation Tabs: Today / Previous Orders (NSP Story 2 & 3) */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#FFEBE7] text-[#E53935]'
                : 'text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA]'
            }`}
          >
            Today ({todayOrders.length})
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

        {/* Empty State vs Assigned Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center my-auto animate-in fade-in duration-150">
            <EmptyClipboardGraphic className="w-44 h-44 mb-3" />

            <p className="text-xs sm:text-sm text-[#757575] leading-relaxed font-normal mb-5">
              {activeTab === 'today'
                ? 'No Orders Assigned for Today Yet'
                : 'No Previous Completed Orders Yet'}
            </p>

            <button
              type="button"
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="px-6 py-2.5 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#757575] pb-2 border-b border-[#DEE6EE]">
              <span className="tabular-nums">
                {displayedOrders.length} {displayedOrders.length === 1 ? 'order' : 'orders'}
              </span>
              <button
                onClick={handleRefreshClick}
                className="text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Feed</span>
              </button>
            </div>

            {displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#DEE6EE] shadow-xs hover:border-[#CDD5E1] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={order.item.image}
                    alt={order.item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-[#F4F7FA] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#212121] text-sm sm:text-base">
                        {order.item.name}
                      </h3>
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
                        Item: {order.menuItemName}
                      </p>
                    )}

                    {/* NSP Story 4: Food joint name, address, amount, staff name, and date */}
                    <div className="text-xs text-[#757575] flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
                      <span className="flex items-center gap-1 text-[#212121] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#FF6347] shrink-0" />
                        {order.item.location}
                      </span>
                      {order.amount && (
                        <>
                          <span>·</span>
                          <span className="font-bold text-[#E53935] tabular-nums">
                            Amount: GH₵ {order.amount}
                          </span>
                        </>
                      )}
                      {order.staffName && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[#212121] font-medium">
                            <User className="w-3 h-3 text-[#757575]" />
                            Staff: {order.staffName}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>{order.date}</span>
                    </div>

                    {order.notes && (
                      <div className="mt-1.5 text-xs text-[#757575] bg-[#F4F7FA] border border-[#DEE6EE] px-2.5 py-1 rounded-md">
                        <span className="font-semibold text-[#212121]">Note:</span> {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* NSP Actions: View Details & Mark as Completed (NSP Story 4 & 5) */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#DEE6EE] shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 rounded-lg border border-[#DEE6EE] text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  {order.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => handleMarkCompleted(order.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Completed</span>
                    </button>
                  )}

                  {order.status === 'Completed' && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
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

      {/* NSP Order Details Modal (NSP Story 4 & 5) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#212121]/50 backdrop-blur-[2px] animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="relative h-36 bg-[#212121]">
              <img
                src={selectedOrder.item.image}
                alt={selectedOrder.item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/90 via-[#212121]/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#212121] cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-5 right-5 text-white">
                <h3 className="text-lg font-bold leading-snug">{selectedOrder.item.name}</h3>
                <p className="text-xs text-[#F4F7FA] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6347] shrink-0" />
                  <span>{selectedOrder.item.location}</span>
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-[#F4F7FA] rounded-xl p-4 border border-[#DEE6EE] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#757575] font-medium">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
                      selectedOrder.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-[#FFA500]/15 text-[#DB8F05]'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                {selectedOrder.menuItemName && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#757575] font-medium">Menu Item</span>
                    <span className="font-semibold text-[#212121] text-right">
                      {selectedOrder.menuItemName}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#757575] font-medium">Amount</span>
                  <span className="font-bold text-[#E53935] tabular-nums">
                    GH₵ {selectedOrder.amount || '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#DEE6EE]">
                  <span className="text-[#757575] font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Staff Name
                  </span>
                  <span className="font-semibold text-[#212121]">
                    {selectedOrder.staffName || 'Isaiah Amoh Mensah'}
                  </span>
                </div>
                {selectedOrder.staffPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#757575] font-medium flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      Staff Phone
                    </span>
                    <span className="font-medium text-[#212121] tabular-nums">
                      {selectedOrder.staffPhone}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#757575] font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Date
                  </span>
                  <span className="text-[#212121]">{selectedOrder.date}</span>
                </div>
                {selectedOrder.notes && (
                  <div className="pt-2 border-t border-[#DEE6EE]">
                    <span className="text-[#757575] font-medium block mb-1">Instructions / Note</span>
                    <p className="text-[#212121] leading-relaxed">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-lg border border-[#DEE6EE] text-[#757575] hover:text-[#212121] text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                {selectedOrder.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleMarkCompleted(selectedOrder.id)}
                    className="px-5 py-2 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { SignUpForm } from './components/SignUpForm';
import { SignInForm } from './components/SignInForm';
import { SuccessModal } from './components/SuccessModal';
import { PreviewNav, ViewMode, ActiveAppScreen } from './components/PreviewNav';
import { DesktopHome } from './components/DesktopHome';
import { MobileHome } from './components/MobileHome';
import { OrderRecord } from './components/OrderHistoryView';
import { ProfileView } from './components/ProfileView';
import { OrderInfoPage, OrderInfoSubmitData } from './components/OrderInfoPage';
import { DesktopOrderModal } from './components/DesktopOrderModal';
import { PermanentStaffOrderHistory } from './components/PermanentStaffOrderHistory';
import { MobileOrderHistory } from './components/MobileOrderHistory';
import { NspOrderHistory } from './components/NspOrderHistory';
import { NotificationView, DesktopNotificationView } from './components/NotificationView';
import { INITIAL_NOTIFICATIONS, AppNotification } from './data/notifications';
import { FOOD_ITEMS, FoodJointItem } from './data/foodJoints';
import { SignUpFormData } from './types';
import { api } from './services/api';
import { CheckCircle2, X } from 'lucide-react';

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1041',
    item: FOOD_ITEMS[0],
    quantity: 1,
    amount: '35.00',
    personnel: 'Ama Serwaa (NSP - Station Runner)',
    notes: 'Block B Room 14, extra pepper please',
    date: 'Today, 12:45 PM',
    status: 'Preparing',
  },
  {
    id: 'ord-1039',
    item: FOOD_ITEMS[1],
    quantity: 1,
    amount: '50.00',
    personnel: 'Kofi Mensah (NSP - Zone A Dispatch)',
    notes: 'Call on arrival',
    date: 'Yesterday, 1:15 PM',
    status: 'Delivered',
  },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveAppScreen>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');

  // Homepage navigation tabs
  const [desktopNavTab, setDesktopNavTab] = useState<'home' | 'history' | 'notifications'>('home');
  const [mobileNavTab, setMobileNavTab] = useState<'home' | 'history' | 'profile'>('home');

  // Food ordering state
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodJointItem>(FOOD_ITEMS[0]);
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Notifications state matching image_937fe657.png
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setOrderToast('All notifications marked as read');
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setOrderToast('All notifications cleared');
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.orderId) {
      setActiveScreen('order-history-ps');
    }
  };

  // Sign up state
  const [signUpData, setSignUpData] = useState<SignUpFormData | null>(null);

  // Desktop click on food card
  const handleDesktopSelectFood = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    setDesktopModalOpen(true);
  };

  // Mobile click on food card
  const handleMobileSelectFood = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    setActiveScreen('order-info');
  };

  const handlePlaceOrderInfo = async (data: OrderInfoSubmitData) => {
    const newRecord: OrderRecord = {
      id: `ord-${1042 + orders.length}`,
      item: data.item,
      quantity: 1,
      amount: data.amount,
      notes: data.notes,
      personnel: data.personnel,
      date: 'Just now',
      status: 'Preparing',
    };

    // Attempt backend sync with Laravel API
    try {
      await api.createOrder({
        food_item_id: data.item.id,
        amount: data.amount,
        notes: data.notes,
        personnel_name: data.personnel,
      });
    } catch {
      // Graceful offline fallback
    }

    setOrders((prev) => [newRecord, ...prev]);

    // Push live notification
    const orderNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'order_assigned',
      title: 'New Order Assigned:',
      message: `A new order has been assigned to you! Please check your dashboard to view details and manage the order (${data.item.name})`,
      date: 'Just now',
      read: false,
      orderId: newRecord.id,
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    setOrderToast(
      `Order placed for ${data.item.name} (Amount: GH₵ ${data.amount}) · Assigned to ${data.personnel.split(' (')[0]}!`
    );
    setTimeout(() => {
      setOrderToast(null);
    }, 5000);
    setDesktopModalOpen(false);
    setActiveScreen('home');
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: 'Preparing' | 'Dispatched' | 'Delivered'
  ) => {
    try {
      await api.updateOrderStatus(orderId, status);
    } catch {
      // Graceful offline fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    // Push notification for status change
    const statusNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: status === 'Delivered' ? 'order_completed' : 'order_dispatched',
      title: status === 'Delivered' ? 'Order Completed:' : 'Order Dispatched:',
      message: `Order for ${orderId} marked as ${status.toLowerCase()}`,
      date: 'Just now',
      read: false,
      orderId,
    };
    setNotifications((prev) => [statusNotif, ...prev]);

    setOrderToast(`Order ${orderId} updated to ${status}!`);
    setTimeout(() => {
      setOrderToast(null);
    }, 4000);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setOrderToast(`Order cancelled.`);
    setTimeout(() => {
      setOrderToast(null);
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    }
    setActiveScreen('signin');
  };

  const handleReorder = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    if (viewMode === 'mobile') {
      setActiveScreen('order-info');
    } else {
      setDesktopModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/95 flex flex-col font-sans">
      {/* Top Preview Switcher Bar */}
      <PreviewNav
        currentMode={viewMode}
        onModeChange={setViewMode}
        activeScreen={activeScreen}
        onScreenChange={(screen) => {
          setActiveScreen(screen);
          if (screen === 'order-info') {
            setDesktopModalOpen(true);
          }
        }}
        unreadNotificationCount={unreadNotificationCount}
      />

      {/* Floating Order Success Toast */}
      {orderToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{orderToast}</span>
          <button
            onClick={() => setOrderToast(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Preview Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 lg:p-6 w-full">
        {/* =========================================================================
            SCREEN 1: HOMEPAGE (PS_Home Desktop & PWA Mobile App)
           ========================================================================= */}
        {activeScreen === 'home' && (
          <div className="w-full flex justify-center items-center my-auto">
            {/* VIEW MODE: Responsive */}
            {viewMode === 'responsive' && (
              <div className="w-full max-w-6xl">
                {/* Desktop view on lg+ */}
                <div className="hidden lg:block w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 relative">
                  {desktopNavTab === 'home' ? (
                    <DesktopHome
                      onLogout={handleLogout}
                      onSelectFood={handleDesktopSelectFood}
                      orderCount={orders.length}
                      activeNavTab={desktopNavTab}
                      onNavTabChange={setDesktopNavTab}
                      onOpenNotifications={() => setActiveScreen('notifications')}
                      unreadNotificationCount={unreadNotificationCount}
                    />
                  ) : (
                    <PermanentStaffOrderHistory
                      orders={orders}
                      onGoHome={() => setDesktopNavTab('home')}
                      onLogout={handleLogout}
                      onReorder={handleReorder}
                      onCancelOrder={handleCancelOrder}
                      onOpenNotifications={() => setActiveScreen('notifications')}
                      unreadNotificationCount={unreadNotificationCount}
                    />
                  )}

                  {/* Desktop Order Modal when triggered on Desktop */}
                  <DesktopOrderModal
                    isOpen={desktopModalOpen}
                    item={selectedFoodItem}
                    onClose={() => setDesktopModalOpen(false)}
                    onSubmitOrder={handlePlaceOrderInfo}
                  />
                </div>

                {/* Mobile PWA view on small screens */}
                <div className="block lg:hidden max-w-md mx-auto w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50">
                  {mobileNavTab === 'home' && (
                    <MobileHome
                      onSelectFood={handleMobileSelectFood}
                      orderCount={orders.length}
                      activeTab={mobileNavTab}
                      onTabChange={setMobileNavTab}
                      onLogout={handleLogout}
                      onOpenNotifications={() => setActiveScreen('notifications')}
                      unreadNotificationCount={unreadNotificationCount}
                    />
                  )}
                  {mobileNavTab === 'history' && (
                    <MobileOrderHistory
                      orders={orders}
                      orderCount={orders.length}
                      activeNavTab={mobileNavTab}
                      onNavTabChange={setMobileNavTab}
                      onGoHome={() => setMobileNavTab('home')}
                      onReorder={handleReorder}
                      onCancelOrder={handleCancelOrder}
                    />
                  )}
                  {mobileNavTab === 'profile' && (
                    <ProfileView
                      onBack={() => setMobileNavTab('home')}
                      onLogout={handleLogout}
                      activeNavTab={mobileNavTab}
                      onNavTabChange={setMobileNavTab}
                      orderCount={orders.length}
                    />
                  )}
                </div>
              </div>
            )}

            {/* VIEW MODE: Force Desktop View */}
            {viewMode === 'desktop' && (
              <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 relative">
                {desktopNavTab === 'home' ? (
                  <DesktopHome
                    onLogout={handleLogout}
                    onSelectFood={handleDesktopSelectFood}
                    orderCount={orders.length}
                    activeNavTab={desktopNavTab}
                    onNavTabChange={setDesktopNavTab}
                    onOpenNotifications={() => setActiveScreen('notifications')}
                    unreadNotificationCount={unreadNotificationCount}
                  />
                ) : (
                  <PermanentStaffOrderHistory
                    orders={orders}
                    onGoHome={() => setDesktopNavTab('home')}
                    onLogout={handleLogout}
                    onReorder={handleReorder}
                    onCancelOrder={handleCancelOrder}
                    onOpenNotifications={() => setActiveScreen('notifications')}
                    unreadNotificationCount={unreadNotificationCount}
                  />
                )}

                {/* Desktop Order Modal */}
                <DesktopOrderModal
                  isOpen={desktopModalOpen}
                  item={selectedFoodItem}
                  onClose={() => setDesktopModalOpen(false)}
                  onSubmitOrder={handlePlaceOrderInfo}
                />
              </div>
            )}

            {/* VIEW MODE: Force Mobile PWA View */}
            {viewMode === 'mobile' && (
              <div className="py-2">
                <div className="relative w-[340px] sm:w-[360px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40 mx-auto">
                  {/* Dynamic Island / Speaker Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-800 rounded-full" />
                  </div>

                  {/* Phone Screen */}
                  <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[640px] flex flex-col relative">
                    {mobileNavTab === 'home' && (
                      <MobileHome
                        onSelectFood={handleMobileSelectFood}
                        orderCount={orders.length}
                        activeTab={mobileNavTab}
                        onTabChange={setMobileNavTab}
                        onLogout={handleLogout}
                        onOpenNotifications={() => setActiveScreen('notifications')}
                        unreadNotificationCount={unreadNotificationCount}
                      />
                    )}
                    {mobileNavTab === 'history' && (
                      <MobileOrderHistory
                        orders={orders}
                        orderCount={orders.length}
                        activeNavTab={mobileNavTab}
                        onNavTabChange={setMobileNavTab}
                        onGoHome={() => setMobileNavTab('home')}
                        onReorder={handleReorder}
                        onCancelOrder={handleCancelOrder}
                      />
                    )}
                    {mobileNavTab === 'profile' && (
                      <ProfileView
                        onBack={() => setMobileNavTab('home')}
                        onLogout={handleLogout}
                        activeNavTab={mobileNavTab}
                        onNavTabChange={setMobileNavTab}
                        orderCount={orders.length}
                      />
                    )}
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-slate-400 font-medium tracking-wide">
                  ShaQ DIDI PWA Mobile Experience
                </p>
              </div>
            )}

            {/* VIEW MODE: Side-by-Side (Desktop PS_Home + Mobile Services PWA) */}
            {viewMode === 'side-by-side' && (
              <div className="w-full max-w-7xl flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-10 my-auto py-4">
                {/* Desktop Mockup Section */}
                <div className="flex-1 w-full max-w-3xl flex flex-col items-start relative">
                  <div className="mb-2 text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-2">
                    <span>PS _Home</span>
                    <span className="text-slate-500 font-normal text-xs">(Desktop Portal)</span>
                  </div>
                  <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 relative">
                    <DesktopHome
                      onLogout={handleLogout}
                      onSelectFood={handleDesktopSelectFood}
                      orderCount={orders.length}
                      activeNavTab={desktopNavTab}
                      onNavTabChange={setDesktopNavTab}
                      onOpenNotifications={() => setActiveScreen('notifications')}
                      unreadNotificationCount={unreadNotificationCount}
                    />
                    <DesktopOrderModal
                      isOpen={desktopModalOpen}
                      item={selectedFoodItem}
                      onClose={() => setDesktopModalOpen(false)}
                      onSubmitOrder={handlePlaceOrderInfo}
                    />
                  </div>
                </div>

                {/* Mobile Services Mockup Section */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 self-start text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-2">
                    <span>Mobile PWA App</span>
                    <span className="text-slate-500 font-normal text-xs">(Haatso Station PWA)</span>
                  </div>
                  <div className="relative w-[320px] sm:w-[350px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40">
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                      <div className="w-10 h-1 bg-slate-800 rounded-full" />
                    </div>
                    <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[620px] flex flex-col relative">
                      {mobileNavTab === 'home' && (
                        <MobileHome
                          onSelectFood={handleMobileSelectFood}
                          orderCount={orders.length}
                          activeTab={mobileNavTab}
                          onTabChange={setMobileNavTab}
                          onLogout={handleLogout}
                          onOpenNotifications={() => setActiveScreen('notifications')}
                          unreadNotificationCount={unreadNotificationCount}
                        />
                      )}
                      {mobileNavTab === 'history' && (
                        <MobileOrderHistory
                          orders={orders}
                          orderCount={orders.length}
                          activeNavTab={mobileNavTab}
                          onNavTabChange={setMobileNavTab}
                          onGoHome={() => setMobileNavTab('home')}
                          onReorder={handleReorder}
                          onCancelOrder={handleCancelOrder}
                        />
                      )}
                      {mobileNavTab === 'profile' && (
                        <ProfileView
                          onBack={() => setMobileNavTab('home')}
                          onLogout={handleLogout}
                          activeNavTab={mobileNavTab}
                          onNavTabChange={setMobileNavTab}
                          orderCount={orders.length}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: ORDER SCREEN (Big Screen Modal / Mobile Screen matching design)
           ========================================================================= */}
        {activeScreen === 'order-info' && (
          <div className="w-full flex justify-center items-center my-auto py-2">
            {/* View Mode: Mobile screen */}
            {viewMode === 'mobile' ? (
              <div className="py-2">
                <div className="w-full max-w-[380px] mb-2 px-2 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-slate-400 tracking-tight">Order Info</h2>
                </div>
                <div className="relative w-[340px] sm:w-[380px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40 mx-auto">
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-800 rounded-full" />
                  </div>
                  <div className="rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner min-h-[640px] flex flex-col relative">
                    <OrderInfoPage
                      item={selectedFoodItem}
                      onBack={() => setActiveScreen('home')}
                      onSubmitOrder={handlePlaceOrderInfo}
                      isStandaloneScreen={false}
                    />
                  </div>
                </div>
              </div>
            ) : viewMode === 'side-by-side' ? (
              /* View Mode: Side-by-Side (Desktop with Modal + Mobile Screen) */
              <div className="w-full max-w-7xl flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12 my-auto py-4">
                <div className="flex-1 w-full max-w-3xl flex flex-col items-start relative">
                  <h2 className="text-2xl font-medium text-slate-300 tracking-tight mb-2 pl-1">
                    Order
                  </h2>
                  <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 relative">
                    <DesktopHome
                      onLogout={handleLogout}
                      onSelectFood={handleDesktopSelectFood}
                      orderCount={orders.length}
                      activeNavTab={desktopNavTab}
                      onNavTabChange={setDesktopNavTab}
                    />
                    <DesktopOrderModal
                      isOpen={true}
                      item={selectedFoodItem}
                      onClose={() => setActiveScreen('home')}
                      onSubmitOrder={handlePlaceOrderInfo}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full mb-1 flex items-center justify-between">
                    <h2 className="text-base font-medium text-slate-400 tracking-tight">Order Info (Mobile)</h2>
                  </div>
                  <div className="relative w-[320px] sm:w-[350px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40">
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                      <div className="w-10 h-1 bg-slate-800 rounded-full" />
                    </div>
                    <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[620px] flex flex-col relative">
                      <OrderInfoPage
                        item={selectedFoodItem}
                        onBack={() => setActiveScreen('home')}
                        onSubmitOrder={handlePlaceOrderInfo}
                        isStandaloneScreen={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Big screen matching screenshot image_b0a6faf9.png */
              <div className="w-full max-w-6xl my-auto">
                <div className="hidden lg:block w-full">
                  <h2 className="text-2xl font-medium text-slate-300 tracking-tight mb-3 pl-1">
                    Order
                  </h2>
                  <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 relative">
                    <DesktopHome
                      onLogout={handleLogout}
                      onSelectFood={handleDesktopSelectFood}
                      orderCount={orders.length}
                      activeNavTab={desktopNavTab}
                      onNavTabChange={setDesktopNavTab}
                    />
                    <DesktopOrderModal
                      isOpen={true}
                      item={selectedFoodItem}
                      onClose={() => setActiveScreen('home')}
                      onSubmitOrder={handlePlaceOrderInfo}
                    />
                  </div>
                </div>

                <div className="block lg:hidden max-w-md mx-auto w-full">
                  <OrderInfoPage
                    item={selectedFoodItem}
                    onBack={() => setActiveScreen('home')}
                    onSubmitOrder={handlePlaceOrderInfo}
                    isStandaloneScreen={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: ORDER HISTORY FOR PERMANENT STAFF (matching image_373135d4.png)
           ========================================================================= */}
        {activeScreen === 'order-history-ps' && (
          <div className="w-full max-w-6xl my-auto py-2">
            {/* View Mode: Mobile */}
            {viewMode === 'mobile' ? (
              <div className="py-2">
                <div className="w-full max-w-[360px] mx-auto mb-2 px-1 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-slate-400 tracking-tight">
                    Order History
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOrders(orders.length > 0 ? [] : INITIAL_ORDERS)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 cursor-pointer"
                  >
                    {orders.length > 0 ? 'Empty State' : 'Sample Orders'}
                  </button>
                </div>
                <div className="relative w-[340px] sm:w-[360px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40 mx-auto">
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-800 rounded-full" />
                  </div>
                  <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[640px] flex flex-col relative">
                    <MobileOrderHistory
                      orders={orders}
                      orderCount={orders.length}
                      activeNavTab="history"
                      onNavTabChange={(tab) => {
                        if (tab === 'home') setActiveScreen('home');
                        if (tab === 'profile') setActiveScreen('profile');
                      }}
                      onGoHome={() => setActiveScreen('home')}
                      onReorder={handleReorder}
                      onCancelOrder={handleCancelOrder}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop and Responsive View */
              <div>
                <div className="mb-2 pl-1 flex items-center justify-between">
                  <h2 className="text-2xl font-medium text-slate-300 tracking-tight">
                    Order History_Empty
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOrders([])}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Clear all orders to test the empty state"
                    >
                      Simulate Empty State
                    </button>
                    {orders.length === 0 && (
                      <button
                        type="button"
                        onClick={() => setOrders(INITIAL_ORDERS)}
                        className="text-xs px-2.5 py-1 rounded bg-red-900/40 text-red-300 hover:bg-red-900/60 cursor-pointer"
                      >
                        Restore Sample Orders
                      </button>
                    )}
                  </div>
                </div>

                {/* Desktop View on lg+ */}
                <div className="hidden lg:block">
                  <PermanentStaffOrderHistory
                    orders={orders}
                    onGoHome={() => setActiveScreen('home')}
                    onLogout={handleLogout}
                    onReorder={handleReorder}
                    onCancelOrder={handleCancelOrder}
                  />
                </div>

                {/* Mobile Fallback on small viewports */}
                <div className="block lg:hidden max-w-md mx-auto w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <MobileOrderHistory
                    orders={orders}
                    orderCount={orders.length}
                    activeNavTab="history"
                    onNavTabChange={(tab) => {
                      if (tab === 'home') setActiveScreen('home');
                      if (tab === 'profile') setActiveScreen('profile');
                    }}
                    onGoHome={() => setActiveScreen('home')}
                    onReorder={handleReorder}
                    onCancelOrder={handleCancelOrder}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: ORDER HISTORY FOR NSPs (matching image_704d4003.png)
           ========================================================================= */}
        {activeScreen === 'order-history-nsp' && (
          <div className="w-full max-w-6xl my-auto py-2">
            <div className="mb-2 pl-1 flex items-center justify-between">
              <h2 className="text-2xl font-medium text-slate-300 tracking-tight">
                Empty (NSP Orders)
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOrders([])}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Clear all orders to test the empty state"
                >
                  Simulate Empty State
                </button>
                {orders.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setOrders(INITIAL_ORDERS)}
                    className="text-xs px-2.5 py-1 rounded bg-red-900/40 text-red-300 hover:bg-red-900/60 cursor-pointer"
                  >
                    Restore Sample Orders
                  </button>
                )}
              </div>
            </div>

            <NspOrderHistory
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={() => {
                setOrderToast('Synced assigned orders with dispatch server.');
                setTimeout(() => setOrderToast(null), 3000);
              }}
            />
          </div>
        )}

        {/* =========================================================================
            SCREEN 5: PROFILE PAGE (matching image_5e001cd4.png)
           ========================================================================= */}
        {activeScreen === 'profile' && (
          <div className="w-full flex justify-center items-center my-auto py-4">
            <ProfileView
              onBack={() => setActiveScreen('home')}
              onLogout={handleLogout}
              isStandaloneScreen={true}
              activeNavTab="profile"
              onNavTabChange={(tab) => {
                if (tab === 'home') setActiveScreen('home');
                if (tab === 'history') setActiveScreen('order-history-ps');
              }}
              orderCount={orders.length}
            />
          </div>
        )}

        {/* =========================================================================
            SCREEN 6: NOTIFICATIONS (matching image_937fe657.png on mobile & big screens)
           ========================================================================= */}
        {activeScreen === 'notifications' && (
          <div className="w-full flex justify-center items-center my-auto py-2">
            {/* View Mode: Mobile screen */}
            {viewMode === 'mobile' ? (
              <div className="py-2">
                <div className="w-full max-w-[380px] mb-2 px-2 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-slate-400 tracking-tight">Notification</h2>
                  <button
                    type="button"
                    onClick={() => setNotifications(notifications.length > 0 ? [] : INITIAL_NOTIFICATIONS)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 cursor-pointer"
                  >
                    {notifications.length > 0 ? 'Empty State' : 'Reset Sample'}
                  </button>
                </div>
                <div className="relative w-[340px] sm:w-[380px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40 mx-auto">
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-800 rounded-full" />
                  </div>
                  <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[640px] flex flex-col relative">
                    <NotificationView
                      notifications={notifications}
                      onBack={() => setActiveScreen('home')}
                      onMarkAllAsRead={handleMarkAllNotificationsRead}
                      onNotificationClick={handleNotificationClick}
                      isStandaloneScreen={false}
                    />
                  </div>
                </div>
              </div>
            ) : viewMode === 'side-by-side' ? (
              /* View Mode: Side-by-Side (Desktop Notifications + Mobile Screen) */
              <div className="w-full max-w-7xl flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12 my-auto py-4">
                <div className="flex-1 w-full max-w-3xl flex flex-col items-start relative">
                  <h2 className="text-2xl font-medium text-slate-300 tracking-tight mb-2 pl-1">
                    Notifications (Desktop)
                  </h2>
                  <DesktopNotificationView
                    notifications={notifications}
                    onGoHome={() => setActiveScreen('home')}
                    onGoOrderHistory={() => setActiveScreen('order-history-ps')}
                    onLogout={handleLogout}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                    onClearAll={handleClearAllNotifications}
                    onNotificationClick={handleNotificationClick}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full mb-1 flex items-center justify-between">
                    <h2 className="text-base font-medium text-slate-400 tracking-tight">Notification (Mobile)</h2>
                  </div>
                  <div className="relative w-[320px] sm:w-[350px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40">
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                      <div className="w-10 h-1 bg-slate-800 rounded-full" />
                    </div>
                    <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[620px] flex flex-col relative">
                      <NotificationView
                        notifications={notifications}
                        onBack={() => setActiveScreen('home')}
                        onMarkAllAsRead={handleMarkAllNotificationsRead}
                        onNotificationClick={handleNotificationClick}
                        isStandaloneScreen={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Big screen matching screenshot inspo */
              <div className="w-full max-w-6xl my-auto">
                <div className="hidden lg:block w-full">
                  <div className="mb-2 pl-1 flex items-center justify-between">
                    <h2 className="text-2xl font-medium text-slate-300 tracking-tight">
                      Notifications
                    </h2>
                    <button
                      type="button"
                      onClick={() => setNotifications(notifications.length > 0 ? [] : INITIAL_NOTIFICATIONS)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      {notifications.length > 0 ? 'Simulate Empty State' : 'Reset Sample Notifications'}
                    </button>
                  </div>
                  <DesktopNotificationView
                    notifications={notifications}
                    onGoHome={() => setActiveScreen('home')}
                    onGoOrderHistory={() => setActiveScreen('order-history-ps')}
                    onLogout={handleLogout}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                    onClearAll={handleClearAllNotifications}
                    onNotificationClick={handleNotificationClick}
                  />
                </div>

                <div className="block lg:hidden max-w-md mx-auto w-full">
                  <NotificationView
                    notifications={notifications}
                    onBack={() => setActiveScreen('home')}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                    onNotificationClick={handleNotificationClick}
                    isStandaloneScreen={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SCREEN 6 & 7: USER SIGN IN & SIGN UP SCREENS
           ========================================================================= */}
        {(activeScreen === 'signin' || activeScreen === 'signup') && (
          <div className="w-full max-w-5xl my-auto">
            {/* Desktop / Responsive Container */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-200/40">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px] lg:min-h-[640px]">
                {/* Left Column: Hero Section */}
                <div className="h-full">
                  <HeroSection
                    onSignInClick={() => setActiveScreen('signin')}
                    showSignInButton={activeScreen === 'signup'}
                  />
                </div>

                {/* Right Column: Form Section */}
                <div className="flex items-center justify-center bg-white">
                  {activeScreen === 'signin' ? (
                    <SignInForm
                      onSuccess={async (data) => {
                        try {
                          await api.login({ email: data.email, password: 'password' });
                        } catch {
                          // Ignore
                        }
                        setActiveScreen('home');
                      }}
                      onSignUpClick={() => setActiveScreen('signup')}
                    />
                  ) : (
                    <SignUpForm
                      onSuccess={async (data) => {
                        setSignUpData(data);
                        try {
                          await api.register(data);
                        } catch {
                          // Ignore
                        }
                        setActiveScreen('home');
                      }}
                      onSignInClick={() => setActiveScreen('signin')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Account Created Success Confirmation Modal */}
      <SuccessModal
        data={signUpData}
        onClose={() => setSignUpData(null)}
        onReset={() => setSignUpData(null)}
      />
    </div>
  );
}

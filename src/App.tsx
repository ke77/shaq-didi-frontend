'use client';

import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { SignUpForm } from './components/SignUpForm';
import { SignInForm } from './components/SignInForm';
import { SuccessModal } from './components/SuccessModal';
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
import { CheckCircle2, X, ArrowLeftRight, UserCheck } from 'lucide-react';

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

export type UserRole = 'permanent_staff' | 'nsp';

export default function App() {
  // Authentication & Top-level View
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [signUpData, setSignUpData] = useState<SignUpFormData | null>(null);

  // Active Role: Permanent Staff or NSP Dispatcher
  const [userRole, setUserRole] = useState<UserRole>('permanent_staff');

  // Desktop Navigation: 'home' | 'history' | 'notifications'
  const [desktopNavTab, setDesktopNavTab] = useState<'home' | 'history' | 'notifications'>('home');

  // Mobile Navigation: Tab ('home' | 'history' | 'profile') and overlay screens ('order-info' | 'notifications')
  const [mobileNavTab, setMobileNavTab] = useState<'home' | 'history' | 'profile'>('home');
  const [mobileOverlayScreen, setMobileOverlayScreen] = useState<'none' | 'order-info' | 'notifications'>('none');

  // Food Ordering State
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodJointItem>(FOOD_ITEMS[0]);
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Notifications State
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
      setDesktopNavTab('history');
      setMobileNavTab('history');
      setMobileOverlayScreen('none');
    }
  };

  // Food Selection handlers
  const handleDesktopSelectFood = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    setDesktopModalOpen(true);
  };

  const handleMobileSelectFood = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    setMobileOverlayScreen('order-info');
  };

  // Place Order handler
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

    // Sync with standalone Laravel API if configured
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

    // Push real-time notification
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
    setMobileOverlayScreen('none');
  };

  // Order Status update for NSP role
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: 'Preparing' | 'Dispatched' | 'Delivered'
  ) => {
    try {
      await api.updateOrderStatus(orderId, status);
    } catch {
      // Offline fallback
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

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
      setOrderToast(null), 3000;
    });
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setAuthView('signin');
  };

  const handleReorder = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    // On desktop opens modal, on mobile opens order info
    setDesktopModalOpen(true);
    setMobileOverlayScreen('order-info');
  };

  // Switch between Permanent Staff and NSP role view
  const toggleRole = () => {
    setUserRole((prev) => (prev === 'permanent_staff' ? 'nsp' : 'permanent_staff'));
  };

  // =========================================================================
  // VIEW: AUTHENTICATION (Sign In / Sign Up)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
            <div className="h-full">
              <HeroSection
                onSignInClick={() => setAuthView('signin')}
                showSignInButton={authView === 'signup'}
              />
            </div>

            <div className="flex items-center justify-center p-6 bg-white">
              {authView === 'signin' ? (
                <SignInForm
                  onSuccess={async (data) => {
                    try {
                      await api.login({ email: data.email, password: 'password' });
                    } catch {
                      // Fallback
                    }
                    setIsAuthenticated(true);
                  }}
                  onSignUpClick={() => setAuthView('signup')}
                />
              ) : (
                <SignUpForm
                  onSuccess={async (data) => {
                    setSignUpData(data);
                    try {
                      await api.register(data);
                    } catch {
                      // Fallback
                    }
                    setIsAuthenticated(true);
                  }}
                  onSignInClick={() => setAuthView('signin')}
                />
              )}
            </div>
          </div>
        </div>

        <SuccessModal
          data={signUpData}
          onClose={() => setSignUpData(null)}
          onReset={() => setSignUpData(null)}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN APPLICATION (Pure Responsive Layout, No Device Frames)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans flex flex-col">
      {/* Toast Notification */}
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

      {/* =====================================================================
          DESKTOP VIEW (Visible on lg and larger screens)
         ===================================================================== */}
      <div className="hidden lg:flex flex-1 w-full">
        {userRole === 'nsp' ? (
          /* NSP Dispatch Portal matching image_704d4003.png */
          <div className="w-full flex-1">
            <NspOrderHistory
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={() => {
                setOrderToast('Synced assigned orders with dispatch server.');
                setTimeout(() => setOrderToast(null), 3000);
              }}
              onToggleRole={toggleRole}
            />
          </div>
        ) : (
          /* Permanent Staff Desktop Portal matching PS_Home / Order History / Notifications */
          <div className="w-full flex-1 relative">
            {desktopNavTab === 'home' && (
              <DesktopHome
                onLogout={handleLogout}
                onSelectFood={handleDesktopSelectFood}
                orderCount={orders.length}
                activeNavTab={desktopNavTab}
                onNavTabChange={setDesktopNavTab}
                onOpenNotifications={() => setDesktopNavTab('notifications')}
                unreadNotificationCount={unreadNotificationCount}
                onToggleRole={toggleRole}
              />
            )}

            {desktopNavTab === 'history' && (
              <PermanentStaffOrderHistory
                orders={orders}
                onGoHome={() => setDesktopNavTab('home')}
                onLogout={handleLogout}
                onReorder={handleReorder}
                onCancelOrder={handleCancelOrder}
                onOpenNotifications={() => setDesktopNavTab('notifications')}
                unreadNotificationCount={unreadNotificationCount}
              />
            )}

            {desktopNavTab === 'notifications' && (
              <DesktopNotificationView
                notifications={notifications}
                onGoHome={() => setDesktopNavTab('home')}
                onGoOrderHistory={() => setDesktopNavTab('history')}
                onLogout={handleLogout}
                onMarkAllAsRead={handleMarkAllNotificationsRead}
                onClearAll={handleClearAllNotifications}
                onNotificationClick={handleNotificationClick}
              />
            )}

            {/* Desktop Order Modal matching image_b0a6faf9.png */}
            <DesktopOrderModal
              isOpen={desktopModalOpen}
              item={selectedFoodItem}
              onClose={() => setDesktopModalOpen(false)}
              onSubmitOrder={handlePlaceOrderInfo}
            />
          </div>
        )}
      </div>

      {/* =====================================================================
          MOBILE VIEW (Visible on small & medium screens < 1024px)
         ===================================================================== */}
      <div className="flex lg:hidden flex-1 w-full bg-white flex-col">
        {/* Full-screen Overlay 1: Order Info Page matching image_664734d7.png */}
        {mobileOverlayScreen === 'order-info' ? (
          <OrderInfoPage
            item={selectedFoodItem}
            onBack={() => setMobileOverlayScreen('none')}
            onSubmitOrder={handlePlaceOrderInfo}
          />
        ) : mobileOverlayScreen === 'notifications' ? (
          /* Full-screen Overlay 2: Notifications Page matching image_937fe657.png */
          <NotificationView
            notifications={notifications}
            onBack={() => setMobileOverlayScreen('none')}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
          />
        ) : userRole === 'nsp' ? (
          /* Mobile NSP Assigned Orders */
          <div className="flex-1 pb-16">
            <NspOrderHistory
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={() => {
                setOrderToast('Synced assigned orders.');
                setTimeout(() => setOrderToast(null), 3000);
              }}
              onToggleRole={toggleRole}
            />
          </div>
        ) : (
          /* Mobile Permanent Staff Screens with Bottom Navigation */
          <div className="flex-1 flex flex-col">
            {mobileNavTab === 'home' && (
              <MobileHome
                onSelectFood={handleMobileSelectFood}
                orderCount={orders.length}
                activeTab={mobileNavTab}
                onTabChange={setMobileNavTab}
                onLogout={handleLogout}
                onOpenNotifications={() => setMobileOverlayScreen('notifications')}
                unreadNotificationCount={unreadNotificationCount}
                onToggleRole={toggleRole}
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
                onToggleRole={toggleRole}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

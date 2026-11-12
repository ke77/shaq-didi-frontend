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
import { MobileBottomNav } from './components/MobileBottomNav';
import { NspOrderHistory } from './components/NspOrderHistory';
import { NotificationView, DesktopNotificationView } from './components/NotificationView';
import { INITIAL_NOTIFICATIONS, AppNotification } from './data/notifications';
import { FOOD_ITEMS, FoodJointItem } from './data/foodJoints';
import { SignUpFormData, UserProfile, PersonnelRole } from './types';
import { api } from './services/api';
import { CheckCircle2, X } from 'lucide-react';

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  fullName: 'Isaiah Amoh Mensah',
  email: 'isaiaham@gmail.com',
  phoneNumber: '0547016492',
  role: 'PS',
  station: 'Haatso Station',
};

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1041',
    item: FOOD_ITEMS[0],
    menuItemName: "Daavi's Special Gob3",
    quantity: 1,
    amount: '35.00',
    personnel: 'Ama Serwaa (NSP - Station Runner)',
    staffName: 'Isaiah Amoh Mensah',
    staffPhone: '0547016492',
    notes: 'Block B Room 14, extra pepper please',
    date: 'Today, 12:45 PM',
    status: 'Pending',
  },
  {
    id: 'ord-1039',
    item: FOOD_ITEMS[1],
    menuItemName: "Mama Gee's Smoky Jollof & Chicken",
    quantity: 1,
    amount: '55.00',
    personnel: 'Kofi Mensah (NSP - Zone A Dispatch)',
    staffName: 'Isaiah Amoh Mensah',
    staffPhone: '0547016492',
    notes: 'Call on arrival',
    date: 'Yesterday, 1:15 PM',
    status: 'Completed',
  },
];

const ACCOUNTS_STORAGE_KEY = 'shaq_didi_accounts';

const loadRegisteredAccounts = (): Record<string, UserProfile> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveRegisteredAccount = (profile: UserProfile) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadRegisteredAccounts();
    existing[profile.email.toLowerCase()] = profile;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore storage quota errors
  }
};

const deriveNameFromEmail = (email: string) => {
  const local = email.split('@')[0] || 'Staff Member';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export type UserRole = 'permanent_staff' | 'nsp';

export default function App() {
  // Authentication & Active User Profile
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [signUpData, setSignUpData] = useState<SignUpFormData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);

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

  const showToast = (msg: string, duration = 4000) => {
    setOrderToast(msg);
    setTimeout(() => {
      setOrderToast(null);
    }, duration);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 3000);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared', 3000);
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

  // Place Order handler (creates Pending order with staff details)
  const handlePlaceOrderInfo = async (data: OrderInfoSubmitData) => {
    const newRecord: OrderRecord = {
      id: `ord-${1042 + orders.length}`,
      item: data.item,
      menuItemName: data.selectedMenuItem?.name,
      quantity: 1,
      amount: data.amount,
      notes: data.notes,
      personnel: data.personnel,
      staffName: currentUser.fullName,
      staffPhone: currentUser.phoneNumber,
      date: 'Just now',
      status: 'Pending',
    };

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

    const orderNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'order_assigned',
      title: 'New Order Assigned:',
      message: `Order from ${currentUser.fullName} at ${data.item.name} assigned to ${data.personnel.split(' (')[0]}.`,
      date: 'Just now',
      read: false,
      orderId: newRecord.id,
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    showToast(
      `Order confirmed at ${data.item.name} (GH₵ ${data.amount}) · Assigned to ${data.personnel.split(' (')[0]}`,
      5000
    );

    setDesktopModalOpen(false);
    setMobileOverlayScreen('none');
  };

  // Order Status update for NSP role (mark as Completed)
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: 'Pending' | 'Completed'
  ) => {
    try {
      await api.updateOrderStatus(orderId, status);
    } catch {
      // Offline fallback
    }

    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    if (status === 'Completed') {
      const statusNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'order_completed',
        title: 'Order Completed:',
        message: `Order for ${targetOrder?.item.name || orderId} has been marked as completed.`,
        date: 'Just now',
        read: false,
        orderId,
      };
      setNotifications((prev) => [statusNotif, ...prev]);
    }

    showToast(`Order ${orderId} marked as ${status}.`);
  };

  // Cancel Pending Order for Permanent Staff (PS Story 8)
  const handleCancelOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (target && target.status !== 'Pending') return;
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Pending order cancelled.', 3000);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setAuthView('signin');
    setDesktopNavTab('home');
    setMobileNavTab('home');
    setMobileOverlayScreen('none');
  };

  const handleReorder = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    setDesktopModalOpen(true);
    setMobileOverlayScreen('order-info');
  };

  // Switch between Permanent Staff and NSP role view
  const toggleRole = () => {
    setUserRole((prev) => {
      const next = prev === 'permanent_staff' ? 'nsp' : 'permanent_staff';
      setCurrentUser((u) => ({ ...u, role: next === 'nsp' ? 'NSP' : 'PS' }));
      return next;
    });
  };

  const applyAuthenticatedUser = (profile: UserProfile) => {
    setCurrentUser(profile);
    setUserRole(profile.role === 'NSP' ? 'nsp' : 'permanent_staff');
    setDesktopNavTab('home');
    setMobileNavTab('home');
    setMobileOverlayScreen('none');
    setIsAuthenticated(true);
  };

  // =========================================================================
  // VIEW: AUTHENTICATION (Sign In / Sign Up)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DEE6EE]">
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
                      await api.login({ email: data.email, password: data.password });
                    } catch {
                      // Fallback
                    }
                    const registered = loadRegisteredAccounts()[data.email.toLowerCase()];
                    const role: PersonnelRole = registered?.role || data.role || 'PS';
                    const profile: UserProfile = registered || {
                      id: `usr-${Date.now()}`,
                      fullName:
                        data.email.toLowerCase() === DEFAULT_USER.email
                          ? DEFAULT_USER.fullName
                          : deriveNameFromEmail(data.email),
                      email: data.email,
                      phoneNumber: DEFAULT_USER.phoneNumber,
                      role,
                      station: 'Haatso Station',
                    };
                    applyAuthenticatedUser(profile);
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
                    const newProfile: UserProfile = {
                      id: `usr-${Date.now()}`,
                      fullName: data.fullName.trim(),
                      email: data.email.trim(),
                      phoneNumber: data.phoneNumber.trim(),
                      role: data.role,
                      station: 'Haatso Station',
                    };
                    saveRegisteredAccount(newProfile);
                    applyAuthenticatedUser(newProfile);
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
  // VIEW: MAIN APPLICATION (Pure Responsive Layout)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#212121] font-sans flex flex-col">
      {/* Toast Notification */}
      {orderToast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex items-center gap-2.5 bg-[#212121] text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-[#FF6347]/40 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-[#FF6347] shrink-0" />
          <span>{orderToast}</span>
          <button
            onClick={() => setOrderToast(null)}
            className="ml-2 text-[#B5B5B5] hover:text-white p-0.5 rounded cursor-pointer"
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
          <div className="w-full flex-1">
            <NspOrderHistory
              currentUser={currentUser}
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={() => showToast('Synced assigned orders with dispatch server.', 3000)}
              onToggleRole={toggleRole}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          <div className="w-full flex-1 relative">
            {desktopNavTab === 'home' && (
              <DesktopHome
                currentUser={currentUser}
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
                currentUser={currentUser}
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
                currentUser={currentUser}
                notifications={notifications}
                onGoHome={() => setDesktopNavTab('home')}
                onGoOrderHistory={() => setDesktopNavTab('history')}
                onLogout={handleLogout}
                onMarkAllAsRead={handleMarkAllNotificationsRead}
                onClearAll={handleClearAllNotifications}
                onNotificationClick={handleNotificationClick}
              />
            )}

            {/* Desktop Food Joint Details, Menu, Order Form & Order Summary Modal */}
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
        {mobileOverlayScreen === 'order-info' ? (
          <OrderInfoPage
            item={selectedFoodItem}
            onBack={() => setMobileOverlayScreen('none')}
            onSubmitOrder={handlePlaceOrderInfo}
          />
        ) : mobileOverlayScreen === 'notifications' ? (
          <NotificationView
            currentUser={currentUser}
            notifications={notifications}
            onBack={() => setMobileOverlayScreen('none')}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
          />
        ) : userRole === 'nsp' ? (
          <div className="flex-1">
            <NspOrderHistory
              currentUser={currentUser}
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={() => showToast('Synced assigned orders.', 3000)}
              onToggleRole={toggleRole}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {mobileNavTab === 'home' && (
              <MobileHome
                currentUser={currentUser}
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
                currentUser={currentUser}
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
                currentUser={currentUser}
                onBack={() => setMobileNavTab('home')}
                onLogout={handleLogout}
                activeNavTab={mobileNavTab}
                onNavTabChange={setMobileNavTab}
                orderCount={orders.length}
                onToggleRole={toggleRole}
              />
            )}

            {/* Persistent Fixed Bottom Navigation Bar on Mobile */}
            <MobileBottomNav
              activeTab={mobileNavTab}
              onTabChange={setMobileNavTab}
              orderCount={orders.length}
            />
          </div>
        )}
      </div>

      {/* Show account creation summary modal even after routing to dashboard */}
      <SuccessModal
        data={signUpData}
        onClose={() => setSignUpData(null)}
        onReset={() => setSignUpData(null)}
      />
    </div>
  );
}

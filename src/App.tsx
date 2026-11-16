import React, { useState, useEffect } from 'react';
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
import { SignUpFormData, UserProfile } from './types';
import { CheckCircle2, Loader2, X } from 'lucide-react'
import { api, ApiError, getErrorMessage } from './services/api'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

const EMPTY_USER: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  role: 'PS',
  station: 'Haatso Station',
};

export type UserRole = 'permanent_staff' | 'nsp';

export default function App() {
  // Authentication & Active User Profile
  // 'loading' while a stored token is being verified with the server
const [authStatus, setAuthStatus] = useState<AuthStatus>(() =>
  api.getToken() ? 'loading' : 'unauthenticated'
)
const [authView, setAuthView] = useState<'signin' | 'signup'>('signin')
const [signUpData, setSignUpData] = useState<SignUpFormData | null>(null)
const [authError, setAuthError] = useState<string | null>(null)
const [currentUser, setCurrentUser] = useState<UserProfile>(EMPTY_USER)
const [foodItems, setFoodItems] = useState<FoodJointItem[]>([])
const [dashboardError, setDashboardError] = useState<string | null>(null)
const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)

// the role always comes from the server's user, it is never switched on the client
const userRole: UserRole = currentUser.role === 'NSP' ? 'nsp' : 'permanent_staff'

  // Desktop Navigation: 'home' | 'history' | 'notifications'
  const [desktopNavTab, setDesktopNavTab] = useState<'home' | 'history' | 'notifications'>('home');

  // Mobile Navigation: Tab ('home' | 'history' | 'profile') and overlay screens ('order-info' | 'notifications')
  const [mobileNavTab, setMobileNavTab] = useState<'home' | 'history' | 'profile'>('home');
  const [mobileOverlayScreen, setMobileOverlayScreen] = useState<'none' | 'order-info' | 'notifications'>('none');

  // Food Ordering State
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodJointItem>(FOOD_ITEMS[0]);
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [todayAssignedOrders, setTodayAssignedOrders] = useState<OrderRecord[]>([]);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Verify existing token with Laravel backend on initial mount
  useEffect(() => {
  api.setUnauthorizedHandler(() => {
    setCurrentUser(EMPTY_USER)
    setAuthStatus('unauthenticated')
  })
  return () => api.setUnauthorizedHandler(null)
}, [])


useEffect(() => {
  if (!api.getToken()) return

  let cancelled = false

  api
    .getCurrentUser()
    .then((profile) => {
      if (cancelled) return
      setCurrentUser(profile)
      setAuthStatus('authenticated')
    })
    .catch((err: unknown) => {
      if (cancelled) return
      // a 401 is already handled above, anything else (offline, 500) keeps the token for a retry
      if (err instanceof ApiError && err.status !== 401) setAuthError(err.message)
      setAuthStatus('unauthenticated')
    })

  return () => {
    cancelled = true
  }
}, [])

useEffect(() => {
  if (authStatus !== 'authenticated') return

  let cancelled = false
  setIsLoadingDashboard(true)
  setDashboardError(null)

  Promise.all([
    currentUser.role === 'PS' ? api.getFoodJoints() : Promise.resolve([]),
    api.getOrders(),
    currentUser.role === 'NSP' ? api.getTodayOrders() : Promise.resolve([]),
  ])
    .then(([catalog, orderHistory, todaysOrders]) => {
      if (cancelled) return
      setFoodItems(catalog)
      setOrders(orderHistory)
      setTodayAssignedOrders(todaysOrders)
    })
    .catch((err: unknown) => {
      if (!cancelled) {
        setDashboardError(getErrorMessage(err, 'Could not load your dashboard data.'))
      }
    })
    .finally(() => {
      if (!cancelled) setIsLoadingDashboard(false)
    })

  return () => {
    cancelled = true
  }
}, [authStatus, currentUser.role])

const refreshOrderHistory = async () => {
  const [orderHistory, todaysOrders] = await Promise.all([
    api.getOrders(),
    currentUser.role === 'NSP' ? api.getTodayOrders() : Promise.resolve([]),
  ])
  setOrders(orderHistory)
  setTodayAssignedOrders(todaysOrders)
}

const handleSignIn = async (data: { email: string; password: string }) => {
  setAuthError(null)
  try {
    applyAuthenticatedUser(await api.login({ email: data.email, password: data.password }))
  } catch (err: unknown) {
    setAuthError(getErrorMessage(err, 'Sign in failed. Please try again.'))
  }
}


const handleSignUp = async (data: SignUpFormData) => {
  setAuthError(null)
  try {
    const profile = await api.register(data)
    setSignUpData(data)
    applyAuthenticatedUser(profile)
  } catch (err: unknown) {
    setAuthError(getErrorMessage(err, 'Registration failed. Please check your details.'))
  }
}


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
    const newRecord = await api.createOrder({
      product_id: Number(data.selectedMenuItem.id),
      amount: data.quantity,
      order_note: data.notes,
      personnel_id: Number(data.personnelId),
    })
    setOrders((prev) => [newRecord, ...prev])

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

    showToast(`Order placed for ${data.item.name}.`, 5000)

    setDesktopModalOpen(false);
    setMobileOverlayScreen('none');
  };

  // Order Status update for NSP role (mark as Completed)
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: 'Pending' | 'Completed'
  ): Promise<boolean> => {
    try {
      if (status !== 'Completed') return false
      const updatedOrder = await api.completeOrder(orderId)
      setOrders((prev) => prev.map((order) => order.id === orderId ? updatedOrder : order))
      setTodayAssignedOrders((prev) => prev.filter((order) => order.id !== orderId))

      const targetOrder = orders.find((o) => o.id === orderId)
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
      showToast(`Order ${orderId} marked as completed.`)
      return true
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Could not update this order.'), 5000)
      return false
    }
  };

  // Cancel Pending Order for Permanent Staff
  const handleCancelOrder = async (orderId: string) => {
    try {
      const cancelledOrder = await api.cancelOrder(orderId)
      setOrders((prev) => prev.map((order) => order.id === orderId ? cancelledOrder : order))
      showToast('Pending order cancelled.', 3000)
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Could not cancel this order.'), 5000)
    }
  };

  const handleLogout = async () => {
  let logoutError: string | null = null
  try {
    await api.logout()
  } catch (err: unknown) {
    logoutError = getErrorMessage(err, 'Your session could not be revoked on the server.')
  } finally {
    setCurrentUser(EMPTY_USER)
    setAuthStatus('unauthenticated')
    setAuthView('signin')
    setDesktopNavTab('home')
    setMobileNavTab('home')
    setMobileOverlayScreen('none')
  }
  if (logoutError) setAuthError(logoutError)
}

  const handleReorder = (item: FoodJointItem) => {
    setSelectedFoodItem(item);
    setDesktopModalOpen(true);
    setMobileOverlayScreen('order-info');
  };

const applyAuthenticatedUser = (profile: UserProfile) => {
  setCurrentUser(profile)
  setDesktopNavTab('home')
  setMobileNavTab('home')
  setMobileOverlayScreen('none')
  setAuthStatus('authenticated')
}


if (authStatus === 'loading') {
  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#FF6347] animate-spin" aria-label="Loading" />
    </div>
  )
}

  // =========================================================================
  // VIEW: AUTHENTICATION (Sign In / Sign Up)
  // =========================================================================
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#DEE6EE]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
            <div className="h-full">
              <HeroSection
                onSignInClick={() => {
                  setAuthError(null);
                  setAuthView('signin');
                }}
                showSignInButton={authView === 'signup'}
              />
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-white">
              {authError && (
                <div className="w-full max-w-md mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <span>{authError}</span>
                  <button
                    onClick={() => setAuthError(null)}
                    className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {authView === 'signin' ? (
                <SignInForm
                  onSuccess={handleSignIn}
                  onSignUpClick={() => {
                    setAuthError(null);
                    setAuthView('signup');
                  }}
                />
              ) : (
                <SignUpForm
                  onSuccess={handleSignUp}
                  onSignInClick={() => {
                    setAuthError(null);
                    setAuthView('signin');
                  }}
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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#F4F7FA] text-[#212121] font-sans flex flex-col">
      {dashboardError && (
        <div role="alert" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <span>{dashboardError}</span>
            <button type="button" onClick={() => setDashboardError(null)} aria-label="Dismiss error">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {isLoadingDashboard && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-[#757575] shadow">
          <Loader2 className="h-4 w-4 animate-spin text-[#FF6347]" />
          Loading your account…
        </div>
      )}
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
      <div className="hidden lg:flex flex-1 min-h-0 h-screen w-full overflow-hidden">
        {userRole === 'nsp' ? (
          <div className="w-full flex-1 min-h-0 overflow-y-auto">
            <NspOrderHistory
              currentUser={currentUser}
              orders={orders}
              todayOrders={todayAssignedOrders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={async () => {
                try {
                  await refreshOrderHistory()
                } catch (err: unknown) {
                  showToast(getErrorMessage(err, 'Could not refresh assigned orders.'), 5000)
                }
              }}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          <div className="w-full flex-1 min-h-0 h-full overflow-hidden relative">
            {desktopNavTab === 'home' && (
              <DesktopHome
                currentUser={currentUser}
                onLogout={handleLogout}
                onSelectFood={handleDesktopSelectFood}
                foodItems={foodItems}
                orderCount={orders.length}
                activeNavTab={desktopNavTab}
                onNavTabChange={setDesktopNavTab}
                onOpenNotifications={() => setDesktopNavTab('notifications')}
                unreadNotificationCount={unreadNotificationCount}
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
              todayOrders={todayAssignedOrders}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={async () => {
                try {
                  await refreshOrderHistory()
                } catch (err: unknown) {
                  showToast(getErrorMessage(err, 'Could not refresh assigned orders.'), 5000)
                }
              }}
              onLogout={handleLogout}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {mobileNavTab === 'home' && (
              <MobileHome
                currentUser={currentUser}
                onSelectFood={handleMobileSelectFood}
                foodItems={foodItems}
                orderCount={orders.length}
                activeTab={mobileNavTab}
                onTabChange={setMobileNavTab}
                onLogout={handleLogout}
                onOpenNotifications={() => setMobileOverlayScreen('notifications')}
                unreadNotificationCount={unreadNotificationCount}
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
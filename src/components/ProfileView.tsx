import React from 'react';
import { ArrowLeft, LogOut, Home, History, User, ArrowLeftRight } from 'lucide-react';

interface ProfileViewProps {
  onBack?: () => void;
  onLogout: () => void;
  isStandaloneScreen?: boolean;
  activeNavTab?: 'home' | 'history' | 'profile';
  onNavTabChange?: (tab: 'home' | 'history' | 'profile') => void;
  orderCount?: number;
  onToggleRole?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onBack,
  onLogout,
  isStandaloneScreen = false,
  activeNavTab,
  onNavTabChange,
  orderCount = 0,
  onToggleRole,
}) => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none relative">
      {/* Main Profile Content matching image_5e001cd4.png */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col p-6 pb-24">
        {/* Top Bar: Circular Back Button & Profile Title */}
        <div className="flex items-center gap-3.5 mb-8 pt-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-800 stroke-[2.5]" />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Profile
          </h1>
        </div>

        {/* User Identity Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          {/* Avatar: Coral/Red circle with "IA" */}
          <div className="w-14 h-14 rounded-full bg-[#FF5745] text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-sm shrink-0">
            IA
          </div>

          {/* User Details */}
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Isaiah Amoh Mensah
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
              isaiaham@gmail.com
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
              0547016492
            </p>
          </div>
        </div>

        {/* Action Row: Logout matching screenshot */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 text-slate-700 hover:text-[#E53935] font-medium text-sm sm:text-base transition-colors cursor-pointer group w-full text-left"
          >
            <LogOut className="w-5 h-5 text-slate-700 group-hover:text-[#E53935] transition-colors shrink-0" />
            <span>Logout</span>
          </button>

          {onToggleRole && (
            <button
              type="button"
              onClick={onToggleRole}
              className="mt-6 flex items-center justify-between p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 hover:bg-red-50/50 hover:border-red-200 text-slate-700 hover:text-[#E53935] font-semibold text-xs transition-all cursor-pointer w-full text-left"
            >
              <div className="flex items-center gap-2.5">
                <ArrowLeftRight className="w-4 h-4 text-[#E53935]" />
                <span>NSP Dispatch Portal View</span>
              </div>
              <span className="text-[10px] text-slate-400">Switch →</span>
            </button>
          )}
        </div>
      </div>

        {/* Optional Mobile Bottom Navigation Bar when embedded in mobile app */}
        {onNavTabChange && activeNavTab && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-6 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-around max-w-sm mx-auto">
              {/* Tab 1: Home */}
              <button
                type="button"
                onClick={() => onNavTabChange('home')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                  activeNavTab === 'home' ? 'text-[#E53935]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
              </button>

              {/* Tab 2: Order History */}
              <button
                type="button"
                onClick={() => onNavTabChange('history')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
                  activeNavTab === 'history' ? 'text-[#E53935]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <History className="w-5 h-5" />
                <span className="text-[10px] font-medium">Order History</span>
                {orderCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#E53935] text-white text-[9px] font-bold px-1 rounded-full">
                    {orderCount}
                  </span>
                )}
              </button>

              {/* Tab 3: Profile (Active) */}
              <button
                type="button"
                onClick={() => onNavTabChange('profile')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                  activeNavTab === 'profile' ? 'text-[#E53935]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Profile</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    );
};

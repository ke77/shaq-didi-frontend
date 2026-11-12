import React from 'react';
import { ArrowLeft, LogOut, ArrowLeftRight } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  onBack?: () => void;
  onLogout: () => void;
  isStandaloneScreen?: boolean;
  activeNavTab?: 'home' | 'history' | 'profile';
  onNavTabChange?: (tab: 'home' | 'history' | 'profile') => void;
  orderCount?: number;
  onToggleRole?: () => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'IA';

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onBack,
  onLogout,
  onToggleRole,
}) => {
  const initials = getInitials(currentUser.fullName);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none relative">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col p-6 pb-24">
        <div className="flex items-center gap-3.5 mb-8 pt-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border border-[#DEE6EE] shadow-xs flex items-center justify-center text-[#212121] hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#212121] stroke-[2.5]" />
            </button>
          )}
          <h1 className="text-xl font-bold text-[#212121] tracking-tight">
            Profile
          </h1>
        </div>

        {/* User Identity Section */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#DEE6EE]">
          <div className="w-14 h-14 rounded-full bg-[#FF6E6A] text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-sm shrink-0">
            {initials}
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#212121] leading-snug truncate">
              {currentUser.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-[#757575] font-normal mt-0.5 truncate">
              {currentUser.email}
            </p>
            <p className="text-xs sm:text-sm text-[#757575] font-normal mt-0.5 tabular-nums">
              {currentUser.phoneNumber}
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 text-[#212121] hover:text-[#E53935] font-medium text-sm sm:text-base transition-colors cursor-pointer group w-full text-left"
          >
            <LogOut className="w-5 h-5 text-[#757575] group-hover:text-[#E53935] transition-colors shrink-0" />
            <span>Logout</span>
          </button>

          {onToggleRole && (
            <button
              type="button"
              onClick={onToggleRole}
              className="mt-6 flex items-center justify-between p-3.5 rounded-xl border border-dashed border-[#CDD5E1] bg-[#F4F7FA] hover:bg-[#FFEBE7]/50 hover:border-[#FF6347]/50 text-[#212121] hover:text-[#E53935] font-semibold text-xs transition-all cursor-pointer w-full text-left"
            >
              <div className="flex items-center gap-2.5">
                <ArrowLeftRight className="w-4 h-4 text-[#FF6347]" />
                <span>NSP Dispatch Portal View</span>
              </div>
              <span className="text-[10px] text-[#B5B5B5]">Switch →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

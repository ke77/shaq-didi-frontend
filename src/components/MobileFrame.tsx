import React from 'react';
import { HeroSection } from './HeroSection';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';
import { SignUpFormData } from '../types';

interface MobileFrameProps {
  authPage: 'signin' | 'signup';
  onSignUpSuccess: (data: SignUpFormData) => void;
  onSignInSuccess: (data: { email: string }) => void;
  onToggleAuthPage: (page: 'signin' | 'signup') => void;
  isStandaloneDevice?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  authPage,
  onSignUpSuccess,
  onSignInSuccess,
  onToggleAuthPage,
  isStandaloneDevice = true,
}) => {
  const isSignIn = authPage === 'signin';

  const innerContent = (
    <div className="bg-white flex flex-col min-h-[640px] w-full overflow-hidden">
      {/* Top Mobile Hero Card with rounded bottom */}
      <HeroSection
        onSignInClick={() => onToggleAuthPage('signin')}
        isMobileVariant={true}
        showSignInButton={false}
      />

      {/* Form Content */}
      <div className="flex-1 pb-6 pt-2">
        {isSignIn ? (
          <SignInForm
            onSuccess={onSignInSuccess}
            onSignUpClick={() => onToggleAuthPage('signup')}
            isMobileLayout={true}
          />
        ) : (
          <SignUpForm
            onSuccess={onSignUpSuccess}
            onSignInClick={() => onToggleAuthPage('signin')}
            isMobileLayout={true}
          />
        )}
      </div>
    </div>
  );

  if (!isStandaloneDevice) {
    return innerContent;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Phone Shell */}
      <div className="relative w-[340px] sm:w-[360px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border border-slate-700/80 ring-1 ring-black/40">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Screen Container */}
        <div className="rounded-[2rem] overflow-hidden bg-white shadow-inner">
          {innerContent}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400 font-medium tracking-wide">
        Mobile Services View ({isSignIn ? 'Sign In' : 'Sign Up'})
      </p>
    </div>
  );
};

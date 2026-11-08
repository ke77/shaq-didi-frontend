import React from 'react';

interface HeroSectionProps {
  onSignInClick?: () => void;
  isMobileVariant?: boolean;
  showSignInButton?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSignInClick,
  isMobileVariant = false,
  showSignInButton = true,
}) => {
  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-center items-center text-center select-none ${
        isMobileVariant
          ? 'h-64 sm:h-72 rounded-b-[2rem] px-6 py-8'
          : 'h-full min-h-[580px] lg:min-h-full px-8 py-16'
      }`}
    >
      {/* Background Image with Fallback Scrim */}
      <img
        src="/src/assets/images/shaq_didi_food_table_1793810511571.jpg"
        alt="ShaQ DIDI gourmet dining spread"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Atmospheric Dark Overlay Scrim matching mockup */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75 backdrop-brightness-[0.82]" />

      {/* Subtle vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md mx-auto">
        {/* Welcome to */}
        <h1
          className={`font-semibold tracking-tight text-white drop-shadow-sm ${
            isMobileVariant ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
          }`}
        >
          Welcome to
        </h1>

        {/* Brand Name: ShaQ DIDI */}
        <div
          className={`font-extrabold tracking-tight mt-1 mb-2 drop-shadow-md ${
            isMobileVariant ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
          }`}
        >
          <span className="text-[#E53935] drop-shadow-[0_2px_10px_rgba(229,57,53,0.35)]">
            ShaQ
          </span>{' '}
          <span className="text-white">DIDI</span>
        </div>

        {/* Subtitle / Tagline */}
        <p
          className={`text-slate-200 font-normal leading-relaxed mb-6 drop-shadow-sm ${
            isMobileVariant ? 'text-xs max-w-[240px]' : 'text-xs sm:text-sm max-w-[280px]'
          }`}
        >
          Assign a Personnel, Simplify Your Order!
        </p>

        {/* Sign In Button (Ghost / Outline style from mockup, only on Sign Up page) */}
        {!isMobileVariant && showSignInButton && onSignInClick && (
          <button
            type="button"
            onClick={onSignInClick}
            className="inline-flex items-center justify-center px-10 py-2.5 rounded-md border border-white/80 bg-white/5 hover:bg-white/15 text-white text-sm font-medium tracking-wide shadow-sm backdrop-blur-xs transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Sign In with existing personnel account"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

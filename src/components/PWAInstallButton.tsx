import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'sidebar' }> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 rounded-lg bg-[#FF6347] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#E53935] transition-colors cursor-pointer ${
          variant === 'sidebar' ? 'w-full justify-center py-2' : ''
        }`}
        title="Install ShaQ DIDI as an app on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-[#DEE6EE] bg-white px-2.5 py-1 text-xs font-semibold text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer ${
            variant === 'sidebar' ? 'w-full justify-center py-2' : ''
          }`}
          title="Install on iOS Home Screen"
        >
          <Download className="w-3.5 h-3.5 text-[#FF6347]" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212121]/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#DEE6EE] text-left relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute right-3.5 top-3.5 text-[#B5B5B5] hover:text-[#212121] p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#FF6347] flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212121]">Install ShaQ DIDI</h3>
                  <p className="text-xs text-[#757575]">Add to your iPhone / iPad Home Screen</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#212121] bg-[#F4F7FA] p-3.5 rounded-xl border border-[#DEE6EE]">
                <div className="flex items-start gap-2.5">
                  <Share2 className="w-4 h-4 text-[#757575] shrink-0 mt-0.5" />
                  <p>1. Tap the <strong>Share</strong> button in the bottom Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <PlusSquare className="w-4 h-4 text-[#757575] shrink-0 mt-0.5" />
                  <p>2. Scroll down and choose <strong>Add to Home Screen</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-[#212121] py-2.5 text-xs font-semibold text-white hover:bg-[#212121]/90 transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowIOSGuide(true)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[#DEE6EE] bg-white px-2.5 py-1 text-xs font-semibold text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer ${
          variant === 'sidebar' ? 'w-full justify-center py-2' : ''
        }`}
        title="Install ShaQ DIDI PWA"
      >
        <Download className="w-3.5 h-3.5 text-[#FF6347]" />
        <span>Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212121]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#DEE6EE] text-left relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute right-3.5 top-3.5 text-[#B5B5B5] hover:text-[#212121] p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FF6347] flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <div>
                <h3 className="text-base font-bold text-[#212121]">Install ShaQ DIDI</h3>
                <p className="text-xs text-[#757575]">Add to your Home Screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#212121] bg-[#F4F7FA] p-3.5 rounded-xl border border-[#DEE6EE]">
              <p>In your browser menu (or address bar), tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-lg bg-[#212121] py-2.5 text-xs font-semibold text-white hover:bg-[#212121]/90 transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

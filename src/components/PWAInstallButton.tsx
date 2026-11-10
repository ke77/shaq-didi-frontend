import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'sidebar' }> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 rounded-lg bg-[#E53935] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#c62828] transition-colors cursor-pointer ${
          variant === 'sidebar' ? 'w-full justify-center py-2' : ''
        }`}
        title="Install ShaQ DIDI as an app on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer ${
            variant === 'sidebar' ? 'w-full justify-center py-2' : ''
          }`}
          title="Install on iOS Home Screen"
        >
          <Download className="w-3.5 h-3.5 text-[#E53935]" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-left relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Install ShaQ DIDI</h3>
                  <p className="text-xs text-slate-500">Add to your iPhone / iPad Home Screen</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <Share2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p>1. Tap the <strong>Share</strong> button in the bottom Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <PlusSquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p>2. Scroll down and choose <strong>Add to Home Screen</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback demo install button (shows the in-app modal guide without triggering window.alert)
  return (
    <>
      <button
        onClick={() => setShowIOSGuide(true)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer ${
          variant === 'sidebar' ? 'w-full justify-center py-2' : ''
        }`}
        title="Install ShaQ DIDI PWA"
      >
        <Download className="w-3.5 h-3.5 text-[#E53935]" />
        <span>Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-left relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Install ShaQ DIDI</h3>
                <p className="text-xs text-slate-500">Add to your Home Screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p>In your browser menu (or address bar), tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

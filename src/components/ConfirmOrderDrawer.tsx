'use client';

import React from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { X, Loader2, Check } from 'lucide-react';

interface ConfirmOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  notes: string;
  personnel: string;
  isSubmitting?: boolean;
  isSuccess?: boolean;
}

export const ConfirmOrderDrawer: React.FC<ConfirmOrderDrawerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  notes,
  personnel,
  isSubmitting = false,
  isSuccess = false,
}) => {
  // Format amount e.g. "43" -> "GHC 43" or keep if already prefixed
  const formattedAmount = amount
    ? amount.toUpperCase().includes('GHC') || amount.toUpperCase().includes('GH')
      ? amount
      : `GHC ${amount}`
    : 'GHC 0';

  // Format personnel name (extract plain name if role is appended)
  const displayName = personnel ? personnel.split(' (')[0] : 'Unassigned';

  const displayNotes =
    notes && notes.trim().length > 0
      ? notes.trim()
      : 'No special instructions provided.';

  // Handle drag to dismiss down
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 450) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
          {/* Dimmed backdrop overlay covering Order Info screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-up bottom drawer card with smooth spring and drag dismiss */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 260,
              mass: 0.85,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="relative z-10 w-full bg-white rounded-t-[2rem] pt-3 pb-3 px-5 shadow-2xl flex flex-col border-t border-slate-100 touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle pill */}
            <div className="w-14 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-2 shrink-0 cursor-grab active:cursor-grabbing transition-colors" />

            {/* Header: Order Summary + Close (X) icon */}
            <div className="flex items-center justify-between pb-3 pt-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Order Summary
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Summary Card Container matching image_9f9343e4.png */}
            <div className="bg-[#F8F9FA] rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 space-y-3.5 mb-4 shadow-xs">
              {/* Amount row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 tracking-tight">Amount</span>
                <span className="font-semibold text-slate-600">{formattedAmount}</span>
              </div>

              {/* Note row */}
              <div>
                <span className="font-bold text-slate-900 text-xs block mb-1 tracking-tight">
                  Note
                </span>
                <p className="text-xs text-slate-600 leading-relaxed break-words font-normal">
                  {displayNotes}
                </p>
              </div>

              {/* Assigned Personnel row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="font-bold text-slate-900 tracking-tight">
                  Assigned Personnel
                </span>
                <span className="font-medium text-slate-600 text-right">
                  {displayName}
                </span>
              </div>
            </div>

            {/* Action Button: Confirm Order */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting || isSuccess}
                className="w-full py-3.5 px-6 rounded-full bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white font-semibold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-white stroke-[2.5]" />
                    <span>Order Confirmed!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>

            {/* Bottom Screen Indicator Bar matching smartphone UI */}
            <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-4 mb-1 shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

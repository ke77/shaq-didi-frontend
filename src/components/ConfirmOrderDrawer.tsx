'use client';

import React from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { X, Loader2, Check } from 'lucide-react';

interface ConfirmOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jointName?: string;
  jointAddress?: string;
  menuItemName?: string;
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
  jointName,
  jointAddress,
  menuItemName,
  amount,
  notes,
  personnel,
  isSubmitting = false,
  isSuccess = false,
}) => {
  const formattedAmount = amount
    ? amount.toUpperCase().includes('GHC') || amount.toUpperCase().includes('GH')
      ? amount
      : `GH₵ ${amount}`
    : 'GH₵ 0';

  const displayName = personnel ? personnel.split(' (')[0] : 'Unassigned';

  const displayNotes =
    notes && notes.trim().length > 0
      ? notes.trim()
      : 'No special instructions provided.';

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 450) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden">
          {/* Dimmed backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-[#212121]/60 backdrop-blur-[2px] cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-up bottom drawer card */}
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
            className="relative z-10 w-full max-w-md mx-auto bg-white rounded-t-[2rem] pt-3 pb-6 px-5 shadow-2xl flex flex-col border-t border-[#DEE6EE] touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle pill */}
            <div className="w-14 h-1.5 bg-[#CDD5E1] hover:bg-[#B5B5B5] rounded-full mx-auto mb-2 shrink-0 cursor-grab active:cursor-grabbing transition-colors" />

            {/* Header: Order Summary + Close (X) icon */}
            <div className="flex items-center justify-between pb-3 pt-1">
              <h3 className="text-base sm:text-lg font-bold text-[#212121] tracking-tight">
                Order Summary
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Summary Card Container */}
            <div className="bg-[#F4F7FA] rounded-2xl p-4 border border-[#DEE6EE] space-y-3 mb-4">
              {jointName && (
                <div className="pb-2.5 border-b border-[#DEE6EE]">
                  <span className="font-bold text-[#212121] text-sm block leading-snug">
                    {jointName}
                  </span>
                  {jointAddress && (
                    <span className="text-[11px] text-[#757575] block mt-0.5">
                      {jointAddress}
                    </span>
                  )}
                </div>
              )}

              {menuItemName && (
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#212121] tracking-tight shrink-0">Item</span>
                  <span className="font-medium text-[#757575] text-right truncate">
                    {menuItemName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#212121] tracking-tight">Amount</span>
                <span className="font-bold text-[#E53935] tabular-nums">{formattedAmount}</span>
              </div>

              <div>
                <span className="font-bold text-[#212121] text-xs block mb-1 tracking-tight">
                  Note
                </span>
                <p className="text-xs text-[#757575] leading-relaxed break-words font-normal">
                  {displayNotes}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="font-bold text-[#212121] tracking-tight">
                  Assigned Personnel
                </span>
                <span className="font-semibold text-[#212121] text-right">
                  {displayName}
                </span>
              </div>
            </div>

            {/* Action Buttons: Cancel & Confirm Order (PS Story 6) */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isSuccess}
                className="flex-1 py-3.5 px-4 rounded-full border border-[#DEE6EE] bg-white hover:bg-[#F4F7FA] text-[#757575] hover:text-[#212121] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting || isSuccess}
                className="flex-[1.6] py-3.5 px-6 rounded-full bg-[#FF6347] hover:bg-[#E53935] active:bg-[#E53935] text-white font-semibold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-white stroke-[2.5]" />
                    <span>Confirmed!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

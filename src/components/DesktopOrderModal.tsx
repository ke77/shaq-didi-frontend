import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FoodJointItem } from '../data/foodJoints';
import { ChevronDown, Check, UserCheck, MapPin } from 'lucide-react';
import { AVAILABLE_PERSONNEL, OrderInfoSubmitData } from './OrderInfoPage';

interface DesktopOrderModalProps {
  isOpen: boolean;
  item: FoodJointItem | null;
  onClose: () => void;
  onSubmitOrder: (data: OrderInfoSubmitData) => void;
}

const AMOUNT_PRESETS = ['25', '35', '50', '75'];
const NOTE_SUGGESTIONS = [
  'Extra shito please',
  'Pack salad separately',
  'More gari on top',
];

export const DesktopOrderModal: React.FC<DesktopOrderModalProps> = ({
  isOpen,
  item,
  onClose,
  onSubmitOrder,
}) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; personnel?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const validate = () => {
    const errs: { amount?: string; personnel?: string } = {};
    const numericAmount = Number(amount.replace(/[^0-9.]/g, ''));
    if (!amount.trim()) {
      errs.amount = 'Please enter the amount you want to buy';
    } else if (isNaN(numericAmount) || numericAmount <= 0) {
      errs.amount = 'Please enter a valid amount';
    }

    if (!selectedPersonnel) {
      errs.personnel = 'Please select a personnel to handle your order';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrderNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSubmitOrder({
          item,
          amount: amount.trim(),
          notes: notes.trim(),
          personnel: selectedPersonnel,
          personnelId: selectedPersonnelId || undefined,
        });
        setIsSuccess(false);
        setAmount('');
        setNotes('');
        setSelectedPersonnel('');
        setSelectedPersonnelId('');
      }, 600);
    }, 400);
  };

  const handleAddNoteSuggestion = (suggestion: string) => {
    setNotes((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return suggestion;
      if (trimmed.toLowerCase().includes(suggestion.toLowerCase())) return trimmed;
      return `${trimmed}, ${suggestion}`;
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[530px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-150 my-auto">
        <div className="relative w-full h-40 sm:h-44 bg-slate-900 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute bottom-3.5 left-5 right-5 text-white">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm leading-snug">
              {item.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 font-normal mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{item.location}</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleOrderNow} className="p-6 sm:p-7 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
                Amount
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#757575] pointer-events-none">
                GH₵
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Enter the Amount you want to buy"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                className={`w-full pl-12 pr-4 py-2.5 rounded-lg border text-xs sm:text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors focus:outline-none ${
                  errors.amount
                    ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                    : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
                }`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {AMOUNT_PRESETS.map((preset) => {
                const isActive = amount.trim() === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold tabular-nums transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFEBE7] text-[#E53935] border-[#FF6E6A]/60'
                        : 'bg-[#F4F7FA] text-[#757575] border-[#DEE6EE] hover:border-[#CDD5E1] hover:text-[#212121]'
                    }`}
                  >
                    GH₵ {preset}
                  </button>
                );
              })}
            </div>
            {errors.amount && (
              <p className="text-[11px] text-[#E53935] mt-1 font-medium">{errors.amount}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
                Leave a Note
              </label>
              <span className="text-[11px] text-slate-400">Special requests for joint</span>
            </div>
            <textarea
              rows={3}
              placeholder="Add any special instructions or requests (e.g. Buy Waakye 15gh, Fish 20gh, Salad 4gh)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] resize-none"
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {NOTE_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddNoteSuggestion(sug)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
              Select available Personnel
            </label>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 mb-2 font-normal">
              Choose who will handle this order
            </p>
            <div className="relative">
              <select
                value={selectedPersonnel}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPersonnel(val);
                  const found = AVAILABLE_PERSONNEL.find((p) => `${p.name} (${p.role})` === val);
                  setSelectedPersonnelId(found ? found.id : '');
                  if (errors.personnel) setErrors((prev) => ({ ...prev, personnel: undefined }));
                }}
                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-xs sm:text-sm text-slate-700 bg-white appearance-none transition-colors focus:outline-none cursor-pointer ${
                  errors.personnel
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                    : 'border-slate-200 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                }`}
              >
                <option value="">Select available runner</option>
                {AVAILABLE_PERSONNEL.map((p) => (
                  <option key={p.id} value={`${p.name} (${p.role})`}>
                    {p.name} - {p.role} ({p.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.personnel && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.personnel}</p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md border border-[#E53935] text-[#E53935] hover:bg-red-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-6 py-2 rounded-md bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-85 flex items-center gap-1.5"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Placed!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <UserCheck className="w-4 h-4 animate-pulse" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Order Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

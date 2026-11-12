import React, { useState, useEffect } from 'react';
import { FoodJointItem, MenuItem } from '../data/foodJoints';
import { ChevronDown, Check, UserCheck, MapPin, Star, Clock, ArrowLeft } from 'lucide-react';
import { AVAILABLE_PERSONNEL, OrderInfoSubmitData } from './OrderInfoPage';

interface DesktopOrderModalProps {
  isOpen: boolean;
  item: FoodJointItem | null;
  onClose: () => void;
  onSubmitOrder: (data: OrderInfoSubmitData) => void;
}

export const DesktopOrderModal: React.FC<DesktopOrderModalProps> = ({
  isOpen,
  item,
  onClose,
  onSubmitOrder,
}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | undefined>(undefined);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; personnel?: string }>({});
  const [step, setStep] = useState<'form' | 'summary'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      const firstMenu = item.menu[0];
      setSelectedMenuItem(firstMenu);
      setAmount(firstMenu ? String(firstMenu.priceGHS) : '');
      setNotes('');
      setSelectedPersonnel('');
      setErrors({});
      setStep('form');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSelectMenu = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setAmount(String(menuItem.priceGHS));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

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

  const handleReviewSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('summary');
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSubmitOrder({
          item,
          selectedMenuItem,
          amount: amount.trim(),
          notes: notes.trim(),
          personnel: selectedPersonnel,
        });
        setIsSuccess(false);
        setStep('form');
      }, 550);
    }, 350);
  };

  const displayPersonnelName = selectedPersonnel ? selectedPersonnel.split(' (')[0] : 'Unassigned';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#212121]/45 backdrop-blur-[2px] animate-in fade-in duration-200 select-none overflow-y-auto">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Borderless Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
        {/* Top Food Image Banner with Joint Name & Address */}
        <div className="relative w-full h-40 sm:h-44 bg-[#212121] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/90 via-[#212121]/45 to-transparent" />

          <div className="absolute bottom-3.5 left-5 right-5 text-white flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm leading-snug truncate">
                {item.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#F4F7FA] font-normal mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6347] shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-white shrink-0 pb-0.5 tabular-nums">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#F4F7FA]" />
                {item.prepTime}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#FFC300] fill-[#FFC300]" />
                {item.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleReviewSummary} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Available Menu (PS Story 4) */}
            <div>
              <h3 className="text-xs font-bold text-[#212121] mb-2">
                Available Menu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.menu.map((menuItem) => {
                  const isSelected = selectedMenuItem?.id === menuItem.id;
                  return (
                    <button
                      key={menuItem.id}
                      type="button"
                      onClick={() => handleSelectMenu(menuItem)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-[#FF6347] bg-[#FFEBE7]/55'
                          : 'border-[#DEE6EE] bg-[#F4F7FA]/60 hover:border-[#CDD5E1]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#212121] truncate">
                          {menuItem.name}
                        </p>
                        <p className="text-[11px] text-[#757575] line-clamp-1 mt-0.5">
                          {menuItem.description}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#E53935] shrink-0 tabular-nums">
                        GH₵ {menuItem.priceGHS}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Field (clean, no helper tags) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935] mb-1.5">
                Amount
              </label>
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
              {errors.amount && (
                <p className="text-[11px] text-[#E53935] mt-1 font-medium">{errors.amount}</p>
              )}
            </div>

            {/* Leave a Note Field (clean, no helper tags) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935] mb-1.5">
                Leave a Note
              </label>
              <textarea
                rows={2}
                placeholder="Add any special instructions or requests"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#CDD5E1] text-xs sm:text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors focus:outline-none focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347] resize-none"
              />
            </div>

            {/* Select available Personnel Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
                Select available Personnel
              </label>
              <p className="text-[11px] sm:text-xs text-[#757575] mt-0.5 mb-2 font-normal">
                Choose who will handle this order
              </p>
              <div className="relative">
                <select
                  value={selectedPersonnel}
                  onChange={(e) => {
                    setSelectedPersonnel(e.target.value);
                    if (errors.personnel) setErrors((prev) => ({ ...prev, personnel: undefined }));
                  }}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-xs sm:text-sm text-[#212121] bg-white appearance-none transition-colors focus:outline-none cursor-pointer ${
                    errors.personnel
                      ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                      : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
                  }`}
                >
                  <option value="">Select available personnel</option>
                  {AVAILABLE_PERSONNEL.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.role})`}>
                      {p.name} - {p.role} ({p.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#757575] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.personnel && (
                <p className="text-[11px] text-[#E53935] mt-1 font-medium">{errors.personnel}</p>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-[#FF6347] text-[#E53935] hover:bg-[#FFEBE7]/60 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Order Now
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Order Summary Confirmation (PS Story 6) */
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  disabled={isSubmitting || isSuccess}
                  className="p-1.5 rounded-lg text-[#757575] hover:text-[#212121] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
                  title="Edit Order"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="text-base sm:text-lg font-bold text-[#212121] tracking-tight">
                  Order Summary
                </h3>
              </div>
              <span className="text-xs font-medium text-[#757575]">Review before confirming</span>
            </div>

            <div className="bg-[#F4F7FA] rounded-xl p-4 border border-[#DEE6EE] space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#757575]">Food Joint</span>
                <span className="font-bold text-[#212121] text-right">{item.name}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#757575]">Address</span>
                <span className="text-[#212121] text-right">{item.location}</span>
              </div>
              {selectedMenuItem && (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#757575]">Menu Item</span>
                  <span className="font-medium text-[#212121] text-right">
                    {selectedMenuItem.name}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DEE6EE]">
                <span className="font-semibold text-[#757575]">Amount</span>
                <span className="font-bold text-[#E53935] tabular-nums">GH₵ {amount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#757575]">Assigned Personnel</span>
                <span className="font-semibold text-[#212121] text-right">
                  {displayPersonnelName}
                </span>
              </div>
              <div className="pt-2 border-t border-[#DEE6EE]">
                <span className="font-semibold text-[#757575] block mb-1">Note</span>
                <p className="text-xs text-[#212121] leading-relaxed">
                  {notes.trim() || 'No special instructions provided.'}
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isSuccess}
                className="px-5 py-2.5 rounded-lg border border-[#FF6347] text-[#E53935] hover:bg-[#FFEBE7]/60 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel Order
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting || isSuccess}
                className="px-6 py-2.5 rounded-lg bg-[#FF6347] hover:bg-[#E53935] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-85 flex items-center gap-1.5"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmed!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <UserCheck className="w-4 h-4 animate-pulse" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FoodJointItem } from '../data/foodJoints';
import { ArrowLeft, ChevronDown, Check, UserCheck } from 'lucide-react';
import { ConfirmOrderDrawer } from './ConfirmOrderDrawer';

export interface OrderInfoSubmitData {
  item: FoodJointItem;
  amount: string;
  notes: string;
  personnel: string;
}

interface OrderInfoPageProps {
  item: FoodJointItem;
  onBack: () => void;
  onSubmitOrder: (data: OrderInfoSubmitData) => void;
  isStandaloneScreen?: boolean;
  defaultAmount?: string;
  defaultNotes?: string;
  defaultPersonnel?: string;
  autoOpenDrawer?: boolean;
}

export const AVAILABLE_PERSONNEL = [
  { id: 'p0', name: 'Big Daddy Derrick', role: 'NSP - Haatso Lead Runner', status: 'Available' },
  { id: 'p1', name: 'Ama Serwaa', role: 'NSP - Station Runner', status: 'Available' },
  { id: 'p2', name: 'Kofi Mensah', role: 'NSP - Zone A Dispatch', status: 'Available' },
  { id: 'p3', name: 'Kwame Asante', role: 'NSP - Haatso Central', status: 'Available' },
  { id: 'p4', name: 'Abena Boateng', role: 'NSP - Station Runner', status: 'Available' },
  { id: 'p5', name: 'Yaw Darko', role: 'NSP - Food Logistics', status: 'Available' },
];

export const OrderInfoPage: React.FC<OrderInfoPageProps> = ({
  item,
  onBack,
  onSubmitOrder,
  isStandaloneScreen = false,
  defaultAmount = '',
  defaultNotes = '',
  defaultPersonnel = '',
  autoOpenDrawer = false,
}) => {
  const [amount, setAmount] = useState(defaultAmount);
  const [notes, setNotes] = useState(defaultNotes);
  const [selectedPersonnel, setSelectedPersonnel] = useState(defaultPersonnel);
  const [errors, setErrors] = useState<{ amount?: string; personnel?: string }>({});
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(autoOpenDrawer);
  const [isDrawerSubmitting, setIsDrawerSubmitting] = useState(false);
  const [isDrawerSuccess, setIsDrawerSuccess] = useState(false);

  const validate = () => {
    const errs: { amount?: string; personnel?: string } = {};
    if (!amount.trim()) {
      errs.amount = 'Please enter the amount you want to buy';
    } else if (isNaN(Number(amount.replace(/[^0-9.]/g, ''))) || Number(amount.replace(/[^0-9.]/g, '')) <= 0) {
      errs.amount = 'Please enter a valid amount';
    }

    if (!selectedPersonnel) {
      errs.personnel = 'Please select a personnel to handle your order';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrderNowClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsConfirmDrawerOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsDrawerSubmitting(true);
    setTimeout(() => {
      setIsDrawerSubmitting(false);
      setIsDrawerSuccess(true);
      setTimeout(() => {
        setIsConfirmDrawerOpen(false);
        setIsDrawerSuccess(false);
        onSubmitOrder({
          item,
          amount: amount.trim(),
          notes: notes.trim(),
          personnel: selectedPersonnel,
        });
      }, 700);
    }, 450);
  };

  return (
    <div className={`w-full flex flex-col items-center select-none ${isStandaloneScreen ? 'py-4' : ''}`}>
      {/* Page Title Label matching screenshot */}
      <div className="w-full max-w-[380px] sm:max-w-[400px] mb-2 px-2 flex items-center justify-between">
        <h2 className="text-xl font-medium text-slate-400 tracking-tight">
          {isConfirmDrawerOpen ? 'Confirm Order' : 'Order Info'}
        </h2>
        <div className="flex items-center gap-2">
          {!amount && (
            <button
              type="button"
              onClick={() => {
                setAmount('43');
                setNotes('Buy Waakye 15gh, Fish 20gh, Salad 4gh, Gari 2gh, Wele 6gh, I want more shito.');
                setSelectedPersonnel('Big Daddy Derrick (NSP - Haatso Lead Runner)');
                setErrors({});
              }}
              className="text-[10px] text-red-400 hover:text-red-300 font-medium cursor-pointer"
              title="Fill example from mockup"
            >
              Fill Mockup Data
            </button>
          )}
          <span className="text-xs text-slate-400">Permanent Staff</span>
        </div>
      </div>

      {/* Main Order Card matching screenshot */}
      <div className="w-full max-w-[380px] sm:max-w-[400px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Food Image Banner */}
        <div className="relative w-full h-56 sm:h-64 bg-slate-900 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Top circular back button matching screenshot */}
          <button
            type="button"
            onClick={onBack}
            className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Section */}
        <div className="px-5 pt-4 pb-4 flex flex-col">
          {/* Dish Title & Location */}
          <div className="pb-3 border-b border-slate-100">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {item.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              {item.location}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleOrderNowClick} className="mt-4 space-y-4">
            {/* Field 1: Amount */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935] mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  GH₵
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter the Amount you want to buy (e.g. 45)"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`w-full pl-13 pr-4 py-3 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors focus:outline-none ${
                    errors.amount
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                      : 'border-slate-200 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                  }`}
                />
              </div>
              {/* Quick amount pills */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-400 font-medium shrink-0">Presets:</span>
                {['20', '30', '43', '60'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                      amount === preset
                        ? 'bg-[#E53935] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    GH₵ {preset}
                  </button>
                ))}
              </div>
              {errors.amount && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.amount}</p>
              )}
            </div>

            {/* Field 2: Leave a Note */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
                  Leave a Note
                </label>
                <span className="text-[10px] text-slate-400">Custom breakdown</span>
              </div>
              <textarea
                rows={3}
                placeholder="Add any special instructions or requests (e.g. Extra shito, fish, salad)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] resize-none"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {['Extra shito', 'Pack separately', 'More gari', 'Call on arrival'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setNotes((prev) => {
                        const trimmed = prev.trim();
                        if (!trimmed) return sug;
                        if (trimmed.toLowerCase().includes(sug.toLowerCase())) return trimmed;
                        return `${trimmed}, ${sug}`;
                      });
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: Select available Personnel */}
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
                    setSelectedPersonnel(e.target.value);
                    if (errors.personnel) setErrors((prev) => ({ ...prev, personnel: undefined }));
                  }}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-xs sm:text-sm text-slate-700 bg-white appearance-none transition-colors focus:outline-none cursor-pointer ${
                    errors.personnel
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                      : 'border-slate-200 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                  }`}
                >
                  <option value="">Select</option>
                  {AVAILABLE_PERSONNEL.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.role})`}>
                      {p.name} - {p.role} ({p.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.personnel && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.personnel}</p>
              )}
            </div>

            {/* Order Now Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white font-semibold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                Order Now
              </button>
            </div>
          </form>

          {/* Bottom Screen Indicator Bar matching smartphone UI */}
          <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-5 mb-1" />
        </div>

        {/* Mobile Confirm Order Drawer sliding up from bottom matching image_9f9343e4.png */}
        <ConfirmOrderDrawer
          isOpen={isConfirmDrawerOpen}
          onClose={() => setIsConfirmDrawerOpen(false)}
          onConfirm={handleConfirmOrder}
          amount={amount}
          notes={notes}
          personnel={selectedPersonnel}
          isSubmitting={isDrawerSubmitting}
          isSuccess={isDrawerSuccess}
        />
      </div>
    </div>
  );
};


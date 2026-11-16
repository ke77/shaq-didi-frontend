import React, { useState, useEffect } from 'react';
import { FoodJointItem, MenuItem } from '../data/foodJoints';
import { ArrowLeft, ChevronDown, MapPin, Star, Clock, Check } from 'lucide-react';
import { ConfirmOrderDrawer } from './ConfirmOrderDrawer';
import { api, PersonnelMember, getErrorMessage } from '../services/api';

export interface OrderInfoSubmitData {
  item: FoodJointItem;
  selectedMenuItem: MenuItem;
  quantity: number;
  notes: string;
  personnel: string;
  personnelId: string;
}

interface OrderInfoPageProps {
  item: FoodJointItem;
  onBack: () => void;
  onSubmitOrder: (data: OrderInfoSubmitData) => void | Promise<void>;
  isStandaloneScreen?: boolean;
  autoOpenDrawer?: boolean;
}

const NOTE_PRESETS = ['Extra pepper', 'No onions', 'Less oil', 'Call on arrival'] as const;

export const OrderInfoPage: React.FC<OrderInfoPageProps> = ({
  item,
  onBack,
  onSubmitOrder,
  autoOpenDrawer = false,
}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | undefined>(
    item.menu[0]
  );
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [personnelList, setPersonnelList] = useState<PersonnelMember[]>([]);
  const [isLoadingPersonnel, setIsLoadingPersonnel] = useState(true);
  const [personnelError, setPersonnelError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ quantity?: string; personnel?: string }>({});
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(autoOpenDrawer);
  const [isDrawerSubmitting, setIsDrawerSubmitting] = useState(false);
  const [isDrawerSuccess, setIsDrawerSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPersonnel(true);
    api
      .getPersonnel()
      .then((list) => {
        if (!cancelled) {
          setPersonnelList(list);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPersonnelError(getErrorMessage(error, 'Could not load dispatch personnel.'));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingPersonnel(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectMenu = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const validate = () => {
    const errs: { quantity?: string; personnel?: string } = {};
    const numericQuantity = Number(quantity);
    if (!Number.isInteger(numericQuantity) || numericQuantity < 1 || numericQuantity > 500) {
      errs.quantity = 'Quantity must be a whole number between 1 and 500';
    }

    if (!selectedPersonnelId) {
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

  const handleConfirmOrder = async () => {
    if (!selectedMenuItem || !selectedPersonnelId) return;
    setIsDrawerSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmitOrder({
        item,
        selectedMenuItem,
        quantity: Number(quantity),
        notes: notes.trim(),
        personnel: selectedPersonnel,
        personnelId: selectedPersonnelId,
      });
      setIsDrawerSuccess(true);
      setTimeout(() => {
        setIsConfirmDrawerOpen(false);
        setIsDrawerSuccess(false);
      }, 650);
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, 'Could not place your order.'));
    } finally {
      setIsDrawerSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col select-none relative">
      {/* Main Food Joint Details & Order Container */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col relative animate-in fade-in duration-200 pb-8">
        {/* Top Food Image Banner */}
        <div className="relative w-full h-56 sm:h-64 bg-[#212121] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/60 via-transparent to-transparent" />

          {/* Top circular back button */}
          <button
            type="button"
            onClick={onBack}
            className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#212121] shadow-lg hover:bg-[#F4F7FA] active:scale-95 transition-all cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-[#212121] stroke-[2.5]" />
          </button>
        </div>

        {/* Content Section */}
        <div className="px-5 pt-4 pb-4 flex flex-col">
          {/* Joint Name, Address, Rating & Time */}
          <div className="pb-3.5 border-b border-[#DEE6EE]">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#212121] tracking-tight leading-snug">
                {item.name}
              </h1>
              <div className="flex items-center gap-1 shrink-0 pt-1 text-xs font-bold text-[#212121] tabular-nums">
                {item.rating > 0 && (
                  <>
                    <Star className="w-3.5 h-3.5 text-[#FFC300] fill-[#FFC300]" />
                    <span>{item.rating.toFixed(1)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1 text-xs text-[#757575]">
              <span className="flex items-center gap-1 min-w-0 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#FF6347] shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
              {item.prepTime && (
                <span className="flex items-center gap-1 shrink-0 text-[#757575]">
                  <Clock className="w-3 h-3" />
                  <span>{item.prepTime}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#757575] leading-relaxed mt-2">
              {item.description}
            </p>
          </div>

          {/* Available Menu Section (PS Story 4) */}
          <div className="mt-4">
            <h2 className="text-xs sm:text-sm font-semibold text-[#212121] mb-2">
              Available Menu
            </h2>
            <div className="space-y-2">
              {item.menu.map((menuItem) => {
                const isSelected = selectedMenuItem?.id === menuItem.id;
                return (
                  <button
                    key={menuItem.id}
                    type="button"
                    onClick={() => handleSelectMenu(menuItem)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#FF6347] bg-[#FFEBE7]/50'
                        : 'border-[#DEE6EE] bg-[#F4F7FA]/60 hover:border-[#CDD5E1]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-[#212121] leading-snug">
                          {menuItem.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#757575] mt-0.5 line-clamp-2">
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

          {/* Order Form */}
          <form onSubmit={handleOrderNowClick} className="mt-5 space-y-4">
            {/* Field 1: Quantity */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935] mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                max={500}
                step={1}
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  if (errors.quantity) setErrors((previous) => ({ ...previous, quantity: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm text-[#212121] bg-white transition-colors focus:outline-none ${
                  errors.quantity
                    ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                    : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
                }`}
              />
              {selectedMenuItem && (
                <p className="text-[11px] text-[#757575] mt-1">
                  Total: GH₵ {(selectedMenuItem.priceGHS * Number(quantity || 0)).toFixed(2)}
                </p>
              )}
              {errors.quantity && (
                <p className="text-[11px] text-[#E53935] mt-1 font-medium">{errors.quantity}</p>
              )}
            </div>

            {/* Field 2: Leave a Note + Quick Preset Tabs */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935] mb-1.5">
                Leave a Note
              </label>
              <textarea
                rows={3}
                placeholder="Add any special instructions or requests"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#CDD5E1] text-xs sm:text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors focus:outline-none focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347] resize-none"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {NOTE_PRESETS.map((preset) => {
                  const parts = notes
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const isActive = parts.some((p) => p.toLowerCase() === preset.toLowerCase());
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          setNotes(
                            parts.filter((p) => p.toLowerCase() !== preset.toLowerCase()).join(', ')
                          );
                        } else {
                          setNotes(parts.length > 0 ? `${parts.join(', ')}, ${preset}` : preset);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FFEBE7] text-[#E53935] border-[#FF6E6A]/60 font-semibold'
                          : 'bg-[#F4F7FA] text-[#757575] border-[#DEE6EE] hover:border-[#CDD5E1] hover:text-[#212121]'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 3: Select available Personnel */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
                Select available Personnel
              </label>
              <p className="text-[11px] sm:text-xs text-[#757575] mt-0.5 mb-2 font-normal">
                Choose who will handle this order
              </p>
              <div className="relative">
                <select
                  value={selectedPersonnelId}
                  disabled={isLoadingPersonnel}
                  onChange={(e) => {
                    const person = personnelList.find((p) => p.id === e.target.value);
                    setSelectedPersonnelId(person?.id ?? '');
                    setSelectedPersonnel(person ? `${person.name} (${person.role})` : '');
                    if (errors.personnel) setErrors((prev) => ({ ...prev, personnel: undefined }));
                  }}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-xs sm:text-sm text-[#212121] bg-white appearance-none transition-colors focus:outline-none cursor-pointer disabled:bg-[#F4F7FA] disabled:text-[#757575] ${
                    errors.personnel
                      ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                      : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
                  }`}
                >
                  <option value="">
                    {isLoadingPersonnel
                      ? 'Loading dispatch personnel...'
                      : 'Select dispatch personnel'}
                  </option>
                  {personnelList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-[#757575] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {personnelError && (
                <p role="alert" className="text-[11px] text-[#E53935] mt-1">{personnelError}</p>
              )}
              {!isLoadingPersonnel && !personnelError && personnelList.length === 0 && (
                <p className="text-[11px] text-[#757575] mt-1">No dispatch personnel are registered yet.</p>
              )}
              {errors.personnel && (
                <p className="text-[11px] text-[#E53935] mt-1 font-medium">{errors.personnel}</p>
              )}
            </div>

            {/* Order Now Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#FF6347] hover:bg-[#E53935] active:bg-[#E53935] text-white font-semibold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                Order Now
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Confirm Order Summary Drawer (PS Story 6) */}
        <ConfirmOrderDrawer
          isOpen={isConfirmDrawerOpen}
          onClose={() => setIsConfirmDrawerOpen(false)}
          onConfirm={handleConfirmOrder}
          jointName={item.name}
          jointAddress={item.location}
          menuItemName={selectedMenuItem?.name}
          amount={selectedMenuItem
            ? (selectedMenuItem.priceGHS * Number(quantity || 0)).toFixed(2)
            : '0.00'}
          notes={notes}
          personnel={selectedPersonnel}
          isSubmitting={isDrawerSubmitting}
          isSuccess={isDrawerSuccess}
          error={submitError}
        />
      </div>
    </div>
  );
};

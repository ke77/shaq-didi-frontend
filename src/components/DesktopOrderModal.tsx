import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FoodJointItem, MenuItem } from '../data/foodJoints';
import { ChevronDown, Check, UserCheck, MapPin } from 'lucide-react';
import { OrderInfoSubmitData } from './OrderInfoPage';
import { api, getErrorMessage, PersonnelMember } from '../services/api';

interface DesktopOrderModalProps {
  isOpen: boolean;
  item: FoodJointItem | null;
  onClose: () => void;
  onSubmitOrder: (data: OrderInfoSubmitData) => void | Promise<void>;
}

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
  const [quantity, setQuantity] = useState('1');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | undefined>();
  const [notes, setNotes] = useState('');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [personnelList, setPersonnelList] = useState<PersonnelMember[]>([]);
  const [personnelError, setPersonnelError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoadingPersonnel, setIsLoadingPersonnel] = useState(false);
  const [errors, setErrors] = useState<{ quantity?: string; personnel?: string; menu?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) return;
    let cancelled = false;
    setSelectedMenuItem(item.menu[0]);
    setQuantity('1');
    setNotes('');
    setSelectedPersonnelId('');
    setSelectedPersonnel('');
    setSubmitError(null);
    setIsSuccess(false);
    setIsLoadingPersonnel(true);
    setPersonnelError(null);
    api.getPersonnel()
      .then((people) => {
        if (!cancelled) setPersonnelList(people);
      })
      .catch((error: unknown) => {
        if (!cancelled) setPersonnelError(getErrorMessage(error, 'Could not load dispatch personnel.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPersonnel(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const validate = () => {
    const errs: { quantity?: string; personnel?: string; menu?: string } = {};
    const numericQuantity = Number(quantity);
    if (!Number.isInteger(numericQuantity) || numericQuantity < 1 || numericQuantity > 500) {
      errs.quantity = 'Quantity must be a whole number between 1 and 500';
    }

    if (!selectedMenuItem) {
      errs.menu = 'Select an available menu item';
    }

    if (!selectedPersonnelId) {
      errs.personnel = 'Please select a personnel to handle your order';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrderNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!selectedMenuItem || !selectedPersonnelId) return;
    setIsSubmitting(true);
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
      setIsSuccess(true);
      setQuantity('1');
      setNotes('');
      setSelectedPersonnel('');
      setSelectedPersonnelId('');
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, 'Could not place your order.'));
    } finally {
      setIsSubmitting(false);
    }
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
            <label className="block text-xs sm:text-sm font-semibold text-[#E53935] mb-1.5">
              Menu item
            </label>
            <select
              value={selectedMenuItem?.id ?? ''}
              onChange={(event) => {
                const menuItem = item.menu.find((entry) => entry.id === event.target.value);
                setSelectedMenuItem(menuItem);
                if (errors.menu) setErrors((previous) => ({ ...previous, menu: undefined }));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-[#CDD5E1] bg-white text-xs sm:text-sm"
            >
              <option value="">Select a menu item</option>
              {item.menu.map((menuItem) => (
                <option key={menuItem.id} value={menuItem.id}>
                  {menuItem.name} — GH₵ {menuItem.priceGHS.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.menu && <p className="mt-1 text-[11px] text-[#E53935]">{errors.menu}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#E53935]">
                Quantity
              </label>
            </div>
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
              className={`w-full px-4 py-2.5 rounded-lg border text-xs sm:text-sm ${
                errors.quantity ? 'border-[#E53935]' : 'border-[#CDD5E1]'
              }`}
            />
            {selectedMenuItem && (
              <p className="mt-1 text-[11px] text-[#757575]">
                Total: GH₵ {(selectedMenuItem.priceGHS * Number(quantity || 0)).toFixed(2)}
              </p>
            )}
            {errors.quantity && (
              <p className="text-[11px] text-[#E53935] mt-1 font-medium">{errors.quantity}</p>
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
            Select dispatch personnel
            </label>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 mb-2 font-normal">
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
                className={`w-full px-4 py-2.5 pr-10 rounded-lg border text-xs sm:text-sm text-slate-700 bg-white appearance-none transition-colors focus:outline-none cursor-pointer ${
                  errors.personnel
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                    : 'border-slate-200 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                }`}
              >
                <option value="">{isLoadingPersonnel ? 'Loading dispatch personnel...' : 'Select dispatch personnel'}</option>
                {personnelList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.role}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {personnelError && <p role="alert" className="mt-1 text-[11px] text-[#E53935]">{personnelError}</p>}
            {!isLoadingPersonnel && !personnelError && personnelList.length === 0 && (
              <p className="mt-1 text-[11px] text-[#757575]">No dispatch personnel are registered yet.</p>
            )}
            {errors.personnel && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.personnel}</p>
            )}
          </div>

          {submitError && <p role="alert" className="text-xs text-[#E53935]">{submitError}</p>}

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

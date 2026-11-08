import React from 'react';
import { CheckCircle2, User, Mail, Phone, Briefcase, X } from 'lucide-react';
import { SignUpFormData, ROLE_DEFINITIONS } from '../types';

interface SuccessModalProps {
  data: SignUpFormData | null;
  onClose: () => void;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ data, onClose, onReset }) => {
  if (!data) return null;

  const roleInfo = ROLE_DEFINITIONS[data.role];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-left border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Account Created!</h3>
            <p className="text-xs text-slate-500">Welcome to the ShaQ DIDI personnel network</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 block">Full Name</span>
              <span className="font-semibold text-slate-800">{data.fullName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-[#E53935] shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 block">Personnel Role</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="bg-[#E53935] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                  {data.role}
                </span>
                <span className="font-medium text-slate-700">{roleInfo.fullTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 block">Email Address</span>
              <span className="font-semibold text-slate-800">{data.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 block">Phone Number</span>
              <span className="font-semibold text-slate-800">{data.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 px-4 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer text-center"
          >
            Register Another Personnel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-md bg-[#E53935] hover:bg-[#d32f2f] text-white font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

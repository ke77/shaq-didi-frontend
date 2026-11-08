import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { PersonnelRole, SignUpFormData, FormErrors, ROLE_DEFINITIONS } from '../types';

interface SignUpFormProps {
  onSuccess: (data: SignUpFormData) => void;
  onSignInClick: () => void;
  isMobileLayout?: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onSignInClick,
  isMobileLayout = false,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    role: 'PS',
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^[0-9+() -]{7,20}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(formData);
      }, 500);
    }
  };

  const handleRoleChange = (role: PersonnelRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const activeRoleInfo = ROLE_DEFINITIONS[formData.role];

  return (
    <div className="w-full flex flex-col justify-center items-center py-6 px-4 sm:px-8 lg:px-12">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Form Title & Subtitle */}
        <div className="text-center mb-6">
          {isMobileLayout ? (
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Create An Account
            </h2>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                Let’s Get Started
              </h2>
              <p className="text-slate-400 font-medium text-sm sm:text-base mt-1">
                Create an Account
              </p>
            </>
          )}
        </div>

        {/* Radio Option Selector (PS / NSP) matching design */}
        <div className="flex flex-col items-center mb-5">
          <div className="inline-flex items-center justify-center gap-8 py-1 px-3">
            {/* PS Option */}
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <span className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="personnelRole"
                  value="PS"
                  checked={formData.role === 'PS'}
                  onChange={() => handleRoleChange('PS')}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.role === 'PS'
                      ? 'border-[#E53935] bg-white'
                      : 'border-slate-400 group-hover:border-slate-500'
                  }`}
                >
                  {formData.role === 'PS' && (
                    <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                  )}
                </span>
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
                  formData.role === 'PS' ? 'text-slate-800' : 'text-slate-500'
                }`}
              >
                PS
              </span>
            </label>

            {/* NSP Option */}
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <span className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="personnelRole"
                  value="NSP"
                  checked={formData.role === 'NSP'}
                  onChange={() => handleRoleChange('NSP')}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.role === 'NSP'
                      ? 'border-[#E53935] bg-white'
                      : 'border-slate-400 group-hover:border-slate-500'
                  }`}
                >
                  {formData.role === 'NSP' && (
                    <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                  )}
                </span>
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
                  formData.role === 'NSP' ? 'text-slate-800' : 'text-slate-500'
                }`}
              >
                NSP
              </span>
            </label>
          </div>

          {/* Role Meaning Clarification Badge */}
          <div className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 py-1 px-3 rounded-full border border-slate-100">
            <span className="font-semibold text-slate-700">{activeRoleInfo.fullTitle}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">{activeRoleInfo.description}</span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Full Name */}
          <div>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                className={`w-full px-4 py-3 rounded-md border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 focus:outline-none ${
                  errors.fullName
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                    : 'border-slate-300 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full px-4 py-3 rounded-md border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 focus:outline-none ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                    : 'border-slate-300 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-4 py-3 pr-11 rounded-md border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 focus:outline-none ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                    : 'border-slate-300 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => {
                  setFormData({ ...formData, phoneNumber: e.target.value });
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
                }}
                className={`w-full px-4 py-3 rounded-md border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 focus:outline-none ${
                  errors.phoneNumber
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-400'
                    : 'border-slate-300 focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]'
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Submit Button (Vibrant Red matching mockup) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 px-6 rounded-md bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white font-semibold text-sm sm:text-base tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        {/* Footer: Already have an Account? Sign In */}
        <div className="mt-5 text-center text-xs text-slate-500">
          Already have an Account?{' '}
          <button
            type="button"
            onClick={onSignInClick}
            className="text-[#E53935] hover:text-[#c62828] font-semibold hover:underline inline-block transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

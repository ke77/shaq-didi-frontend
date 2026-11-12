import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
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
      }, 450);
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
        <div className="text-center mb-5">
          {isMobileLayout ? (
            <h2 className="text-xl sm:text-2xl font-bold text-[#212121] tracking-tight">
              Create An Account
            </h2>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#212121] tracking-tight">
                Let’s Get Started
              </h2>
              <p className="text-[#757575] font-medium text-sm sm:text-base mt-1">
                Create an Account
              </p>
            </>
          )}
        </div>

        {/* User Type Selector: Permanent Staff vs National Service Personnel */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-[#757575] text-center mb-2">
            Select User Type
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Permanent Staff Option */}
            <label
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                formData.role === 'PS'
                  ? 'border-[#FF6347] bg-[#FFEBE7]/70 text-[#212121]'
                  : 'border-[#DEE6EE] bg-[#F4F7FA]/60 text-[#757575] hover:border-[#CDD5E1]'
              }`}
            >
              <input
                type="radio"
                name="personnelRole"
                value="PS"
                checked={formData.role === 'PS'}
                onChange={() => handleRoleChange('PS')}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  formData.role === 'PS' ? 'border-[#FF6347] bg-white' : 'border-[#B5B5B5]'
                }`}
              >
                {formData.role === 'PS' && <span className="w-2 h-2 rounded-full bg-[#FF6347]" />}
              </span>
              <span className="text-xs font-semibold leading-tight">
                Permanent Staff
              </span>
            </label>

            {/* National Service Personnel Option */}
            <label
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                formData.role === 'NSP'
                  ? 'border-[#FF6347] bg-[#FFEBE7]/70 text-[#212121]'
                  : 'border-[#DEE6EE] bg-[#F4F7FA]/60 text-[#757575] hover:border-[#CDD5E1]'
              }`}
            >
              <input
                type="radio"
                name="personnelRole"
                value="NSP"
                checked={formData.role === 'NSP'}
                onChange={() => handleRoleChange('NSP')}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  formData.role === 'NSP' ? 'border-[#FF6347] bg-white' : 'border-[#B5B5B5]'
                }`}
              >
                {formData.role === 'NSP' && <span className="w-2 h-2 rounded-full bg-[#FF6347]" />}
              </span>
              <span className="text-xs font-semibold leading-tight">
                National Service Personnel
              </span>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-[#757575] text-center">
            {activeRoleInfo.description}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Full Name */}
          <div>
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
              className={`w-full px-4 py-3 rounded-lg border text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors duration-150 focus:outline-none ${
                errors.fullName
                  ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                  : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-[#E53935] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
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
              className={`w-full px-4 py-3 rounded-lg border text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors duration-150 focus:outline-none ${
                errors.email
                  ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                  : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[#E53935] flex items-center gap-1">
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
                className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors duration-150 focus:outline-none ${
                  errors.password
                    ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                    : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5B5B5] hover:text-[#757575] focus:outline-none p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#757575]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#B5B5B5]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-[#E53935] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
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
              className={`w-full px-4 py-3 rounded-lg border text-sm text-[#212121] placeholder:text-[#B5B5B5] bg-white transition-colors duration-150 focus:outline-none ${
                errors.phoneNumber
                  ? 'border-[#E53935] focus:border-[#E53935] ring-1 ring-[#E53935]'
                  : 'border-[#CDD5E1] focus:border-[#FF6347] focus:ring-1 focus:ring-[#FF6347]'
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-[#E53935] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 px-6 rounded-lg bg-[#FF6347] hover:bg-[#E53935] active:bg-[#E53935] text-white font-semibold text-sm sm:text-base tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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

        {/* Footer */}
        <div className="mt-5 text-center text-xs text-[#757575]">
          Already have an Account?{' '}
          <button
            type="button"
            onClick={onSignInClick}
            className="text-[#E53935] hover:text-[#FF6347] font-semibold hover:underline inline-block transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { PersonnelRole } from '../types';

interface SignInFormProps {
  onSuccess: (data: { email: string; password: string; role?: PersonnelRole }) => void;
  onSignUpClick: () => void;
  isMobileLayout?: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onSignUpClick,
  isMobileLayout = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<PersonnelRole>('PS');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        onSuccess({ email: email.trim(), password, role: selectedRole });
      }, 450);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center py-8 px-4 sm:px-8 lg:px-12">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Title: User Sign In */}
        <div className="text-center mb-6">
          <h2
            className={`font-bold text-[#212121] tracking-tight ${
              isMobileLayout ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            User Sign In
          </h2>
          <p className="text-xs text-[#757575] mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Account Portal Selector (automatically overridden if email matches a registered account) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4F7FA] rounded-lg border border-[#DEE6EE] mb-5">
          <button
            type="button"
            onClick={() => setSelectedRole('PS')}
            className={`py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'PS'
                ? 'bg-white text-[#E53935] shadow-xs border border-[#DEE6EE]/60'
                : 'text-[#757575] hover:text-[#212121]'
            }`}
          >
            Permanent Staff
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('NSP')}
            className={`py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              selectedRole === 'NSP'
                ? 'bg-white text-[#E53935] shadow-xs border border-[#DEE6EE]/60'
                : 'text-[#757575] hover:text-[#212121]'
            }`}
          >
            National Service Personnel
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Address */}
          <div>
            <input
              type="email"
              id="signin-email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
                id="signin-password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#757575]">
          Don't have an Account yet?{' '}
          <button
            type="button"
            onClick={onSignUpClick}
            className="text-[#E53935] hover:text-[#FF6347] font-semibold hover:underline inline-block transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

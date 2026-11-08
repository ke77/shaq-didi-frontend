import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface SignInFormProps {
  onSuccess: (data: { email: string }) => void;
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
        onSuccess({ email });
      }, 500);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center py-8 px-4 sm:px-8 lg:px-12">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Title: User Sign In */}
        <div className="text-center mb-8">
          <h2
            className={`font-bold text-slate-800 tracking-tight ${
              isMobileLayout ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            User Sign In
          </h2>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Address */}
          <div>
            <div className="relative">
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
                id="signin-password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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

          {/* Submit Button (Vibrant Red matching screenshot) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 px-6 rounded-md bg-[#E53935] hover:bg-[#d32f2f] active:bg-[#c62828] text-white font-semibold text-sm sm:text-base tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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

        {/* Footer: Don't have an Account yet? Sign Up */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an Account yet?{' '}
          <button
            type="button"
            onClick={onSignUpClick}
            className="text-[#E53935] hover:text-[#c62828] font-semibold hover:underline inline-block transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

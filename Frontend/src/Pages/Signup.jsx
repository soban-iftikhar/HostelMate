import { useState } from 'react';
import { Mail, Lock, User, DoorOpen, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const SIGNUP_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME: /^[a-zA-Z\s]{2,}$/,
};

const PASSWORD_MIN = 8;

export default function Signup({ onSuccess = null, onSwitchToLogin = null }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    roomNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateFullName = (name) => {
    if (!name) return 'Full name is required';
    if (!SIGNUP_REGEX.NAME.test(name)) return 'Name must be at least 2 characters and contain only letters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!SIGNUP_REGEX.EMAIL.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateRoomNumber = (room) => {
    if (!room) return 'Room number is required';
    if (room.trim().length < 1) return 'Room number cannot be empty';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < PASSWORD_MIN) {
      return `Password must be at least ${PASSWORD_MIN} characters`;
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      const newErrors = { ...errors };
      let fieldError = '';

      switch (name) {
        case 'fullName':
          fieldError = validateFullName(value);
          break;
        case 'email':
          fieldError = validateEmail(value);
          break;
        case 'roomNumber':
          fieldError = validateRoomNumber(value);
          break;
        case 'password':
          fieldError = validatePassword(value);
          // Also validate confirm password if it's been touched
          if (touched.confirmPassword && formData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, formData.confirmPassword);
            if (confirmError) {
              newErrors.confirmPassword = confirmError;
            } else {
              delete newErrors.confirmPassword;
            }
          }
          break;
        case 'confirmPassword':
          fieldError = validateConfirmPassword(formData.password, value);
          break;
        default:
          break;
      }

      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }
      setErrors(newErrors);
    }
  };

  const handleTermsChange = (e) => {
    const checked = e.target.checked;
    setAcceptTerms(checked);
    if (touched.terms) {
      setErrors((prev) => {
        const next = { ...prev };
        if (!checked) next.terms = 'You must accept the terms to continue';
        else delete next.terms;
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    const newErrors = { ...errors };
    let fieldError = '';

    switch (name) {
      case 'fullName':
        fieldError = validateFullName(formData.fullName);
        break;
      case 'email':
        fieldError = validateEmail(formData.email);
        break;
      case 'roomNumber':
        fieldError = validateRoomNumber(formData.roomNumber);
        break;
      case 'password':
        fieldError = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        fieldError = validateConfirmPassword(formData.password, formData.confirmPassword);
        break;
      default:
        break;
    }

    if (fieldError) {
      newErrors[name] = fieldError;
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const roomNumberError = validateRoomNumber(formData.roomNumber);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    const termsError = acceptTerms ? '' : 'You must accept the terms to continue';

    if (fullNameError) newErrors.fullName = fullNameError;
    if (emailError) newErrors.email = emailError;
    if (roomNumberError) newErrors.roomNumber = roomNumberError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    if (termsError) newErrors.terms = termsError;

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, roomNumber: true, password: true, confirmPassword: true, terms: true });

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSuccessMessage(`Welcome ${formData.fullName}! Your account has been created.`);
        setFormData({ fullName: '', email: '', roomNumber: '', password: '', confirmPassword: '' });
        setAcceptTerms(false);
        setErrors({});
        setTouched({});
        setIsLoading(false);
        if (onSuccess) onSuccess();
      }, 1500);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const criteria = {
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    // Count how many character types are used
    if (criteria.hasLower) strength++;
    if (criteria.hasUpper) strength++;
    if (criteria.hasNumber) strength++;
    if (criteria.hasSpecial) strength++;

    const strengths = [
      { strength: 0, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 1, label: 'Weak', color: 'bg-orange-500' },
      { strength: 2, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 3, label: 'Good', color: 'bg-blue-500' },
      { strength: 4, label: 'Strong', color: 'bg-emerald-500' },
    ];
    return strengths[strength];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white mb-4">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Hostel-Mate</h1>
            <p className="text-slate-600">Create your account to start earning karma points</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.fullName && touched.fullName
                      ? 'border-red-300 bg-red-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-900'
                  } placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600`}
                />
              </div>
              {errors.fullName && touched.fullName && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.email && touched.email
                      ? 'border-red-300 bg-red-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-900'
                  } placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600`}
                />
              </div>
              {errors.email && touched.email && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Room Number */}
            <div>
              <label htmlFor="roomNumber" className="block text-sm font-semibold text-slate-900 mb-2">
                Room Number
              </label>
              <div className="relative">
                <DoorOpen className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="302-B"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.roomNumber && touched.roomNumber
                      ? 'border-red-300 bg-red-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-900'
                  } placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600`}
                />
              </div>
              {errors.roomNumber && touched.roomNumber && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.roomNumber}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                    errors.password && touched.password
                      ? 'border-red-300 bg-red-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-900'
                  } placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrength(formData.password).color}`}
                        style={{ width: `${(getPasswordStrength(formData.password).strength / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {getPasswordStrength(formData.password).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength based on character variety (lowercase, uppercase, numbers, special chars)
                  </p>
                </div>
              )}

              {errors.password && touched.password && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-300 bg-red-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-900'
                  } placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={handleTermsChange}
                onBlur={() => setTouched((prev) => ({ ...prev, terms: true }))}
                className="w-4 h-4 rounded border-slate-300 mt-1"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="font-semibold text-cyan-600 hover:text-cyan-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-cyan-600 hover:text-cyan-700">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && touched.terms && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.terms}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onSwitchToLogin && onSwitchToLogin()}
              className="font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

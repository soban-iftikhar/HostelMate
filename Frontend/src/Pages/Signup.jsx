import { useState } from 'react';
import { Mail, Lock, User, DoorOpen, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

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
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < PASSWORD_MIN) {
      return `Password must be at least ${PASSWORD_MIN} characters`;
    }
    return '';
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors.submit) {
      const { submit, ...rest } = errors;
      setErrors(rest);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Run all validations
    const newErrors = {};
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const roomNumberError = validateRoomNumber(formData.roomNumber);
    const passwordError = validatePassword(formData.password);
    const termsError = acceptTerms ? '' : 'You must accept the terms to continue';

    if (fullNameError) newErrors.fullName = fullNameError;
    if (emailError) newErrors.email = emailError;
    if (roomNumberError) newErrors.roomNumber = roomNumberError;
    if (passwordError) newErrors.password = passwordError;
    if (termsError) newErrors.terms = termsError;

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, roomNumber: true, password: true, terms: true });

    // 2. If no frontend errors, talk to the backend
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Map fields to match your Backend Schema: name, email, password, roomNo
        const response = await axios.post('http://localhost:5000/api/users/register', {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          roomNo: formData.roomNumber
        });

        // 3. SUCCESS LOGIC (Was missing)
        if (response.data) {
          setSuccessMessage(`Welcome ${formData.fullName}! Registration successful.`);
          
          // Save the user object (including the MongoDB _id) to localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.data));

          setFormData({ fullName: '', email: '', roomNumber: '', password: '' });
          setAcceptTerms(false);
          setErrors({});
          
          // Wait a second so the user sees the success message, then redirect
          setTimeout(() => {
            setIsLoading(false);
            if (onSuccess) onSuccess(response.data);
          }, 1500);
        }

      } catch (err) {
        setIsLoading(false);
        // 4. BACKEND ERROR LOGIC (Handles "User already exists")
        const message = err.response?.data?.message || "Registration failed. Check your connection.";
        setErrors({ submit: message });
        console.error("Signup error:", err.response?.data);
      }
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()]/.test(password)) strength++;

    const strengths = [
      { strength: 0, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 1, label: 'Weak', color: 'bg-orange-500' },
      { strength: 2, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 3, label: 'Good', color: 'bg-cyan-500' },
      { strength: 4, label: 'Strong', color: 'bg-cyan-600' },
    ];
    return strengths[strength];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600 text-white mb-4">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Hostel-Mate</h1>
            <p className="text-slate-600">Create your account to start earning karma points</p>
          </div>

          {/* Backend Error Display */}
          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 font-medium text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-cyan-50 border border-cyan-200 p-4 text-cyan-700 font-medium text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                    errors.fullName && touched.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.fullName && touched.fullName && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                    errors.email && touched.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>
              )}
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Room Number</label>
              <div className="relative">
                <DoorOpen className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="Enter your room number"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                    errors.roomNumber && touched.roomNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.roomNumber && touched.roomNumber && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.roomNumber}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={(e) => {
                    setTouched((prev) => ({ ...prev, password: true }));
                    const error = validatePassword(e.target.value);
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (error) next.password = error;
                      else delete next.password;
                      return next;
                    });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                    errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>
              )}

              {/* Password Strength Indicator - Always visible */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Password Strength</span>
                  <span className={`text-xs font-bold ${getPasswordStrength(formData.password).color.replace('bg-', 'text-')}`}>
                    {getPasswordStrength(formData.password).label}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getPasswordStrength(formData.password).color}`}
                    style={{ width: `${(getPasswordStrength(formData.password).strength / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 mt-6 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-cyan-600 cursor-pointer">Sign in here</button>
          </p>
        </div>
      </div>
    </div>
  );
}
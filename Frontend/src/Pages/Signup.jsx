import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, DoorOpen, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import apiClient from '../services/apiClient';
import { AuthContext } from '../context/AuthContext';

const SIGNUP_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME: /^[a-zA-Z\s]{2,}$/,
};

// Set to 6 to match your backend schema if needed
const PASSWORD_MIN = 6; 

export default function Signup({ onSuccess = null, onSwitchToLogin = null }) {
  const { login } = useContext(AuthContext);
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
    if (!SIGNUP_REGEX.NAME.test(name)) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!SIGNUP_REGEX.EMAIL.test(email)) return 'Enter a valid email address';
    return '';
  };

  const validateRoomNumber = (room) => {
    if (!room) return 'Room number is required';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < PASSWORD_MIN) return `Min ${PASSWORD_MIN} characters`;
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear backend error when typing
    if (errors.submit) setErrors(prev => { const {submit, ...rest} = prev; return rest; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate All Fields
    const newErrors = {};
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const roomNumberError = validateRoomNumber(formData.roomNumber);
    const passwordError = validatePassword(formData.password);
    const termsError = acceptTerms ? '' : 'Required';

    if (fullNameError) newErrors.fullName = fullNameError;
    if (emailError) newErrors.email = emailError;
    if (roomNumberError) newErrors.roomNumber = roomNumberError;
    if (passwordError) newErrors.password = passwordError;
    if (termsError) newErrors.terms = termsError;

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, roomNumber: true, password: true, terms: true });

    // 2. Only proceed if 0 errors
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await apiClient.post('/users/register', {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          roomNo: formData.roomNumber // Mapping to your backend schema
        });

        if (response.data) {
          const { user, accessToken, refreshToken } = response.data;
          
          setSuccessMessage(`Welcome ${formData.fullName}! Registration successful.`);
          
          // Use AuthContext to store user and tokens
          login(user, accessToken, refreshToken);
          
          setTimeout(() => {
            setIsLoading(false);
            if (onSuccess) onSuccess(user);
          }, 1500);
        }
      } catch (err) {
        setIsLoading(false);
        const message = err.response?.data?.message || "Server Error. Is the backend running?";
        setErrors({ submit: message });
      }
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: 'bg-slate-200' };
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
          </div>

          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-cyan-50 border border-cyan-200 p-4 text-cyan-700 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-600"
                placeholder="Full Name"
              />
              {errors.fullName && touched.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-600"
                placeholder="Email"
              />
              {errors.email && touched.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-600"
                placeholder="Room No"
              />
              {errors.roomNumber && touched.roomNumber && <p className="text-xs text-red-600 mt-1">{errors.roomNumber}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-600 "
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 cursor-pointer">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${getPasswordStrength(formData.password).color}`} style={{ width: `${(getPasswordStrength(formData.password).strength / 4) * 100}%` }} />
                </div>
              </div>
            </div>

  
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 border-slate-300 rounded text-cyan-600 focus:ring-cyan-600"
              />
              <span>I accept the <Link to="/privacy" className="text-cyan-600 hover:underline font-semibold">Privacy Policy</Link> and Terms</span>
            </div>
            {errors.terms && touched.terms && <p className="text-xs text-red-600">{errors.terms}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg shadow-md transition-all mt-4"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 cur">
            Already have an account? <Link to="/login" className="text-cyan-600 hover:underline font-semibold cursor-pointer">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
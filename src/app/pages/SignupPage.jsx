import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, Mail, Phone, Briefcase, UserCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { authAPI, apiUtils } from '../../services/api';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'admin' // Default to admin for Store Owner
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.register(formData);
      if (response.success) {
        toast.success('Registration successful! Please login.');
        // If it returns a token, we could auto-login, but let's redirect to login for clarity
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Join Pathan Hardware Management</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                formData.role === 'admin'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400'
                  : 'border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-sm font-semibold">Store Owner</span>
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                formData.role === 'customer'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400'
                  : 'border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-semibold">Customer</span>
            </button>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 h-11"
                    placeholder="Choose username"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-11"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 h-11"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-11"
                  placeholder="Create strong password"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition-all shadow-md shadow-blue-200 dark:shadow-none mt-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/select-login')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { authAPI, apiUtils } from '../../services/api';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login({ username, password });
      if (response.success) {
        apiUtils.setAuthToken(response.token);
        apiUtils.setUser(response.user);
        
        toast.success(`Welcome back, ${response.user.username}!`);
        
        // Navigate based on role
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="w-full max-w-md p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-2">Pathan Hardware</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Store Owner Login</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  placeholder="Enter username"
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
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-base font-bold transition-all shadow-md shadow-blue-200 dark:shadow-none mt-4"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/select-login')}
              className="text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 font-medium"
            >
              ← Back to login options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
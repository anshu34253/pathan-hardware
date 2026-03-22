import { useNavigate } from 'react-router';
import { Store, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="w-full max-w-4xl px-4">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-2">
            Pathan Hardware & Building Materials
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Your Trusted Partner for Quality Building Materials
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Login Option */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-blue-400 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <User className="w-8 h-8 text-blue-900 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                Customer Login
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Access your account to view products, track orders, and manage payments
              </p>
              <Button
                onClick={() => navigate('/customer-login')}
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg gap-2"
              >
                Continue as Customer
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Store Owner Login Option */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 hover:border-orange-400 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40 transition-colors">
                <Store className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                Store Owner Login
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Manage your store, inventory, customers, and financial operations
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg gap-2"
              >
                Continue as Store Owner
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

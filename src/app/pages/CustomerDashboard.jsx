import { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, Package, Clock, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { billsAPI, productsAPI, customersAPI, apiUtils } from '../../services/api';
import { Link } from 'react-router';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = apiUtils.getUser();
  const customerId = user?.customerId;

  useEffect(() => {
    if (customerId) {
      fetchDashboardData();
    } else {
        setLoading(false);
    }
  }, [customerId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [billsRes, customerRes, productsRes] = await Promise.all([
        billsAPI.getAll({ customer: customerId, limit: 5 }),
        customersAPI.getById(customerId),
        productsAPI.getAll({ limit: 4 })
      ]);
      
      setOrders(billsRes.data);
      setCustomerData(customerRes.data);
      setFeaturedProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">No Profile Found</h2>
        <p className="text-slate-600 mt-2">Please contact the store administrator to link your account.</p>
      </div>
    );
  }

  const lastOrder = orders[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">
            WELCOME BACK, {customerData?.name?.toUpperCase()}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Manage your hardware orders and credit accounts in real-time.
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-sm tracking-widest shadow-lg shadow-blue-200 dark:shadow-none">
            CUSTOMER PORTAL v1.0
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-50/50 dark:bg-blue-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-400 font-sans">
              Total Purchases
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">₹{customerData?.totalPurchases?.toLocaleString('en-IN')}</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Cumulative value</p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-red-50/50 dark:bg-red-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
              Current Udhar
            </CardTitle>
            <CreditCard className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-red-600 dark:text-red-400 italic">₹{customerData?.currentCredit?.toLocaleString('en-IN')}</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Outstanding balance</p>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-green-50/50 dark:bg-green-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">
              Orders Count
            </CardTitle>
            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">{orders.length}</div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase uppercase uppercase">Recent transactions</p>
          </CardContent>
        </Card>

        {/* Last Order */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-purple-50/50 dark:bg-purple-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Last Purchase
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">
              {lastOrder ? `₹${lastOrder.totalAmount?.toLocaleString('en-IN')}` : 'N/A'}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
              {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : 'No orders yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6 flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <CardTitle className="text-lg font-black dark:text-slate-100 italic tracking-tighter">
              RECENT BILLS
            </CardTitle>
            <Link to="/customer/orders" className="text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-400 flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {orders.length > 0 ? orders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      #{order.billNumber}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-black text-blue-900 dark:text-blue-400 text-lg italic">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </p>
                    <Badge
                      className={`font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              )) : (
                  <div className="p-12 text-center text-slate-500 font-medium italic">
                      Your recent purchase history will appear here.
                  </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Statements Summary */}
        <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6 flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <CardTitle className="text-lg font-black dark:text-slate-100 italic tracking-tighter">
              PENDING UDHAR (CREDIT)
            </CardTitle>
            <Link to="/customer/payments" className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline">
                Statement <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            {customerData?.currentCredit > 0 ? (
                <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border-2 border-red-100 dark:border-red-900/30 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-2">Total Due Balance</span>
                        <span className="text-5xl font-black text-red-600 dark:text-red-400 italic">₹{customerData.currentCredit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credit Policy Notice</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Please ensure timely settlement of outstanding dues to avoid interruptions in material delivery. You can pay at the store counter.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center">
                        <Badge className="bg-green-600 text-white border-none">CLEARED</Badge>
                    </div>
                    <div>
                        <p className="font-black text-slate-900 dark:text-slate-100 tracking-tighter">OFFERING 0% INTEREST UDHAR</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">No pending payments found</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
          <CardTitle className="text-lg font-black dark:text-slate-100 italic tracking-tighter">
            AVAILABLE MATERIALS & HARDWARE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent hover:border-blue-900 dark:hover:border-blue-400 transition-all group"
              >
                <h4 className="font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight group-hover:text-blue-900 dark:group-hover:text-blue-400">
                  {product.name}
                </h4>
                <p className="text-3xl font-black text-blue-900 dark:text-blue-400 mb-4 italic tracking-tighter">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-between">
                    <Badge
                    className={`font-black text-[9px] uppercase tracking-widest ${
                        product.quantity > 0
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/30'
                        : 'bg-red-100 text-red-700 dark:bg-red-950/30'
                    }`}
                    >
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


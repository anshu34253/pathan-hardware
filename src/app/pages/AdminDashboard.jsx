import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, TrendingUp, Package, Loader2, Briefcase, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { productsAPI, customersAPI, billsAPI } from '../../services/api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    credit: 0,
    paid: 0,
    lowStock: 0,
    totalCustomers: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productStats, customerStats, billStats, recentBills] = await Promise.all([
        productsAPI.getStats(),
        customersAPI.getStats(),
        billsAPI.getStats(),
        billsAPI.getAll({ limit: 5 })
      ]);

      setStats({
        revenue: billStats.data.total.totalRevenue || 0,
        credit: customerStats.data.summary.totalCredit || 0,
        paid: billStats.data.total.totalPaid || 0,
        lowStock: productStats.data.summary.lowStockItems || 0,
        totalCustomers: customerStats.data.summary.totalCustomers || 0
      });

      // Prepare recent transactions
      const transactions = recentBills.data.map(bill => ({
        id: bill._id,
        customer: bill.customer?.name || 'Unknown',
        amount: bill.totalAmount,
        type: bill.paymentStatus === 'Paid' ? 'Paid' : 'Credit',
        date: new Date(bill.createdAt).toLocaleDateString('en-IN')
      }));
      setRecentTransactions(transactions);

      // Mock trend logic for now - ideally backend would provide monthly trend
      const trendData = [
        { month: 'Jan', sales: 45000 },
        { month: 'Feb', sales: 52000 },
        { month: 'Mar', sales: 48000 },
        { month: 'Apr', sales: 61000 },
        { month: 'May', sales: 58000 },
        { month: 'Jun', sales: billStats.data.monthly.monthlyRevenue || 0 },
      ];
      setSalesTrend(trendData);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Dashboard Overview</h2>
        <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic">
              ₹{stats.revenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              Real-time update
            </p>
          </CardContent>
        </Card>

        {/* Total Credit/Udhar */}
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Total Credit (Udhar)
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic">
              ₹{stats.credit.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
              From {stats.totalCustomers} customers
            </p>
          </CardContent>
        </Card>

        {/* Projected Profit */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Projected Profit
            </CardTitle>
            <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">
              ₹{(stats.revenue * 0.22).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1 font-bold">
              Est. 22% Margin
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Low Stock Items
            </CardTitle>
            <Package className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic">
              {stats.lowStock}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
              Immediate restock needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-2 shadow-xl border-t-2 border-t-blue-900 dark:border-t-blue-400">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Sales Trend (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#1e3a8a"
                    strokeWidth={4}
                    dot={{ fill: '#1e3a8a', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-xl border-t-2 border-t-blue-900 dark:border-t-blue-400">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 transition-all hover:scale-[1.02]"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {transaction.customer}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 dark:text-slate-100">
                        ₹{transaction.amount.toLocaleString('en-IN')}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md inline-block mt-1 uppercase tracking-tighter ${transaction.type === 'Paid'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'
                          }`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No recent transactions found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


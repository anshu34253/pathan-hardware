import { ShoppingCart, CreditCard, Package, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const recentOrders = [
  { id: 'ORD-001', date: '2026-03-10', items: 5, total: 12500, status: 'Delivered' },
  { id: 'ORD-002', date: '2026-03-05', items: 3, total: 8700, status: 'In Transit' },
  { id: 'ORD-003', date: '2026-02-28', items: 7, total: 15200, status: 'Delivered' },
  { id: 'ORD-004', date: '2026-02-22', items: 4, total: 9800, status: 'Delivered' },
];

const pendingPayments = [
  { id: 'PAY-001', order: 'ORD-002', amount: 8700, dueDate: '2026-03-20' },
  { id: 'PAY-002', order: 'ORD-005', amount: 4500, dueDate: '2026-03-25' },
];

const featuredProducts = [
  { name: 'Portland Cement - 50kg', price: 350, stock: 'In Stock' },
  { name: 'TMT Steel Bar - 12mm', price: 580, stock: 'In Stock' },
  { name: 'Red Bricks (1000 pcs)', price: 6500, stock: 'Low Stock' },
  { name: 'PVC Pipe - 2 inch', price: 180, stock: 'In Stock' },
];

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Welcome Back!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Here's an overview of your orders and account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">24</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              All time orders
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Pending Payments
            </CardTitle>
            <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹13,200</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              2 pending invoices
            </p>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Orders
            </CardTitle>
            <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">1</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              In transit
            </p>
          </CardContent>
        </Card>

        {/* Last Order */}
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Last Order
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">₹12,500</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              5 days ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {order.id}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {order.date} • {order.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      ₹{order.total.toLocaleString()}
                    </p>
                    <Badge
                      className={`mt-1 ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {payment.order}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Due: {payment.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-700 dark:text-orange-400">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {pendingPayments.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No pending payments
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Available Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  {product.name}
                </h4>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-2">
                  ₹{product.price}
                </p>
                <Badge
                  className={`${
                    product.stock === 'In Stock'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}
                >
                  {product.stock}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

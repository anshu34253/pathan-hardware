import { CreditCard, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const paymentHistory = [
  {
    id: 'PAY-001',
    order: 'ORD-001',
    date: '2026-03-10',
    amount: 36000,
    status: 'Completed',
    method: 'Cash',
  },
  {
    id: 'PAY-002',
    order: 'ORD-002',
    date: '2026-03-05',
    amount: 8300,
    status: 'Pending',
    dueDate: '2026-03-20',
    method: 'Credit',
  },
  {
    id: 'PAY-003',
    order: 'ORD-003',
    date: '2026-02-28',
    amount: 12500,
    status: 'Completed',
    method: 'UPI',
  },
  {
    id: 'PAY-004',
    order: 'ORD-004',
    date: '2026-02-22',
    amount: 6700,
    status: 'Completed',
    method: 'Cash',
  },
  {
    id: 'PAY-005',
    order: 'ORD-005',
    date: '2026-02-15',
    amount: 4500,
    status: 'Pending',
    dueDate: '2026-03-25',
    method: 'Credit',
  },
];

export default function CustomerPayments() {
  const pendingPayments = paymentHistory.filter((p) => p.status === 'Pending');
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = paymentHistory.filter((p) => p.status === 'Completed');
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status) => {
    return status === 'Completed'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Payments
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          View your payment history and pending dues
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Paid */}
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Paid
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              ₹{totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {completedPayments.length} completed payments
            </p>
          </CardContent>
        </Card>

        {/* Pending Amount */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Pending Amount
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              ₹{totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {pendingPayments.length} pending invoices
            </p>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {paymentHistory.length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              All time transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Alert */}
      {pendingPayments.length > 0 && (
        <Card className="shadow-sm border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Total pending amount: ₹{totalPending.toLocaleString()}
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.order}</TableCell>
                  <TableCell>
                    {payment.date}
                    {payment.dueDate && (
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        Due: {payment.dueDate}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === 'Completed' ? (
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Receipt
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

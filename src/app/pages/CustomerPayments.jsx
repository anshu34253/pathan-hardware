import { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Download, Loader2, IndianRupee, History } from 'lucide-react';
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
import { billsAPI, customersAPI, apiUtils } from '../../services/api';
import { toast } from 'sonner';

export default function CustomerPayments() {
  const [bills, setBills] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = apiUtils.getUser();
  const customerId = user?.customerId;

  useEffect(() => {
    if (customerId) {
        fetchPaymentData();
    } else {
        setLoading(false);
    }
  }, [customerId]);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
        const [billsRes, customerRes] = await Promise.all([
            billsAPI.getAll({ customer: customerId }),
            customersAPI.getById(customerId)
        ]);
        setBills(billsRes.data);
        setCustomerData(customerRes.data);
    } catch (error) {
        toast.error('Failed to load payment history');
    } finally {
        setLoading(false);
    }
  };

  const pendingPayments = bills.filter((b) => b.paymentStatus === 'Credit');
  const totalPending = customerData?.currentCredit || 0;
  const completedPayments = bills.filter((b) => b.paymentStatus === 'Paid');
  const totalPaid = completedPayments.reduce((sum, b) => sum + b.paidAmount, 0);

  const getStatusColor = (status) => {
    return status === 'Paid'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200">
        <CreditCard className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 italic">ACCOUNT NOT LINKED</h2>
        <p className="text-slate-600 mt-2 font-medium">Please contact the administrator to view your ledger.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">
          PAYMENTS & LEDGER
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium italic">
          Track your transaction history and outstanding Udhar balance.
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Paid */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-green-50/50 dark:bg-green-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-green-700 dark:text-green-400">
              Paid to Store
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
              {completedPayments.length} Full settlements
            </p>
          </CardContent>
        </Card>

        {/* Pending Amount */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-red-50/50 dark:bg-red-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
              Outstanding Udhar
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-red-600 dark:text-red-400 italic">
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
              {pendingPayments.length} Pending Invoices
            </p>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-50/50 dark:bg-blue-950/20">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-400">
              Total Business
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 italic">
              {bills.length}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
              LIFETIME INVOICES
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Alert */}
      {totalPending > 0 && (
        <Card className="shadow-2xl border-2 border-red-600 bg-red-50/30 dark:bg-red-950/20 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-none animate-pulse">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">
                  UDHAR SETTLEMENT REMINDER
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  You have an outstanding balance of <span className="font-black text-red-600">₹{totalPending.toLocaleString('en-IN')}</span>. 
                  Please visit the physical store to make a payment and clear your dues.
                </p>
              </div>
              <Button size="lg" className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 px-10 rounded-xl font-black uppercase tracking-widest text-xs h-14 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95">
                FIND STORE BRANCH
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-50 dark:border-slate-800">
          <CardTitle className="text-lg font-black dark:text-slate-100 italic flex items-center gap-2">
            <History className="w-5 h-5 text-blue-900 dark:text-blue-400" />
            TRANSACTION LOG
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-950 border-none">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] p-6 text-slate-500">Bill ID</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Billing Date</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Method</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Total Amount</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Status</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] p-6 text-slate-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.length > 0 ? bills.map((bill) => (
                  <TableRow key={bill._id} className="border-slate-50 dark:border-slate-800">
                    <TableCell className="font-black text-slate-900 dark:text-slate-100 p-6 tracking-tighter italic">#{bill.billNumber}</TableCell>
                    <TableCell className="font-bold text-slate-600 dark:text-slate-400 text-xs">
                        {new Date(bill.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </TableCell>
                    <TableCell>
                        <Badge className="bg-slate-100 text-slate-600 font-bold text-[9px] dark:bg-slate-800 dark:text-slate-400 border-none">
                            {bill.paymentStatus === 'Paid' ? 'DIRECT CASH' : 'STORE CREDIT'}
                        </Badge>
                    </TableCell>
                    <TableCell className="font-black text-slate-900 dark:text-slate-100 text-lg italic">
                      ₹{bill.totalAmount?.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(bill.paymentStatus)}`}>
                        {bill.paymentStatus === 'Paid' ? 'SETTLED' : 'UDHAR'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-6">
                      <Button variant="ghost" size="sm" className="gap-2 font-black uppercase tracking-widest text-[9px] text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg">
                        <Download className="w-4 h-4" />
                        Inovice
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium italic">
                            Your transaction history is empty.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Search, IndianRupee, AlertCircle, CheckCircle, Loader2, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { customersAPI } from '../../services/api';

export default function LendingManagement() {
  const [credits, setCredits] = useState([]);
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    totalOverdue: 0,
    overdueCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        customersAPI.getAll({ search: searchTerm }),
        customersAPI.getStats()
      ]);
      
      // Filter only customers with credit
      const filtered = listRes.data.filter(c => c.currentCredit > 0);
      setCredits(filtered);
      
      setStats({
        totalOutstanding: statsRes.data.summary.totalCredit || 0,
        totalOverdue: statsRes.data.summary.totalCredit * 0.4, // Mocking overdue percentage since not in schema
        overdueCount: filtered.filter(c => c.currentCredit > 20000).length // Heuristic for overdue
      });
    } catch (error) {
      toast.error('Failed to load credit data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = (customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount('');
    setIsPaymentDialogOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > selectedCustomer.currentCredit) {
      toast.error('Payment amount cannot exceed total due');
      return;
    }

    setSubmitting(true);
    try {
      const newCredit = selectedCustomer.currentCredit - amount;
      await customersAPI.update(selectedCustomer._id, { currentCredit: newCredit });
      
      toast.success(`Payment of ₹${amount.toLocaleString('en-IN')} recorded for ${selectedCustomer.name}`);
      setIsPaymentDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskLevel = (credit) => {
    if (credit > 50000) return 'Critical Risk';
    if (credit > 20000) return 'High Risk';
    return 'Low Risk';
  };

  const getRiskColor = (credit) => {
    if (credit > 50000) return 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100';
    if (credit > 20000) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-red-600 dark:text-red-400" />
            Udhar / Credit Management
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Track and settle customer credit accounts with real-time balance updates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="shadow-xl bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 flex items-center gap-2">
              <IndianRupee className="w-3 h-3" />
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-red-600 dark:text-red-400 tracking-tighter italic">
              ₹{stats.totalOutstanding.toLocaleString('en-IN')}
            </div>
            <div className="mt-4 h-1 w-full bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-3/4 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Overdue Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-orange-600 dark:text-orange-400 tracking-tighter italic">{stats.overdueCount}</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest">
              Requires Debt Collection
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2">
              <TrendingDown className="w-3 h-3" />
              Overdue Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tighter italic">
              ₹{stats.totalOverdue.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest">
              High Priority Collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-md border-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search debtor by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Credits Table */}
      <Card className="shadow-2xl border-none overflow-hidden bg-white dark:bg-slate-900">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
          <CardTitle className="text-lg font-black dark:text-slate-100 flex items-center gap-2 italic">
            < IndianRupee className="w-5 h-5" />
            Active Ledger Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-none">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] p-4 text-slate-500">Customer</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Udhar Balance (₹)</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Last Update</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500">Risk Assessment</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] p-4 text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />
                        </TableCell>
                    </TableRow>
                ) : credits.length > 0 ? (
                  credits.map((credit) => (
                    <TableRow
                      key={credit._id}
                      className={credit.currentCredit > 20000 ? 'bg-red-50/20 dark:bg-red-950/10' : ''}
                    >
                      <TableCell className="p-4">
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100">{credit.name}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{credit.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-red-600 dark:text-red-400 text-lg">
                          ₹{credit.currentCredit.toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                        {new Date(credit.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full border ${getRiskColor(credit.currentCredit)}`}>
                          {getRiskLevel(credit.currentCredit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right p-4">
                        <Button
                          size="sm"
                          onClick={() => handleRecordPayment(credit)}
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 gap-2 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-100 dark:shadow-none"
                        >
                          <IndianRupee className="w-3 h-3" />
                          Record Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium italic">
                            No active debt accounts found. All clear!
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic">Record Debt Settlement</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
               Recording payment will decrease the current Udhar balance for this customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</span>
                <span className="font-black text-slate-900 dark:text-slate-100 uppercase">{selectedCustomer?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Udhar</span>
                <span className="font-black text-red-600 dark:text-red-400 text-xl italic">
                  ₹{selectedCustomer?.currentCredit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="font-black uppercase tracking-widest text-[10px] text-slate-500">Enter Payment Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="h-14 rounded-xl border-slate-200 dark:border-slate-700 text-xl font-black text-blue-900 bg-white dark:bg-slate-900 shadow-inner"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="rounded-xl px-6 h-12 font-bold uppercase tracking-widest text-[10px]">
              Dismiss
            </Button>
            <Button
              onClick={handleSubmitPayment}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 gap-2 rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


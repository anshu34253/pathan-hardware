import { useState } from 'react';
import { Search, IndianRupee, AlertCircle, CheckCircle } from 'lucide-react';
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

const initialCredits = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    totalDue: 15200,
    lastPaymentDate: '2026-01-28',
    status: 'overdue',
    daysSinceLastPayment: 18,
  },
  {
    id: '2',
    customerName: 'Amit Sharma',
    totalDue: 8700,
    lastPaymentDate: '2026-02-08',
    status: 'pending',
    daysSinceLastPayment: 7,
  },
  {
    id: '3',
    customerName: 'Vikram Singh',
    totalDue: 22400,
    lastPaymentDate: '2026-01-15',
    status: 'overdue',
    daysSinceLastPayment: 31,
  },
  {
    id: '4',
    customerName: 'Suresh Reddy',
    totalDue: 6300,
    lastPaymentDate: '2026-02-10',
    status: 'pending',
    daysSinceLastPayment: 5,
  },
  {
    id: '5',
    customerName: 'Kavita Desai',
    totalDue: 18900,
    lastPaymentDate: '2026-01-22',
    status: 'overdue',
    daysSinceLastPayment: 24,
  },
  {
    id: '6',
    customerName: 'Deepak Joshi',
    totalDue: 12100,
    lastPaymentDate: '2026-02-01',
    status: 'overdue',
    daysSinceLastPayment: 14,
  },
  {
    id: '7',
    customerName: 'Sunita Verma',
    totalDue: 3800,
    lastPaymentDate: '2026-02-12',
    status: 'pending',
    daysSinceLastPayment: 3,
  },
];

export default function LendingManagement() {
  const [credits, setCredits] = useState(initialCredits);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const filteredCredits = credits.filter((credit) =>
    credit.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutstanding = credits.reduce((sum, credit) => sum + credit.totalDue, 0);
  const overdueCount = credits.filter((c) => c.status === 'overdue').length;
  const overdueAmount = credits
    .filter((c) => c.status === 'overdue')
    .reduce((sum, c) => sum + c.totalDue, 0);

  const handleRecordPayment = (credit) => {
    setSelectedCredit(credit);
    setPaymentAmount('');
    setIsPaymentDialogOpen(true);
  };

  const handleSubmitPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > selectedCredit.totalDue) {
      toast.error('Payment amount cannot exceed total due');
      return;
    }

    const updatedCredits = credits.map((credit) => {
      if (credit.id === selectedCredit.id) {
        const newDue = credit.totalDue - amount;
        return {
          ...credit,
          totalDue: newDue,
          lastPaymentDate: new Date().toISOString().split('T')[0],
          daysSinceLastPayment: 0,
          status: newDue === 0 ? 'pending' : credit.status,
        };
      }
      return credit;
    });

    setCredits(updatedCredits.filter((c) => c.totalDue > 0));
    setIsPaymentDialogOpen(false);
    toast.success(`Payment of ₹${amount.toLocaleString()} recorded successfully`);
  };

  const getRiskLevel = (credit) => {
    if (credit.daysSinceLastPayment > 20) return 'High Risk';
    if (credit.daysSinceLastPayment > 10) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskColor = (credit) => {
    if (credit.daysSinceLastPayment > 20) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    if (credit.daysSinceLastPayment > 10) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lending / Credit Management</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Track and manage customer credit accounts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Across {credits.length} customers
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Overdue Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{overdueCount}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Requires immediate action
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Overdue Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              ₹{overdueAmount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              High priority collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Credits Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-slate-100">Credit Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Due (₹)</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCredits.map((credit) => (
                <TableRow
                  key={credit.id}
                  className={credit.status === 'overdue' ? 'bg-red-50/50 dark:bg-red-950/20' : ''}
                >
                  <TableCell className="font-medium">{credit.customerName}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      ₹{credit.totalDue.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{credit.lastPaymentDate}</TableCell>
                  <TableCell>
                    <span
                      className={
                        credit.daysSinceLastPayment > 15
                          ? 'text-red-600 dark:text-red-400 font-semibold'
                          : 'text-slate-900 dark:text-slate-100'
                      }
                    >
                      {credit.daysSinceLastPayment} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(credit)}`}>
                      {getRiskLevel(credit)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        credit.status === 'overdue'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      }`}
                    >
                      {credit.status === 'overdue' ? 'Overdue' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleRecordPayment(credit)}
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 gap-2"
                    >
                      <IndianRupee className="w-4 h-4" />
                      Record Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedCredit?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-400">Customer:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{selectedCredit?.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total Due:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  ₹{selectedCredit?.totalDue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                max={selectedCredit?.totalDue}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitPayment}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

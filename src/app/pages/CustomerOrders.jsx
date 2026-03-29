import { useState, useEffect } from 'react';
import { Package, Eye, Loader2, Calendar, IndianRupee } from 'lucide-react';
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
import { billsAPI, apiUtils } from '../../services/api';
import { toast } from 'sonner';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = apiUtils.getUser();
  const customerId = user?.customerId;

  useEffect(() => {
    if (customerId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [customerId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await billsAPI.getAll({ customer: customerId });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200';
      case 'In Transit':
      case 'Shipped':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200';
      case 'Processing':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Paid'
      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
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
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 italic">PROFILE NOT LINKED</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Please contact the administrator to view your order history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">
            MY PURCHASE HISTORY
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Track your material orders and download invoices instantly.
          </p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
            <Package className="w-5 h-5 text-blue-900 dark:text-blue-400" />
            <span className="font-black text-slate-900 dark:text-slate-100 text-sm tracking-widest">{orders.length} TOTAL BILLS</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-8">
        {orders.length > 0 ? orders.map((order) => (
          <Card key={order._id} className="shadow-2xl border-none bg-white dark:bg-slate-900 overflow-hidden hover:ring-2 hover:ring-blue-900 dark:hover:ring-blue-400 transition-all group">
            <CardHeader className="pb-6 p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter italic flex items-center gap-2">
                      INVOICE #{order.billNumber}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge className="font-black text-[9px] uppercase tracking-widest px-3 py-1 bg-white border-2 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </Badge>
                    </div>
                  </div>
                </div>
                <div className="lg:text-right flex flex-col lg:items-end gap-3 rounded-2xl p-4 bg-white dark:bg-slate-800 shadow-inner">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-blue-900 dark:text-blue-400 italic">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`font-black text-[10px] uppercase tracking-[0.1em] border-2 px-3 py-1 shadow-sm ${getStatusColor(order.status || 'Delivered')}`}>
                      {order.status || 'DELIVERED'}
                    </Badge>
                    <Badge className={`font-black text-[10px] uppercase tracking-[0.1em] border-2 px-3 py-1 shadow-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === 'Paid' ? 'FULL PAYMENT' : 'UDHAR (UNPAID)'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="overflow-x-auto rounded-2xl border-2 border-slate-50 dark:border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-none">
                      <TableHead className="font-black uppercase tracking-widest text-[10px] p-4">Material / Product</TableHead>
                      <TableHead className="text-right font-black uppercase tracking-widest text-[10px]">Quantity</TableHead>
                      <TableHead className="text-right font-black uppercase tracking-widest text-[10px]">Unit Rate (₹)</TableHead>
                      <TableHead className="text-right font-black uppercase tracking-widest text-[10px] p-4">Net Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items?.map((item, index) => (
                      <TableRow key={index} className="border-slate-50 dark:border-slate-800">
                        <TableCell className="font-black text-slate-800 dark:text-slate-100 p-4">
                            {item.product?.name || 'Loading material...'}
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SKU: {item.product?.sku || 'N/A'}</p>
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">{item.quantity} {item.product?.unit || 'Units'}</TableCell>
                        <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">₹{item.pricePerUnit?.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right font-black text-blue-900 dark:text-blue-400 p-4">
                          ₹{(item.quantity * item.pricePerUnit).toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-2xl border-2 border-blue-50 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Billing Support</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Contact store for any discrepancies</p>
                    </div>
                </div>
                <Button className="w-full md:w-auto px-8 h-12 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 gap-3 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95">
                  <Eye className="w-4 h-4" />
                  View Original Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
            <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-none">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">NO ORDERS FOUND</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-sm mx-auto">
                    You haven't made any purchases yet. Your invoices will appear here once generated.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}


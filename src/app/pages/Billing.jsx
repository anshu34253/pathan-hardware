import { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, Loader2, User, Package, Calculator, Download, Percent, BadgePercent, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { productsAPI, customersAPI, billsAPI } from '../../services/api';

export default function Billing() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [billItems, setBillItems] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  
  // Tax & Discount States
  const [discount, setDiscount] = useState('0');
  const [taxRate, setTaxRate] = useState('18');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsRes, customersRes, recentBillsRes] = await Promise.all([
        productsAPI.getAll(),
        customersAPI.getAll(),
        billsAPI.getAll({ limit: 10 })
      ]);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setRecentBills(recentBillsRes.data);
    } catch (error) {
      toast.error('Failed to load products, customers or recent bills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || !quantity) {
      toast.error('Please select a product and quantity');
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (qty > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.unit} available in stock`);
      return;
    }

    const existingItemIndex = billItems.findIndex(item => item.product._id === selectedProductId);
    if (existingItemIndex > -1) {
      const updatedItems = [...billItems];
      updatedItems[existingItemIndex].quantity += qty;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * product.price;
      setBillItems(updatedItems);
    } else {
      const total = product.price * qty;
      const item = {
        id: Date.now().toString(),
        product: product,
        price: product.price,
        quantity: qty,
        total: total,
      };
      setBillItems([...billItems, item]);
    }

    setSelectedProductId('');
    setQuantity('');
  };

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    const amount = parseFloat(discount) || 0;
    return amount;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const disc = calculateDiscount();
    const rate = parseFloat(taxRate) || 0;
    return (subtotal - disc) * (rate / 100);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleGenerateBill = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (billItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const subtotal = calculateSubtotal();
      const disc = calculateDiscount();
      const tax = calculateTax();
      const total = calculateGrandTotal();
      
      const payload = {
        customer: selectedCustomerId,
        items: billItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.total
        })),
        subtotal: subtotal,
        discount: disc,
        tax: tax,
        totalAmount: total,
        paymentType: paymentStatus.toLowerCase(),
        paidAmount: paymentStatus === 'Paid' ? total : 0,
        dueAmount: paymentStatus === 'Credit' ? total : 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: user?.id || user?._id,
        status: 'completed'
      };

      await billsAPI.create(payload);
      
      toast.success(`Bill generated successfully for ₹${total.toLocaleString('en-IN')}`);
      
      // Reset form
      setSelectedCustomerId('');
      setBillItems([]);
      setPaymentStatus('Paid');
      setDiscount('0');
      fetchInitialData(); // Refresh stock and recent list
    } catch (error) {
      toast.error(error.message || 'Failed to generate bill');
    } finally {
      setSubmitting(false);
    }
  };

  const exportToCSV = () => {
    if (recentBills.length === 0) {
      toast.error('No bills available to export');
      return;
    }

    const headers = ['Bill Number', 'Customer', 'Date', 'Amount (₹)', 'Status', 'Payment Type'];
    const rows = recentBills.map(bill => [
      bill.billNumber,
      bill.customer?.name || 'Unknown',
      new Date(bill.createdAt).toLocaleDateString(),
      bill.totalAmount,
      bill.status,
      bill.paymentType
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ProBuild_Bills_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Billing data exported as CSV');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900 dark:text-blue-400" />
      </div>
    );
  }

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            Modern Billing Engine
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Precision invoicing with automated GST and inventory syncing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="shadow-lg border-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 flex flex-row items-center gap-3">
              <User className="w-5 h-5 text-blue-900 dark:text-blue-400" />
              <CardTitle className="text-lg font-bold dark:text-slate-100">Customer Identity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 dark:text-slate-300">Choose Customer</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Search or select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        {customer.name} ({customer.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Add Products */}
          <Card className="shadow-lg border-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 flex flex-row items-center gap-3">
              <Package className="w-5 h-5 text-blue-900 dark:text-blue-400" />
              <CardTitle className="text-lg font-bold dark:text-slate-100">Inventory Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Product</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id} disabled={product.quantity <= 0}>
                          {product.name} (Stock: {product.quantity} {product.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter amount"
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleAddItem}
                    className="w-full h-12 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 gap-2 rounded-xl font-bold transition-all shadow-md active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bill Items */}
          <Card className="shadow-xl border-none bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 flex flex-row items-center gap-3">
              <Calculator className="w-5 h-5 text-blue-900 dark:text-blue-400" />
              <CardTitle className="text-lg font-bold dark:text-slate-100">Live Item List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {billItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-medium italic">
                  No materials added to the bill yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border-none">
                        <TableHead className="font-bold p-4">Material</TableHead>
                        <TableHead className="font-bold">Rate (₹)</TableHead>
                        <TableHead className="font-bold">Quantity</TableHead>
                        <TableHead className="font-bold">Amount (₹)</TableHead>
                        <TableHead className="text-right font-bold p-4">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billItems.map((item) => (
                        <TableRow key={item.id} className="border-slate-100 dark:border-slate-800">
                          <TableCell className="font-bold text-slate-900 dark:text-slate-100 p-4">{item.product.name}</TableCell>
                          <TableCell className="font-medium">₹{item.price.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="font-medium">
                            {item.quantity} <span className="text-xs text-slate-500">{item.product.unit}</span>
                          </TableCell>
                          <TableCell className="font-black text-blue-900 dark:text-blue-400">₹{item.total.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-9 h-9 p-0 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <Card className="shadow-2xl border-2 border-blue-900 dark:border-blue-600 rounded-2xl overflow-hidden sticky top-6">
            <CardHeader className="bg-blue-900 text-white p-6">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Receipt className="w-6 h-6" />
                PROFESSIONAL INVOICE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-white dark:bg-slate-900">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Customer</span>
                  <span className="font-black text-slate-900 dark:text-slate-100">
                    {selectedCustomer ? selectedCustomer.name : 'Not Selected'}
                  </span>
                </div>
                
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-bold">Subtotal</span>
                        <span className="font-bold">₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold flex items-center gap-1">
                                <BadgePercent className="w-3 h-3" /> Discount (₹)
                            </span>
                            <Input 
                                type="number" 
                                value={discount} 
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-20 h-8 text-right font-bold text-xs"
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-bold flex items-center gap-1">
                                <Percent className="w-3 h-3" /> GST (%)
                            </span>
                            <Input 
                                type="number" 
                                value={taxRate} 
                                onChange={(e) => setTaxRate(e.target.value)}
                                className="w-20 h-8 text-right font-bold text-xs"
                            />
                        </div>
                    </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900/50 dark:text-blue-400 mb-1">Total Payable</span>
                  <span className="text-4xl font-black text-blue-900 dark:text-blue-400 italic">
                    ₹{calculateGrandTotal().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-black uppercase tracking-widest text-[10px] text-slate-500">Settlement Method</Label>
                <RadioGroup value={paymentStatus} onValueChange={setPaymentStatus} className="grid grid-cols-1 gap-3">
                  <div
                    className={`flex items-center space-x-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentStatus === 'Paid'
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20'
                      }`}
                    onClick={() => setPaymentStatus('Paid')}
                  >
                    <RadioGroupItem value="Paid" id="paid" className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentStatus === 'Paid' ? 'border-green-500' : 'border-slate-300'}`}>
                      {paymentStatus === 'Paid' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                    </div>
                    <Label htmlFor="paid" className="cursor-pointer flex-1">
                      <div className="font-black text-green-700 dark:text-green-400 text-sm">CASH PAID</div>
                      <div className="text-[10px] font-medium text-green-600 dark:text-green-500 uppercase">Immediate Settlement</div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentStatus === 'Credit'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20'
                      }`}
                    onClick={() => setPaymentStatus('Credit')}
                  >
                    <RadioGroupItem value="Credit" id="credit" className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentStatus === 'Credit' ? 'border-orange-500' : 'border-slate-300'}`}>
                      {paymentStatus === 'Credit' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                    </div>
                    <Label htmlFor="credit" className="cursor-pointer flex-1">
                      <div className="font-black text-orange-700 dark:text-orange-400 text-sm">CREDIT (UDHAR)</div>
                      <div className="text-[10px] font-medium text-orange-600 dark:text-orange-500 uppercase">Add to ledger account</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleGenerateBill}
                disabled={submitting || billItems.length === 0}
                className="w-full h-14 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-lg font-black tracking-widest gap-3 rounded-xl shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Receipt className="w-6 h-6" />
                    FINALIZE BILL
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <Card className="shadow-lg border-none bg-white dark:bg-slate-900 overflow-hidden mt-8">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-blue-900 dark:text-blue-400" />
            <CardTitle className="text-lg font-bold dark:text-slate-100">Live Billing Stream</CardTitle>
          </div>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="gap-2 border-blue-900 text-blue-900 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 font-bold"
          >
            <Download className="w-4 h-4" />
            Export Audit Trial
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border-none">
                  <TableHead className="font-bold p-6">Reference #</TableHead>
                  <TableHead className="font-bold">Entity</TableHead>
                  <TableHead className="font-bold">Transaction Date</TableHead>
                  <TableHead className="font-bold">Amount (₹)</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right p-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBills.map((bill) => (
                  <TableRow key={bill._id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-bold text-slate-900 dark:text-slate-100 p-6">{bill.billNumber}</TableCell>
                    <TableCell className="font-medium">{bill.customer?.name || 'Unknown Entity'}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-black">₹{bill.totalAmount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        bill.paymentType === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {bill.paymentType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        bill.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {bill.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right p-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/invoice/${bill._id}`)}
                        className="w-10 h-10 p-0 rounded-xl hover:bg-blue-50 text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {recentBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400 font-medium italic">
                      No recent transaction records found.
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

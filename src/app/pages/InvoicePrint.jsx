import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Printer, ArrowLeft, Loader2, Download, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { billsAPI } from '../../services/api';
import { toast } from 'sonner';

export default function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      const response = await billsAPI.getById(id);
      setBill(response.data);
    } catch (error) {
      toast.error('Failed to load invoice details');
      navigate('/admin/billing');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!bill) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8 pb-20 print:p-0 print:bg-white">
      {/* Controls - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/billing')}
          className="gap-2 font-bold text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Billing
        </Button>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="bg-blue-900 hover:bg-blue-800 gap-2 font-bold shadow-lg">
            <Printer className="w-4 h-4" /> Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <Card className="max-w-4xl mx-auto shadow-2xl border-none bg-white dark:bg-white text-slate-900 rounded-none overflow-hidden print:shadow-none print:m-0 print:max-w-none print:w-full">
        <CardContent className="p-12 space-y-12 print:p-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b-4 border-blue-900 pb-8">
            <div>
              <h1 className="text-4xl font-black text-blue-900 italic tracking-tighter mb-2">PATHAN HARDWARE</h1>
              <div className="space-y-1 text-slate-500 font-bold text-sm">
                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Main Road, Near by bank of india
                  Sindi(rly), Maharashtra 442105</p>
                <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> +91 98765 43210</p>
                <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> support@pathanhardware.com</p>
                <p className="mt-2 text-blue-900">GSTIN: 29ABCDE1234F1Z5</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-4">INVOICE</h2>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Invoice Date</p>
                <p className="font-black text-lg">{new Date(bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4">Invoice #</p>
                <p className="font-black text-blue-900 text-xl">{bill.billNumber}</p>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Bill To</h3>
              <div>
                <p className="text-xl font-black text-blue-900">{bill.customer?.name}</p>
                <p className="font-bold text-slate-600 mt-1">{bill.customer?.phone}</p>
                <p className="text-slate-500 text-sm mt-2">{bill.customer?.address?.street}</p>
                <p className="text-slate-500 text-sm">{bill.customer?.address?.city}, {bill.customer?.address?.state}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold text-sm">Status</span>
                  <span className="font-black text-green-600 uppercase text-sm">{bill.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold text-sm">Method</span>
                  <span className="font-black text-blue-900 uppercase text-sm">{bill.paymentType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="p-4 border-b border-slate-200">Description</th>
                  <th className="p-4 border-b border-slate-200">Unit Price</th>
                  <th className="p-4 border-b border-slate-200 text-center">Qty</th>
                  <th className="p-4 border-b border-slate-200 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {bill.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="p-4 font-black text-slate-800">{item.product?.name || 'Loading item...'}</td>
                    <td className="p-4 font-bold text-slate-500">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="p-4 font-bold text-slate-500 text-center">{item.quantity}</td>
                    <td className="p-4 font-black text-blue-900 text-right">₹{item.totalPrice.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summation */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-400 font-black uppercase tracking-widest">Subtotal</span>
                <span className="font-bold text-slate-800">₹{bill.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-400 font-black uppercase tracking-widest">Discount (-)</span>
                <span className="font-bold text-red-600">₹{bill.discount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm items-center border-b border-slate-100 pb-4">
                <span className="text-slate-400 font-black uppercase tracking-widest">GST (Tax) (+)</span>
                <span className="font-bold text-slate-800">₹{bill.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-blue-50 px-4 rounded-xl">
                <span className="text-blue-900 font-black uppercase tracking-widest italic">Grand Total</span>
                <span className="text-3xl font-black text-blue-900">₹{bill.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-20 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-black italic text-lg">Thank you for your business!</span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest px-20">
              Goods once sold will not be taken back or exchanged. This is a computer generated invoice and does not require a physical signature.
            </p>
          </div>
        </CardContent>
      </Card>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:max-w-none { max-width: none !important; }
          
          /* Ensure text and colors are high contrast */
          .text-blue-900 { color: #1e3a8a !important; }
          .bg-blue-900 { background-color: #1e3a8a !important; }
          .border-blue-900 { border-color: #1e3a8a !important; }
        }
      `}} />
    </div>
  );
}

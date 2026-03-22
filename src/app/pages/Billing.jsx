import { useState } from 'react';
import { Plus, Trash2, Receipt } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
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

const customers = [
  'Rajesh Kumar',
  'Amit Sharma',
  'Priya Patel',
  'Vikram Singh',
  'Neha Gupta',
  'Suresh Reddy',
  'Kavita Desai',
];

const products = [
  { name: 'Cement (OPC 53)', price: 420 },
  { name: 'Steel Rods (12mm)', price: 65 },
  { name: 'Sand (River)', price: 1800 },
  { name: 'Bricks (Red)', price: 8 },
  { name: 'Gravel (20mm)', price: 1500 },
  { name: 'Paint (White)', price: 850 },
  { name: 'Tiles (Ceramic)', price: 45 },
  { name: 'Wood Planks', price: 120 },
];

export default function Billing() {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [paymentType, setPaymentType] = useState('paid');
  const [billItems, setBillItems] = useState([]);

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) {
      toast.error('Please select a product and quantity');
      return;
    }

    const product = products.find((p) => p.name === selectedProduct);
    const qty = parseInt(quantity);
    const total = product.price * qty;

    const item = {
      id: Date.now().toString(),
      product: selectedProduct,
      price: product.price,
      quantity: qty,
      total: total,
    };

    setBillItems([...billItems, item]);
    setSelectedProduct('');
    setQuantity('');
  };

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleGenerateBill = () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (billItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    toast.success(`Bill generated for ${selectedCustomer} - ₹${calculateTotal().toLocaleString()} (${paymentType === 'paid' ? 'Paid' : 'Credit/Udhar'})`);
    
    // Reset form
    setSelectedCustomer('');
    setBillItems([]);
    setPaymentType('paid');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Bill</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Generate invoices for customer orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold dark:text-slate-100">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer} value={customer}>
                        {customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Add Products */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold dark:text-slate-100">Add Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button
                    onClick={handleAddItem}
                    className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bill Items */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold dark:text-slate-100">Bill Items</CardTitle>
            </CardHeader>
            <CardContent>
              {billItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No items added yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total (₹)</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-semibold">₹{item.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <Card className="shadow-sm border-2 border-blue-900 dark:border-blue-600">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
              <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Customer:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedCustomer || '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Items:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{billItems.length}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <Label className="mb-3 block">Payment Type</Label>
                <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid" className="cursor-pointer flex-1">
                      <div className="font-medium text-green-900 dark:text-green-400">Paid</div>
                      <div className="text-xs text-green-700 dark:text-green-500">Full payment received</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="cursor-pointer flex-1">
                      <div className="font-medium text-orange-900 dark:text-orange-400">Credit / Udhar</div>
                      <div className="text-xs text-orange-700 dark:text-orange-500">Add to customer dues</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleGenerateBill}
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-base gap-2"
              >
                <Receipt className="w-5 h-5" />
                Generate Bill
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

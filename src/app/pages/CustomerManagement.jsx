import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, Loader2, Users } from 'lucide-react';
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

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCredit: 0,
    activeCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    customerType: 'General',
    address: {
      street: '',
      city: '',
      state: ''
    }
  });

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
      setCustomers(listRes.data);
      setStats(statsRes.data.summary);
    } catch (error) {
      toast.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        customerType: customer.customerType || 'General',
        address: {
          street: customer.address?.street || '',
          city: customer.address?.city || '',
          state: customer.address?.state || ''
        }
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        customerType: 'General',
        address: { street: '', city: '', state: '' }
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Name and Phone are required');
      return;
    }

    try {
      if (editingCustomer) {
        await customersAPI.update(editingCustomer._id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customersAPI.create(formData);
        toast.success('Customer added successfully');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        toast.success('Customer deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const getDueStatusColor = (due) => {
    if (due <= 0) return 'text-green-600 dark:text-green-400';
    if (due < 10000) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getDueBadgeColor = (due) => {
    if (due <= 0) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (due < 10000) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            Customer Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Manage customer information and credit balances</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 gap-2 shadow-lg h-11 px-6 rounded-xl font-bold"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-md border-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Business Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {stats.totalCustomers}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Debtors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
              {customers.filter(c => c.currentCredit > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Outstanding (Udhar)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
              ₹{stats.totalCredit.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="shadow-xl border-none overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
          <CardTitle className="text-lg font-bold dark:text-slate-100">Customer Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-none">
                  <TableHead className="font-bold">Customer Name</TableHead>
                  <TableHead className="font-bold">Contact Info</TableHead>
                  <TableHead className="font-bold">Outstanding</TableHead>
                  <TableHead className="font-bold">Total Business</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold p-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-900 dark:text-blue-400" />
                    </TableCell>
                  </TableRow>
                ) : customers.length > 0 ? (
                  customers.map((customer) => (
                    <TableRow 
                      key={customer._id}
                      className={customer.currentCredit > 10000 ? 'bg-red-50/30 dark:bg-red-950/10' : ''}
                    >
                      <TableCell className="font-bold text-slate-900 dark:text-slate-100">{customer.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{customer.phone}</p>
                          <p className="text-xs text-slate-500">{customer.email || 'No email'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-black ${getDueStatusColor(customer.currentCredit)}`}>
                          ₹{customer.currentCredit.toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                        ₹{customer.totalPurchases.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getDueBadgeColor(customer.currentCredit)}`}>
                          {customer.currentCredit <= 0 ? 'Clear' : customer.currentCredit < 10000 ? 'Due' : 'High Risk'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 p-0 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400"
                            onClick={() => handleOpenDialog(customer)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 p-0 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400"
                            onClick={() => handleDelete(customer._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                      No customers found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer ? 'Update customer profile and contact details' : 'Register a new customer for billing and credit management'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rajesh Kumar, etc."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98XXX XXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold">Address (City)</Label>
              <Input
                value={formData.address.city}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, city: e.target.value } 
                })}
                placeholder="Mumbra, Thane, etc."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 px-6 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none"
              >
                {editingCustomer ? 'Update' : 'Register'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


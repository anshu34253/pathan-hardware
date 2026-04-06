import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, MapPin, Edit, Trash2, Loader2, Building, Globe, BadgeCheck, X, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { suppliersAPI } from '../../services/api';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    paymentTerms: 'Net 30',
    address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
    }
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData({
            ...formData,
            [parent]: { ...formData[parent], [child]: value }
        });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersAPI.update(editingSupplier._id, formData);
        toast.success('Supplier updated successfully');
      } else {
        await suppliersAPI.create(formData);
        toast.success('Supplier added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      toast.error(error.message || 'Error saving supplier');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this supplier?')) return;
    try {
      await suppliersAPI.delete(id);
      toast.success('Supplier removed');
      fetchSuppliers();
    } catch (error) {
      toast.error('Failed to delete supplier');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      gstNumber: '',
      paymentTerms: 'Net 30',
      address: {
          street: '',
          city: '',
          state: '',
          pincode: ''
      }
    });
    setEditingSupplier(null);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Building className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            Supply Chain Network
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Manage your manufacturer and wholesale relationships</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 font-bold rounded-xl gap-2 shadow-xl active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
              Onboard Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic tracking-tighter">
                {editingSupplier ? 'MODIFY SUPPLIER IDENTITY' : 'NEW VENDOR ONBOARDING'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Business Legal Name</Label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. TATA Steel Ltd" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Primary GSTIN</Label>
                  <Input name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="27XXXXX0000X1Z1" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Contact Person</Label>
                  <Input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Point of contact name" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Official Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Registered Office Address</Label>
                  <Input name="address.street" value={formData.address.street} onChange={handleInputChange} placeholder="Street, Building, Area" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">City</Label>
                  <Input name="address.city" value={formData.address.city} onChange={handleInputChange} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(v) => setFormData({...formData, paymentTerms: v})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Advance">Immediate Advance</SelectItem>
                      <SelectItem value="Net 15">Net 15 Days</SelectItem>
                      <SelectItem value="Net 30">Net 30 Days</SelectItem>
                      <SelectItem value="Net 60">Net 60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full h-14 bg-blue-900 font-black tracking-widest rounded-xl text-lg shadow-xl shadow-blue-100">
                  <Save className="w-5 h-5 mr-2" />
                  COMMIT TO LEDGER
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xl border-none bg-white dark:bg-slate-900 overflow-hidden rounded-3xl">
        <CardHeader className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    placeholder="Search by vendor, GST, or contact..." 
                    className="pl-10 h-11 bg-white dark:bg-slate-800 border-none rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <div className="h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-2">
                    <span className="text-xs font-black text-slate-500 uppercase">Active Nodes:</span>
                    <span className="text-sm font-black text-blue-900 dark:text-blue-400">{suppliers.length}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900 border-none">
                  <TableHead className="font-black p-6 uppercase text-[10px] tracking-widest">Supplier Base</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Contact Point</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Location</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Payment Terms</TableHead>
                  <TableHead className="font-black text-right p-6 uppercase text-[10px] tracking-widest">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier._id} className="border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100 italic">{supplier.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{supplier.gstNumber || 'NO GST PROVIDED'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-slate-600 dark:text-slate-300">{supplier.contactPerson}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <Phone className="w-3 h-3" /> {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {supplier.address?.city}, {supplier.address?.state}
                        </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-widest">
                        {supplier.paymentTerms}
                      </span>
                    </TableCell>
                    <TableCell className="text-right p-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600"
                          onClick={() => {
                            setEditingSupplier(supplier);
                            setFormData(supplier);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600"
                          onClick={() => handleDelete(supplier._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSuppliers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                        <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold italic">No vendors found matching your criteria</p>
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

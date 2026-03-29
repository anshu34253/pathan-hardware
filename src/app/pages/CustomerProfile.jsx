import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Loader2, Calendar, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { customersAPI, apiUtils } from '../../services/api';
import { toast } from 'sonner';

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const user = apiUtils.getUser();
  const customerId = user?.customerId;

  useEffect(() => {
    if (customerId) {
        fetchProfile();
    } else {
        setLoading(false);
    }
  }, [customerId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
        const response = await customersAPI.getById(customerId);
        setCustomer(response.data);
        setFormData(response.data);
    } catch (error) {
        toast.error('Failed to load profile');
    } finally {
        setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
        await customersAPI.update(customerId, formData);
        toast.success('Profile updated successfully');
        setCustomer(formData);
        setEditing(false);
    } catch (error) {
        toast.error('Failed to update profile');
    }
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
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200">
        <User className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 italic">GUEST ACCOUNT</h2>
        <p className="text-slate-600 mt-2 font-medium">Please link your profile to manage your account details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">
            ACCOUNT IDENTITY
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium italic">
            Manage your personal verification details and security.
          </p>
        </div>
        <div className="px-6 py-3 bg-green-50 dark:bg-green-900/10 rounded-2xl border-2 border-green-100 dark:border-green-900/20 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="font-black text-green-600 text-[10px] tracking-widest uppercase">Verified Customer Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden self-start">
          <CardContent className="p-0">
            <div className="bg-blue-900 h-32 relative">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full p-2 shadow-2xl">
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <User className="w-16 h-16 text-blue-900 dark:text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-10 px-8 text-center space-y-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">
                  {customer.name?.toUpperCase()}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  System ID: {customer._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Mail className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{customer.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Phone className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{customer.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 rounded-3xl lg:col-span-2 overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <CardTitle className="text-lg font-black dark:text-slate-100 italic tracking-tighter">
              PERSONAL BIODATA
            </CardTitle>
            {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2 font-black text-[10px] tracking-widest uppercase border-2 rounded-xl h-10">
                    <Edit className="w-4 h-4" />
                    Correct Details
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {setEditing(false); setFormData(customer);}} className="text-red-600 font-black text-[10px] tracking-widest uppercase rounded-xl h-10">
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white font-black text-[10px] tracking-widest uppercase rounded-xl h-10 shadow-lg shadow-green-100">
                        <Save className="w-4 h-4 mr-2" /> Commit Changes
                    </Button>
                </div>
            )}
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Business Name</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!editing}
                  className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-100 italic"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Email Contact</Label>
                <Input
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!editing}
                  className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-100 italic"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registered Phone Line</Label>
                <Input
                  value={formData.phone || ''}
                  disabled // Phone is usually the primary key/username, better not to edit here easily
                  className="h-14 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg opacity-50 cursor-not-allowed italic"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Active Since</Label>
                <div className="h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center px-4 gap-3 border-2 border-transparent italic">
                    <Calendar className="w-5 h-5 text-blue-900" />
                    <span className="font-black text-slate-900 dark:text-slate-100">
                        {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                </div>
              </div>
            </div>

            {/* Address Block */}
            <div className="pt-8 border-t border-slate-50 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-900" />
                    <h4 className="font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">BASE OF OPERATIONS</h4>
                </div>
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Premises Address</Label>
                    <Input
                        value={formData.address?.street || ''}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                        disabled={!editing}
                        className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg focus:ring-4 focus:ring-blue-100 italic"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational City</Label>
                        <Input
                            value={formData.address?.city || ''}
                            onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                            disabled={!editing}
                            className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg italic"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">State / Province</Label>
                        <Input
                            value={formData.address?.state || ''}
                            onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                            disabled={!editing}
                            className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg italic"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pincode Code</Label>
                        <Input
                            value={formData.address?.pincode || ''}
                            onChange={(e) => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})}
                            disabled={!editing}
                            className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-lg italic"
                        />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="shadow-xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
          <CardContent className="p-8 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lifetime Purchasing</p>
                <p className="text-4xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">₹{customer.totalPurchases?.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Edit className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
          <CardContent className="p-8 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Udhar Balance</p>
                <p className="text-4xl font-black text-red-600 italic tracking-tighter">₹{customer.currentCredit?.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
          <CardContent className="p-8 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Trust Score Badge</p>
                <p className="text-4xl font-black text-green-600 italic tracking-tighter">
                    {customer.currentCredit > 100000 ? 'BRONZE' : customer.currentCredit > 50000 ? 'SILVER' : 'GOLD'}
                </p>
            </div>
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


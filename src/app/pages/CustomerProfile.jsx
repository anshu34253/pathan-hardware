import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function CustomerProfile() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          My Profile
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="shadow-sm lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-blue-900 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Rajesh Kumar
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Customer ID: CUST-001
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>customer@demo.com</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Personal Information
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">Full Name</Label>
                <Input
                  value="Rajesh Kumar"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">Email Address</Label>
                <Input
                  value="customer@demo.com"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">Phone Number</Label>
                <Input
                  value="+91 98765 43210"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">Customer Since</Label>
                <Input
                  value="January 2024"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Address Information
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Street Address</Label>
              <Input
                value="456 Construction Avenue"
                readOnly
                className="mt-2 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">City</Label>
                <Input
                  value="Mumbai"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">State</Label>
                <Input
                  value="Maharashtra"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">PIN Code</Label>
                <Input
                  value="400001"
                  readOnly
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Orders
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              24
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Spent
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              ₹2,45,600
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Credit Balance
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              ₹13,200
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

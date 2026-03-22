import { Package, Eye } from 'lucide-react';
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

const orders = [
  {
    id: 'ORD-001',
    date: '2026-03-10',
    items: [
      { name: 'Portland Cement - 50kg', qty: 20, price: 350 },
      { name: 'TMT Steel Bar - 12mm', qty: 50, price: 580 },
    ],
    total: 36000,
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-002',
    date: '2026-03-05',
    items: [
      { name: 'Red Bricks', qty: 1000, price: 6.5 },
      { name: 'M-Sand', qty: 1, price: 1800 },
    ],
    total: 8300,
    status: 'In Transit',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-003',
    date: '2026-02-28',
    items: [
      { name: 'PVC Pipe - 2 inch', qty: 50, price: 180 },
      { name: 'Concrete Blocks', qty: 100, price: 35 },
    ],
    total: 12500,
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-004',
    date: '2026-02-22',
    items: [
      { name: 'White Cement - 40kg', qty: 10, price: 580 },
      { name: 'Paint Brush Set', qty: 5, price: 180 },
    ],
    total: 6700,
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
];

export default function CustomerOrders() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'In Transit':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Processing':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'Paid'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          My Orders
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Track and manage all your orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-900 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Order {order.id}
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Placed on {order.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    ₹{order.total.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-2 justify-end">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right">₹{item.price}</TableCell>
                      <TableCell className="text-right">
                        ₹{(item.qty * item.price).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

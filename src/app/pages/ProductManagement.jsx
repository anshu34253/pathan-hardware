import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
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
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { productsAPI } from '../../services/api';



export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Cement',
    description: '',
    price: '',
    quantity: '',
    unit: 'bags',
    minStock: 10
  });


  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ search: searchTerm });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku || '',
        category: product.category || 'Cement',
        description: product.description || '',
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        unit: product.unit || 'bags',
        minStock: product.minStock || 10
      });

    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category: 'Cement',
        description: '',
        price: '',
        quantity: '',
        unit: 'bags',
        minStock: 10
      });

    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity || !formData.sku || !formData.description) {
      toast.error('Required fields missing: Name, SKU, Price, Quantity, Description');
      return;
    }


    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock)
    };

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, payload);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(payload);
        toast.success('Product added successfully');
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            Product Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Manage your building material inventory</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 gap-2 shadow-lg h-11 px-6 rounded-xl font-bold"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="shadow-md border-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-xl border-none overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
          <CardTitle className="text-lg font-bold dark:text-slate-100">Product Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-none">
                  <TableHead className="font-bold">Product Name</TableHead>
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                  <TableHead className="font-bold">Stock</TableHead>
                  <TableHead className="font-bold">Unit</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold p-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-900 dark:text-blue-400" />
                    </TableCell>
                  </TableRow>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-700">
                      <TableCell className="font-bold text-slate-900 dark:text-slate-100">{product.name}</TableCell>
                      <TableCell className="text-slate-500 font-mono text-xs">{product.sku}</TableCell>
                      <TableCell className="font-bold text-blue-900 dark:text-blue-400">₹{product.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            product.quantity <= product.minStock
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300 font-medium">{product.unit}</TableCell>
                      <TableCell>
                        {product.quantity <= product.minStock ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-200 dark:border-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-200 dark:border-green-800">
                            In Stock
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 p-0 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 p-0 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      No products found. Start by adding one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modify product details below' : 'Enter the details of the new material'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Cement, Steel, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className="font-bold">SKU / Code</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="PH-CEM-001"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="category" className="font-bold">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cement">Cement</SelectItem>
                    <SelectItem value="Steel & Iron">Steel & Iron</SelectItem>
                    <SelectItem value="Bricks & Blocks">Bricks & Blocks</SelectItem>
                    <SelectItem value="Sand & Aggregates">Sand & Aggregates</SelectItem>
                    <SelectItem value="Pipes & Fittings">Pipes & Fittings</SelectItem>
                    <SelectItem value="Hardware Tools">Hardware Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Material specifications/details..."
                  className="min-h-[80px]"
                  required
                />
              </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="font-bold">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="cubic meters">Cubic Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="font-bold">Initial Stock</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock" className="font-bold">Low Stock Alert at</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  placeholder="10"
                  required
                />
              </div>
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
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}


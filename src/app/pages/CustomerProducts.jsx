import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Loader2, Filter, PackageOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { productsAPI } from '../../services/api';
import { toast } from 'sonner';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        productsAPI.getCategories()
      ]);
      setProducts(productsRes.data);
      setCategories(['All', ...categoriesRes.data]);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">
            HARDWARE & MATERIALS CATALOG
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium italic">
            Browse our up-to-date inventory and current market rates.
          </p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-900/20">
            <Filter className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            <span className="font-black text-blue-900 dark:text-blue-400 text-xs tracking-widest uppercase">Live Inventory Status</span>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-2xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col gap-8">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-bold placeholder:text-slate-400 placeholder:font-medium focus-visible:ring-4 focus-visible:ring-blue-100"
                placeholder="Search by material name, category or SKU..."
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white shadow-xl shadow-blue-200 dark:shadow-none translate-y-[-2px]'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <Card key={product._id} className="shadow-2xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:translate-y-[-8px] transition-all duration-300 group">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-400 mb-2">
                    {product.category}
                  </p>
                  <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter italic group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </CardTitle>
                </div>
                <Badge
                  className={`font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border-2 ${
                    product.quantity > 0
                      ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {product.quantity > 0 ? 'AVAILABLE' : 'OUT OF STOCK'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-slate-100 italic">₹{product.price?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">per {product.unit}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-2 border-transparent group-hover:border-slate-100 transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SKU Code</p>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-100">{product.sku || 'PH-00'+product._id.slice(-4)}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-2 border-transparent group-hover:border-slate-100 transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</p>
                        <p className={`text-xs font-black ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.quantity > 0 ? `${product.quantity} ${product.unit}` : 'Contact Store'}
                        </p>
                    </div>
                </div>

                <Button
                  className="w-full h-14 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95 group-hover:ring-4 group-hover:ring-blue-100"
                  onClick={() => toast.info(`Contact us to place order for ${product.name}`)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Request Materials
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-none">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">CATALOG EMPTY</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-sm mx-auto italic">
            No products found matching your search. Try adjusting the category or search terms.
          </p>
          <Button 
            variant="ghost" 
            className="mt-8 font-black text-blue-900 hover:bg-blue-50 uppercase tracking-widest text-[10px]"
            onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}


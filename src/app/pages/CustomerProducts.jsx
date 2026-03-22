import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const products = [
  { id: 1, name: 'Portland Cement - 50kg', category: 'Cement', price: 350, unit: 'bag', stock: 'In Stock' },
  { id: 2, name: 'TMT Steel Bar - 8mm', category: 'Steel', price: 520, unit: 'kg', stock: 'In Stock' },
  { id: 3, name: 'TMT Steel Bar - 12mm', category: 'Steel', price: 580, unit: 'kg', stock: 'In Stock' },
  { id: 4, name: 'Red Bricks', category: 'Bricks', price: 6.5, unit: 'piece', stock: 'In Stock' },
  { id: 5, name: 'Concrete Blocks - 6 inch', category: 'Blocks', price: 35, unit: 'piece', stock: 'Low Stock' },
  { id: 6, name: 'M-Sand (River Sand)', category: 'Sand', price: 1800, unit: 'ton', stock: 'In Stock' },
  { id: 7, name: 'PVC Pipe - 1 inch', category: 'Pipes', price: 120, unit: 'meter', stock: 'In Stock' },
  { id: 8, name: 'PVC Pipe - 2 inch', category: 'Pipes', price: 180, unit: 'meter', stock: 'In Stock' },
  { id: 9, name: 'Hammer - Medium', category: 'Tools', price: 250, unit: 'piece', stock: 'In Stock' },
  { id: 10, name: 'Paint Brush Set', category: 'Tools', price: 180, unit: 'set', stock: 'In Stock' },
  { id: 11, name: 'Plywood - 8mm', category: 'Wood', price: 1850, unit: 'sheet', stock: 'Low Stock' },
  { id: 12, name: 'White Cement - 40kg', category: 'Cement', price: 580, unit: 'bag', stock: 'In Stock' },
];

const categories = ['All', 'Cement', 'Steel', 'Bricks', 'Blocks', 'Sand', 'Pipes', 'Tools', 'Wood'];

export default function CustomerProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Browse Products
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Explore our wide range of quality building materials
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
                placeholder="Search products..."
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                      : ''
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {product.category}
                  </p>
                </div>
                <Badge
                  className={`${
                    product.stock === 'In Stock'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}
                >
                  {product.stock}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                    ₹{product.price}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    per {product.unit}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No products found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}

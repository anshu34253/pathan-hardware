import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Cement', 'Steel & Iron', 'Bricks & Blocks', 'Sand & Aggregates', 'Pipes & Fittings', 'Hardware Tools']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'bags', 'pieces', 'tons', 'cubic meters', 'meters']
  },
  minStock: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock cannot be negative']
  },
  supplier: {
    type: String,
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required'],
    uppercase: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity <= this.minStock) return 'Low Stock';
  return 'In Stock';
});

// Virtual for total value
productSchema.virtual('totalValue').get(function() {
  return this.price * this.quantity;
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', sku: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quantity: 1 });

// Pre-save middleware to update SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = this.name.replace(/\s+/g, '-').toUpperCase() + '-' + Date.now().toString().slice(-6);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;

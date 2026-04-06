import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  categories: [{
    type: String,
    enum: ['Cement', 'Steel & Iron', 'Bricks & Blocks', 'Sand & Aggregates', 'Pipes & Fittings', 'Hardware Tools', 'Electrical', 'Plumbing', 'Paint']
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  gstNumber: {
    type: String,
    uppercase: true,
    trim: true
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
supplierSchema.index({ name: 'text', contactPerson: 'text', gstNumber: 'text' });

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;

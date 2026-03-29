import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    street: {
      type: String,
      required: false,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: false,
      trim: true
    },
    pincode: {
      type: String,
      required: false,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  customerType: {
    type: String,
    enum: ['General', 'Retail', 'Wholesale', 'Contractor'],
    default: 'General'
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: [0, 'Credit limit cannot be negative']
  },
  currentCredit: {
    type: Number,
    default: 0,
    min: [0, 'Current credit cannot be negative']
  },
  totalPurchases: {
    type: Number,
    default: 0,
    min: [0, 'Total purchases cannot be negative']
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
});

// Virtual for available credit
customerSchema.virtual('availableCredit').get(function() {
  return this.creditLimit - this.currentCredit;
});

// Virtual for credit status
customerSchema.virtual('creditStatus').get(function() {
  if (this.currentCredit === 0) return 'No Credit';
  if (this.currentCredit >= this.creditLimit) return 'Credit Limit Reached';
  return 'Credit Available';
});

// Index for better search performance
customerSchema.index({ name: 'text', phone: 1, email: 1 });
customerSchema.index({ 'address.city': 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ createdAt: -1 });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;

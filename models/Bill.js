import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  }
}, { _id: false });

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    unique: true
  },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  items: [billItemSchema],
  subtotal: {
    type: Number,
    min: [0, 'Subtotal cannot be negative']
  },

  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  totalAmount: {
    type: Number,
    min: [0, 'Total amount cannot be negative']
  },

  paymentType: {
    type: String,
    enum: ['paid', 'credit', 'partial'],
    required: [true, 'Payment type is required']
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  },
  dueAmount: {
    type: Number,
    default: 0,
    min: [0, 'Due amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
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

// Virtual for remaining amount
billSchema.virtual('remainingAmount').get(function() {
  return this.totalAmount - this.paidAmount;
});

// Virtual for payment progress percentage
billSchema.virtual('paymentProgress').get(function() {
  if (this.totalAmount === 0) return 0;
  return Math.round((this.paidAmount / this.totalAmount) * 100);
});

// Pre-save middleware to calculate totals
billSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Calculate total amount
  this.totalAmount = this.subtotal - this.discount + this.tax;
  
  // Calculate due amount
  this.dueAmount = this.totalAmount - this.paidAmount;
  
  // Update payment status
  if (this.paidAmount === 0) {
    this.paymentStatus = 'pending';
  } else if (this.paidAmount >= this.totalAmount) {
    this.paymentStatus = 'paid';
  } else {
    this.paymentStatus = 'partial';
  }
  
  // Generate bill number if not provided
  if (!this.billNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.billNumber = `BILL-${year}${month}${day}-${random}`;
  }
  
  next();
});

// Index for better search performance
billSchema.index({ customer: 1 });
billSchema.index({ status: 1 });
billSchema.index({ paymentType: 1 });
billSchema.index({ createdAt: -1 });
billSchema.index({ dueDate: 1 });

const Bill = mongoose.model('Bill', billSchema);

export default Bill;

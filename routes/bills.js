import express from 'express';
import Bill from '../models/Bill.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bills
// @desc    Get all bills with pagination and filtering
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentType) {
      filter.paymentType = req.query.paymentType;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.search) {
      filter.billNumber = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    // Execute query with population
    const bills = await Bill.find(filter)
      .populate('customer', 'name phone email')
      .populate('items.product', 'name sku unit')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bill.countDocuments(filter);

    res.json({
      success: true,
      count: bills.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bills
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bills'
    });
  }
});

// @route   GET /api/bills/:id
// @desc    Get single bill by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('customer', 'name phone email address')
      .populate('items.product', 'name sku unit price')
      .populate('createdBy', 'username');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bill'
    });
  }
});

// @route   POST /api/bills
// @desc    Create new bill
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const billData = req.body;

    // Validate customer exists
    const customer = await Customer.findById(billData.customer);
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Validate products and update stock
    for (const item of billData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check if enough stock is available
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
        });
      }

      // Set unit price from product if not provided
      if (!item.unitPrice) {
        item.unitPrice = product.price;
      }

      // Calculate total price if not provided
      if (!item.totalPrice) {
        item.totalPrice = item.unitPrice * item.quantity;
      }
    }

    // Create bill
    const bill = new Bill(billData);
    await bill.save();

    // Update product stock
    for (const item of bill.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } }
      );
    }

    // Update customer's total purchases and credit if needed
    await Customer.findByIdAndUpdate(
      billData.customer,
      {
        $inc: {
          totalPurchases: bill.totalAmount,
          currentCredit: bill.dueAmount
        }
      }
    );

    // Populate and return the created bill
    const populatedBill = await Bill.findById(bill._id)
      .populate('customer', 'name phone email')
      .populate('items.product', 'name sku unit')
      .populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: populatedBill
    });
  } catch (error) {
    console.error('Create bill error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating bill'
    });
  }
});

// @route   PUT /api/bills/:id
// @desc    Update bill (limited updates for security)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['status', 'notes', 'paidAmount'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('customer', 'name phone email')
      .populate('items.product', 'name sku unit')
      .populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: updatedBill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bill'
    });
  }
});

// @route   DELETE /api/bills/:id
// @desc    Delete bill (and restore stock)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Restore product stock
    for (const item of bill.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } }
      );
    }

    // Update customer's total purchases and credit
    await Customer.findByIdAndUpdate(
      bill.customer,
      {
        $inc: {
          totalPurchases: -bill.totalAmount,
          currentCredit: -bill.dueAmount
        }
      }
    );

    await Bill.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bill deleted successfully and stock restored'
    });
  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bill'
    });
  }
});

// @route   GET /api/bills/stats
// @desc    Get bill statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalStats,
      monthlyStats,
      yearlyStats,
      paymentStats,
      statusStats
    ] = await Promise.all([
      // Total statistics
      Bill.aggregate([
        {
          $group: {
            _id: null,
            totalBills: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            totalPaid: { $sum: '$paidAmount' },
            totalDue: { $sum: '$dueAmount' }
          }
        }
      ]),

      // Monthly statistics
      Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            monthlyBills: { $sum: 1 },
            monthlyRevenue: { $sum: '$totalAmount' },
            monthlyPaid: { $sum: '$paidAmount' }
          }
        }
      ]),

      // Yearly statistics
      Bill.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear }
          }
        },
        {
          $group: {
            _id: null,
            yearlyBills: { $sum: 1 },
            yearlyRevenue: { $sum: '$totalAmount' },
            yearlyPaid: { $sum: '$paidAmount' }
          }
        }
      ]),

      // Payment type statistics
      Bill.aggregate([
        {
          $group: {
            _id: '$paymentType',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]),

      // Status statistics
      Bill.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalStats[0] || {
          totalBills: 0,
          totalRevenue: 0,
          totalPaid: 0,
          totalDue: 0
        },
        monthly: monthlyStats[0] || {
          monthlyBills: 0,
          monthlyRevenue: 0,
          monthlyPaid: 0
        },
        yearly: yearlyStats[0] || {
          yearlyBills: 0,
          yearlyRevenue: 0,
          yearlyPaid: 0
        },
        byPaymentType: paymentStats,
        byStatus: statusStats
      }
    });
  } catch (error) {
    console.error('Get bill stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bill statistics'
    });
  }
});

export default router;

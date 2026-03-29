import express from 'express';
import Customer from '../models/Customer.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers with pagination and filtering
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    if (req.query.customerType) {
      filter.customerType = req.query.customerType;
    }
    
    if (req.query.city) {
      filter['address.city'] = req.query.city;
    }
    
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    
    // Execute query
    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Customer.countDocuments(filter);
    
    res.json({
      success: true,
      count: customers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers'
    });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer'
    });
  }
});

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const customerData = req.body;
    
    // Check if customer with same phone already exists
    const existingCustomer = await Customer.findOne({ phone: customerData.phone });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this phone number already exists'
      });
    }
    
    const customer = new Customer(customerData);
    await customer.save();
    
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    
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
      message: 'Server error while creating customer'
    });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    // Check if phone is being changed and if it conflicts with another customer
    if (req.body.phone && req.body.phone !== customer.phone) {
      const existingCustomer = await Customer.findOne({ 
        phone: req.body.phone, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Customer with this phone number already exists'
        });
      }
    }
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    
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
      message: 'Server error while updating customer'
    });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    await Customer.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting customer'
    });
  }
});

// @route   GET /api/customers/cities
// @desc    Get all unique cities
// @access  Private
router.get('/cities/all', protect, async (req, res) => {
  try {
    const cities = await Customer.distinct('address.city');
    
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cities'
    });
  }
});

// @route   GET /api/customers/stats
// @desc    Get customer statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const stats = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalCredit: { $sum: '$currentCredit' },
          totalPurchases: { $sum: '$totalPurchases' },
          activeCustomers: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    const typeStats = await Customer.aggregate([
      {
        $group: {
          _id: '$customerType',
          count: { $sum: 1 },
          totalPurchases: { $sum: '$totalPurchases' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        summary: stats[0] || {
          totalCustomers: 0,
          totalCredit: 0,
          totalPurchases: 0,
          activeCustomers: 0
        },
        byType: typeStats
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer statistics'
    });
  }
});

export default router;

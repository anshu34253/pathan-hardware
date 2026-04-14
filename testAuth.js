import mongoose from 'mongoose';
import User from './models/User.js';
import Customer from './models/Customer.js';
import dotenv from 'dotenv';
dotenv.config();

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Test Admin Login
        const admin = await User.findOne({ username: 'anshu' });
        if (admin) {
            const adminMatch = await admin.matchPassword('anshu123');
            console.log('✅ Admin Login (anshu / anshu123):', adminMatch ? 'SUCCESS' : 'FAILED');
        } else {
            console.log('❌ Admin user "anshu" not found');
        }

        // Test Customer Login
        const customer = await User.findOne({ username: 'test_customer' }).populate('customerId');
        if (customer) {
            const customerMatch = await customer.matchPassword('customer123');
            console.log('✅ Customer Login (test_customer / customer123):', customerMatch ? 'SUCCESS' : 'FAILED');
            if (customer.customerId) {
                console.log(`   Linked Customer: ${customer.customerId.name} (${customer.customerId.customerType})`);
            } else {
                console.log('   ❌ No linked Customer document found!');
            }
        } else {
            console.log('❌ Customer user "test_customer" not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during test:', error.message);
        process.exit(1);
    }
}

testLogin();

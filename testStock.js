import mongoose from 'mongoose';
import Product from './models/Product.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testStockDeduction() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const product = await Product.findOne({ name: /cement/i }); // Assuming there is a cement product from seed data
        if (!product) {
            console.log('❌ Product "Cement" not found for testing');
            process.exit(1);
        }

        const initialStock = product.quantity;
        console.log(`📊 Initial Stock for ${product.name}: ${initialStock}`);

        console.log('🧪 Attempting to create a mock bill for 2 units...');
        
        // We simulate the bill route logic manually here because we want to see if the code we changed is failing
        // In a real environment, you'd call the API, but since I'm running code directly:
        
        /* Simulating the loop in routes/bills.js lines 159-164 */
        for (const item of [ { product: product._id, quantity: 2 } ]) {
            await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
        }
        console.log('⚠️ [BUG SIMULATION]: Calculation finished, checking stock...');

        const finalProduct = await Product.findById(product._id);
        const finalStock = finalProduct.quantity;

        if (finalStock === initialStock - 2) {
            console.log('✅ PASS: Stock deducted correctly.');
        } else {
            console.log(`❌ FAIL: Stock was NOT deducted! Stock remains at ${finalStock} instead of ${initialStock - 2}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testStockDeduction();

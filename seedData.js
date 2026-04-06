import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Customer from './models/Customer.js';
import Bill from './models/Bill.js';
import Supplier from './models/Supplier.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Customer.deleteMany();
        await Bill.deleteMany();
        await Supplier.deleteMany();

        console.log('✅ Collections cleared');

        // 1. Create Admin Users
        const adminUser = await User.create({
            username: 'anshu',
            password: 'anshu123', 
            role: 'admin',
            isActive: true
        });

        const testAdmin = await User.create({
            username: 'test_admin',
            password: 'testpassword',
            role: 'admin',
            isActive: true
        });

        console.log('✅ Admin users "anshu" and "test_admin" created');

        // 2. Create Suppliers
        const suppliers = await Supplier.insertMany([
            {
                name: 'TATA Steel Ltd',
                contactPerson: 'Suresh Kumar',
                email: 'sales@tatasteel.com',
                phone: '1800-209-7777',
                address: { city: 'Jamshedpur', state: 'Jharkhand', pincode: '831001' },
                gstNumber: '20AAACT2727C1Z1',
                paymentTerms: 'Net 30'
            },
            {
                name: 'UltraTech Cement Ltd',
                contactPerson: 'Meera Deshmukh',
                email: 'contact@ultratech.com',
                phone: '1800-210-3311',
                address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400093' },
                gstNumber: '27AAACU0352F1Z2',
                paymentTerms: 'Advance'
            },
            {
                name: 'Asian Paints',
                contactPerson: 'Rahul Sharma',
                email: 'business@asianpaints.com',
                phone: '1800-209-5678',
                address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400055' },
                gstNumber: '27AAACA0123P1Z5',
                paymentTerms: 'Net 15'
            }
        ]);

        console.log('✅ Suppliers seeded');

        // 3. Create Products
        const seededProducts = await Product.insertMany([
            {
                name: 'UltraTech OPC Cement',
                category: 'Cement',
                description: 'Ordinary Portland Cement (53 Grade) for high-strength buildings.',
                price: 485,
                quantity: 420,
                unit: 'bags',
                minStock: 50,
                supplier: 'UltraTech Cement Ltd',
                sku: 'CEM-UT-53'
            },
            {
                name: 'TATA Tiscon TMT 12mm',
                category: 'Steel & Iron',
                description: '12mm diameter reinforcing steel bars.',
                price: 740,
                quantity: 150,
                unit: 'pieces',
                minStock: 20,
                supplier: 'TATA Steel Ltd',
                sku: 'STL-TT-12'
            },
            {
                name: 'Asian Paints White Emulsion 20L',
                category: 'Hardware Tools',
                description: 'Smooth interior wall finish.',
                price: 5200,
                quantity: 15,
                unit: 'pieces',
                minStock: 5,
                supplier: 'Asian Paints',
                sku: 'PNT-AP-20L'
            },
            {
                name: 'Wire Cut Red Bricks',
                category: 'Bricks & Blocks',
                description: 'Kiln-fired high quality clay bricks.',
                price: 9,
                quantity: 8500,
                unit: 'pieces',
                minStock: 500,
                supplier: 'Local Brick Syndicate',
                sku: 'BRK-RC-STD'
            },
            {
                name: 'Finolex PVC 4"',
                category: 'Pipes & Fittings',
                description: '4-inch heavy duty PVC drainage pipe.',
                price: 1150,
                quantity: 4, // LOW STOCK
                unit: 'pieces',
                minStock: 10,
                supplier: 'Finolex Distribution',
                sku: 'PIP-FN-4'
            }
        ]);

        console.log('✅ Products seeded');

        // 4. Create Customers
        const seededCustomers = await Customer.insertMany([
            {
                name: 'Rajesh Developers',
                email: 'rajesh@dev.com',
                phone: '9822334455',
                address: { city: 'Pune', street: 'Kothrud', state: 'Maharashtra', pincode: '411038' },
                customerType: 'Contractor',
                creditLimit: 500000,
                currentCredit: 125000,
                totalPurchases: 450000
            },
            {
                name: 'Amit Singhania',
                email: 'amit@retail.com',
                phone: '9112233445',
                address: { city: 'Mumbai', street: 'Andheri', state: 'Maharashtra', pincode: '400053' },
                customerType: 'Retail',
                creditLimit: 50000,
                currentCredit: 0,
                totalPurchases: 12500
            },
            {
                name: 'Vinayaka Builders',
                email: 'contact@vinayaka.com',
                phone: '8877001122',
                address: { city: 'Bangalore', street: 'Whitefield', state: 'Karnataka', pincode: '560066' },
                customerType: 'Wholesale',
                creditLimit: 2000000,
                currentCredit: 750000,
                totalPurchases: 3200000
            }
        ]);

        console.log('✅ Customers seeded');

        // 5. Create Bills
        const bills = [];
        for (let i = 0; i < 25; i++) {
            const randomCustomer = seededCustomers[Math.floor(Math.random() * seededCustomers.length)];
            const randomProduct = seededProducts[Math.floor(Math.random() * seededProducts.length)];
            const qty = Math.floor(Math.random() * 10) + 1;
            const subtotal = randomProduct.price * qty;
            const discount = Math.random() > 0.7 ? Math.min(100, subtotal) : 0;
            const tax = (subtotal - discount) * 0.18;
            const total = subtotal - discount + tax;

            const date = new Date();
            date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));

            bills.push({
                billNumber: `BILL-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${1000 + i}`,
                customer: randomCustomer._id,
                items: [{
                    product: randomProduct._id,
                    quantity: qty,
                    unitPrice: randomProduct.price,
                    totalPrice: subtotal
                }],
                subtotal: subtotal,
                discount: discount,
                tax: tax,
                totalAmount: total,
                paymentType: i % 4 === 0 ? 'credit' : 'paid',
                paidAmount: i % 4 === 0 ? 0 : total,
                dueAmount: i % 4 === 0 ? total : 0,
                paymentStatus: i % 4 === 0 ? 'pending' : 'paid',
                status: 'completed',
                dueDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
                createdBy: adminUser._id,
                createdAt: date
            });
        }

        await Bill.insertMany(bills);
        console.log('✅ Bills seeded');

        console.log('\n--- SEEDING COMPLETE ---');
        console.log('Admin Account 1: anshu / anshu123');
        console.log('Admin Account 2: test_admin / testpassword');
        console.log('Total Products: ', seededProducts.length);
        console.log('Total Customers: ', seededCustomers.length);
        console.log('Total Bills: ', bills.length);
        console.log('Total Suppliers: ', suppliers.length);

        process.exit(0);
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();

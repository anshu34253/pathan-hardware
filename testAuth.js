import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function testLogin() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ username: 'anshu' });
    if (!user) {
        console.log('User not found');
        process.exit(1);
    }
    const isMatch = await user.matchPassword('anshu123');
    console.log('Login Test for "anshu" / "anshu123":', isMatch ? 'SUCCESS' : 'FAILED');
    process.exit(0);
}

testLogin();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Store from '../models/storeModel.js';
import Order from '../models/orderModel.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: './server/.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const createdUsers = await User.insertMany([
        { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
        { name: 'Seller User', email: 'seller@example.com', password: hashedPassword, role: 'seller' },
        { name: 'Customer User', email: 'customer@example.com', password: hashedPassword, role: 'customer' },
    ]);
    
    const sellerUser = createdUsers[1];

    const mainStore = await Store.create({
        owner: sellerUser._id,
        name: 'Main Street Electronics',
        description: 'Your one-stop shop for all things electronic.',
        logo: '/uploads/images/sample-logo.png', // Note: Placeholder path
        status: 'approved'
    });

    const sampleProducts = [
        {
            user: sellerUser._id, store: mainStore._id, name: 'Airpods Wireless Headphones',
            images: ['/uploads/images/sample-airpods.jpg'], description: 'Bluetooth technology lets you connect it with compatible devices wirelessly.',
            brand: 'Apple', category: 'Electronics', price: 89.99, countInStock: 10,
        },
        {
            user: sellerUser._id, store: mainStore._id, name: 'iPhone 13 Pro 256GB',
            images: ['/uploads/images/sample-phone.jpg'], description: 'A transformative triple-camera system that adds tons of capability.',
            brand: 'Apple', category: 'Electronics', price: 599.99, countInStock: 7,
        },
    ];

    await Product.insertMany(sampleProducts);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

connectDB().then(importData);
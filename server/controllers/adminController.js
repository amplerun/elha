import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Store from '../models/storeModel.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({});
    const activeSellers = await Store.countDocuments({ status: 'approved' });
    const totalProducts = await Product.countDocuments({});

    // Calculate total revenue from all completed orders
    const orders = await Order.find({ isPaid: true }); // Assuming isPaid marks a completed sale
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
        totalUsers,
        activeSellers,
        totalProducts,
        totalRevenue,
    });
});

export { getDashboardStats };
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Store from '../models/storeModel.js';

/**
 * @desc    Get dashboard stats for the admin panel
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    // Count total documents in each relevant collection
    const totalUsers = await User.countDocuments({});
    const activeSellers = await Store.countDocuments({ status: 'approved' });
    const totalProducts = await Product.countDocuments({});

    // Calculate total revenue from all orders marked as paid
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Respond with a JSON object containing all stats
    res.json({
        totalUsers,
        activeSellers,
        totalProducts,
        totalRevenue,
    });
});

export { getDashboardStats };
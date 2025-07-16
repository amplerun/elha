import asyncHandler from 'express-async-handler';
import Grievance from '../models/grievanceModel.js';

const createGrievance = asyncHandler(async (req, res) => {
    const { orderId, storeId, subject, description } = req.body;
    const grievance = new Grievance({
        user: req.user._id, order: orderId, store: storeId, subject, description
    });
    const createdGrievance = await grievance.save();
    res.status(201).json(createdGrievance);
});

const getMyGrievances = asyncHandler(async (req, res) => {
    const grievances = await Grievance.find({ user: req.user._id });
    res.json(grievances);
});

const getGrievances = asyncHandler(async (req, res) => {
    const grievances = await Grievance.find({}).populate('user', 'id name');
    res.json(grievances);
});

export { createGrievance, getMyGrievances, getGrievances };
import asyncHandler from 'express-async-handler';
import Store from '../models/storeModel.js';

const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find({ status: 'approved' }).populate('owner', 'name email');
  res.json(stores);
});

const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id).populate('owner', 'name email');
  if (store) {
    res.json(store);
  } else {
    res.status(404);
    throw new Error('Store not found');
  }
});

const getMyStore = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ owner: req.user._id });
    if(store) {
        res.json(store);
    } else {
        res.json(null);
    }
});

const createOrUpdateStore = asyncHandler(async (req, res) => {
    if (req.user.role !== 'seller') {
        res.status(403);
        throw new Error('Only sellers can create stores');
    }
    const { name, description, logo } = req.body;
    let store = await Store.findOne({ owner: req.user._id });
    if (store) {
        store.name = name || store.name;
        store.description = description || store.description;
        store.logo = logo || store.logo;
        store.status = 'pending';
    } else {
        store = new Store({ owner: req.user._id, name, description, logo });
    }
    const savedStore = await store.save();
    res.status(201).json(savedStore);
});

const getStoresForAdmin = asyncHandler(async (req, res) => {
    const stores = await Store.find({}).populate('owner', 'name email');
    res.json(stores);
});

const updateStoreStatus = asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id);
    if (store) {
        store.status = req.body.status;
        const updatedStore = await store.save();
        res.json(updatedStore);
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

export { getStores, getStoreById, getMyStore, createOrUpdateStore, getStoresForAdmin, updateStoreStatus };
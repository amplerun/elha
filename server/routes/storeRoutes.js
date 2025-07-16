import express from 'express';
const router = express.Router();
import { 
    getStores, getStoreById, getMyStore, createOrUpdateStore,
    getStoresForAdmin, updateStoreStatus
} from '../controllers/storeController.js';
import { protect, seller, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getStores).post(protect, seller, createOrUpdateStore);
router.route('/mystore').get(protect, seller, getMyStore);
router.route('/admin').get(protect, admin, getStoresForAdmin);
router.route('/:id').get(getStoreById);
router.route('/:id/status').put(protect, admin, updateStoreStatus);

export default router;
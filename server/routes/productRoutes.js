import express from 'express';
const router = express.Router();
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} from '../controllers/productController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/:id').get(getProductById).put(protect, seller, updateProduct).delete(protect, seller, deleteProduct);

export default router;
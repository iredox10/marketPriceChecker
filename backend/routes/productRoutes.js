
import express from 'express';
import { getAllProducts, createProduct, addPriceToProduct } from '../controllers/productController.js';
import { protect, admin, shopOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
router.get('/', getAllProducts);

// @route   POST /api/products
// @desc    Create a new product (Protected Admin Route)
router.post('/', protect, admin, createProduct);

// @route   POST /api/products/:id/prices
// @desc    Add a price update to a product (Protected Shop Owner Route)
router.post('/:id/prices', protect, shopOwner, addPriceToProduct);

export default router;

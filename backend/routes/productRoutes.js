
import express from 'express';
import {
  getAllProducts,
  createProduct,
  addPriceToProduct,
  uploadProductsFile // Import the new controller function
} from '../controllers/productController.js';
import { protect, admin, shopOwner } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Setup multer for memory storage to process the file before saving
const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/products
// @desc    Get all products (with search functionality)
router.get('/', getAllProducts);

// @route   POST /api/products
// @desc    Create a new product (Can be done by Admin or Shop Owner)
router.post('/', protect, createProduct);

// @route   POST /api/products/upload
// @desc    Upload an excel file to bulk-create products (Shop Owner)
router.post('/upload', protect, shopOwner, upload.single('file'), uploadProductsFile);

// @route   POST /api/products/:id/prices
// @desc    Add a price update to a product (Shop Owner)
router.post('/:id/prices', protect, shopOwner, addPriceToProduct);


export default router;

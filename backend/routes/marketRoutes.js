
import express from 'express';
import { createMarket, getAllMarkets, getMarketById } from '../controllers/marketController.js';
// We'll import placeholder middleware to show how to protect routes
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/markets
// @desc    Get all markets
router.get('/', getAllMarkets);

// @route   GET /api/markets/:id
// @desc    Get a single market by its ID
router.get('/:id', getMarketById);

// @route   POST /api/markets
// @desc    Create a new market (Protected Admin Route)
router.post('/', protect, admin, createMarket);

export default router;

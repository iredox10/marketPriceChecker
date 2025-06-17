
import Market from '../models/Market.js';
import User from '../models/User.js'; // Import the User model

// @desc    Create a new market
// @route   POST /api/markets
// @access  Private/Admin
export const createMarket = async (req, res) => {
  try {
    const market = new Market(req.body);
    const createdMarket = await market.save();
    res.status(201).json(createdMarket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating market', error: error.message });
  }
};

// @desc    Get all markets
// @route   GET /api/markets
// @access  Public
export const getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find({});
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching markets', error: error.message });
  }
};

/**
 * @desc    Get a single market by ID, including its shop owners
 * @route   GET /api/markets/:id
 * @access  Public
 */
export const getMarketById = async (req, res, next) => {
  try {
    // Find the market by its ID
    const market = await Market.findById(req.params.id);

    if (market) {
      // If the market is found, find all users who are ShopOwners in that market
      const shopOwners = await User.find({ market: market._id, role: 'ShopOwner' }).select('name shopName');

      // In a real app, you would also fetch popular/recent products for this market.
      // For now, we'll just send back the market and its shop owners.

      res.json({
        ...market.toObject(),
        shopOwners: shopOwners,
      });
    } else {
      res.status(404);
      throw new Error('Market not found');
    }
  } catch (error) {
    next(error);
  }
};


import Market from '../models/Market.js'

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

// @desc    Get a single market by ID
// @route   GET /api/markets/:id
// @access  Public
export const getMarketById = async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (market) {
      res.json(market);
    } else {
      res.status(404).json({ message: 'Market not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market', error: error.message });
  }
};


import PriceReport from '../models/PriceReport.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Market from '../models/Market.js'; // Import Market model to find market by name
import crypto from 'crypto'; // To generate a random password

/**
 * @desc    Create a new price report
 * @route   POST /api/reports
 * @access  Private
 */
export const createPriceReport = async (req, res, next) => {
  try {
    const { productName, marketName, shopName, reportedPrice } = req.body;
    const report = new PriceReport({
      productName,
      marketName,
      shopName,
      reportedPrice,
      reportedBy: req.user._id, // From protect middleware
    });
    const createdReport = await report.save();
    res.status(201).json({ message: "Thank you! Your report has been submitted for verification.", report: createdReport });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending price reports
 * @route   GET /api/reports/pending
 * @access  Private/Admin
 */
export const getPendingReports = async (req, res, next) => {
  try {
    const reports = await PriceReport.find({ status: 'Pending' }).populate('reportedBy', 'name email');
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a price report, creating the shop owner and/or product if they don't exist.
 * @route   PUT /api/reports/:id/approve
 * @access  Private/Admin
 */
export const approvePriceReport = async (req, res, next) => {
  try {
    const report = await PriceReport.findById(req.params.id);
    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    // --- NEW LOGIC: Find or Create Shop Owner ---
    let shopOwner = await User.findOne({ shopName: report.shopName, role: 'ShopOwner' });

    if (!shopOwner) {
      // If shop owner doesn't exist, create one automatically
      const market = await Market.findOne({ name: { $regex: new RegExp(`^${report.marketName}$`, 'i') } });

      shopOwner = new User({
        name: report.shopName, // Use shopName as the default name
        email: `${report.shopName.replace(/\s+/g, '').toLowerCase()}@placeholder.market`, // Create a placeholder email
        password: crypto.randomBytes(16).toString('hex'), // Generate a secure random password
        role: 'ShopOwner',
        shopName: report.shopName,
        market: market ? market._id : null, // Assign market if found, otherwise null
      });
      await shopOwner.save();
    }

    // Ensure the shop owner has a market assigned to proceed
    if (!shopOwner.market) {
      res.status(400);
      throw new Error(`Market for shop "${shopOwner.shopName}" not found. Please assign a market to this shop owner manually.`);
    }

    // --- Find or Create Product (Existing Logic) ---
    let product = await Product.findOne({ name: report.productName, market: shopOwner.market });

    if (!product) {
      // Product does not exist, so create a new one.
      product = new Product({
        name: report.productName,
        category: 'Uncategorized', // Default category
        market: shopOwner.market, // Assign to the shop owner's market
        priceHistory: [], // Start with an empty history
      });
    }

    // Add the new price from the report to the product's history
    product.priceHistory.push({
      price: report.reportedPrice,
      shopOwner: shopOwner._id,
    });

    // Recalculate average and save the product
    product.calculateAveragePrice();
    await product.save();

    // Mark the report as approved and save
    report.status = 'Approved';
    await report.save();

    res.json({ message: 'Report approved successfully. Shop and product prices have been updated.' });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject (delete) a price report
 * @route   DELETE /api/reports/:id
 * @access  Private/Admin
 */
export const rejectPriceReport = async (req, res, next) => {
  try {
    const report = await PriceReport.findById(req.params.id);
    if (report) {
      await report.deleteOne();
      res.json({ message: 'Report rejected and removed.' });
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get reports submitted by the logged-in user
 * @route   GET /api/reports/myreports
 * @access  Private
 */
export const getMyReports = async (req, res, next) => {
  try {
    // Find reports where the 'reportedBy' field matches the logged-in user's ID
    const reports = await PriceReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};


import PriceReport from '../models/PriceReport.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * @desc    Create a new price report
 * @route   POST /api/reports
 * @access  Private
 */
export const createPriceReport = async (req, res) => {
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
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
};

/**
 * @desc    Get all pending price reports
 * @route   GET /api/reports/pending
 * @access  Private/Admin
 */
export const getPendingReports = async (req, res) => {
  try {
    const reports = await PriceReport.find({ status: 'Pending' }).populate('reportedBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

/**
 * @desc    Approve a price report
 * @route   PUT /api/reports/:id/approve
 * @access  Private/Admin
 */
export const approvePriceReport = async (req, res) => {
  try {
    const report = await PriceReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const product = await Product.findOne({ name: report.productName });
    const shopOwner = await User.findOne({ shopName: report.shopName, role: 'ShopOwner' });

    if (!product || !shopOwner) {
      return res.status(400).json({ message: 'Cannot approve: Corresponding product or shop owner not found.' });
    }

    product.priceHistory.push({
      price: report.reportedPrice,
      shopOwner: shopOwner._id,
    });

    product.calculateAveragePrice();
    await product.save();

    report.status = 'Approved';
    await report.save();

    res.json({ message: 'Report approved and product price updated.' });

  } catch (error) {
    res.status(500).json({ message: 'Error approving report', error: error.message });
  }
};

/**
 * @desc    Reject (delete) a price report
 * @route   DELETE /api/reports/:id
 * @access  Private/Admin
 */
export const rejectPriceReport = async (req, res) => {
  try {
    const report = await PriceReport.findById(req.params.id);
    if (report) {
      await report.deleteOne();
      res.json({ message: 'Report rejected and removed.' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting report', error: error.message });
  }
};


/**
 * @desc    Get reports submitted by the logged-in user
 * @route   GET /api/reports/myreports
 * @access  Private
 */
export const getMyReports = async (req, res, next) => {
  try {
    const reports = await PriceReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

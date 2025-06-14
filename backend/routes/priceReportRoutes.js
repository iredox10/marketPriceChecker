
import express from 'express';
import {
  createPriceReport,
  getPendingReports,
  approvePriceReport,
  rejectPriceReport,
} from '../controllers/priceReportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/reports
// @desc    A logged-in user submits a new report
router.route('/').post(protect, createPriceReport);

// @route   GET /api/reports/pending
// @desc    Admin gets all reports needing verification
router.route('/pending').get(protect, admin, getPendingReports);

// @route   PUT /api/reports/:id/approve
// @desc    Admin approves a report
router.route('/:id/approve').put(protect, admin, approvePriceReport);

// @route   DELETE /api/reports/:id
// @desc    Admin rejects (deletes) a report
router.route('/:id').delete(protect, admin, rejectPriceReport);

export default router;

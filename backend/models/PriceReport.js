
import mongoose from 'mongoose';

const priceReportSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  marketName: {
    type: String,
    required: true,
    trim: true,
  },
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
  reportedPrice: {
    type: Number,
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  }
}, {
  timestamps: true,
});

const PriceReport = mongoose.model('PriceReport', priceReportSchema);
export default PriceReport;


import mongoose from 'mongoose';

// --- Sub-document Schema for Price History ---
const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  shopOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// --- Main Product Schema ---
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    required: true,
  },
  priceHistory: [priceHistorySchema],
  averagePrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// --- Text Index for Efficient Searching ---
// This tells MongoDB to create an index that allows for fast, word-based searches
// on the 'name' and 'description' fields.
productSchema.index({ name: 'text', description: 'text' });


// --- Mongoose Method: Calculate Average Price ---
productSchema.methods.calculateAveragePrice = function() {
  if (this.priceHistory.length === 0) {
    this.averagePrice = 0;
    return;
  }
  const total = this.priceHistory.reduce((acc, item) => acc + item.price, 0);
  this.averagePrice = total / this.priceHistory.length;
};


const Product = mongoose.model('Product', productSchema);
export default Product;

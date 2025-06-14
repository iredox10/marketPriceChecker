
const mongoose = require('mongoose');

// --- Sub-document Schema for Price History ---
const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  // Reference to the user (who must have the 'ShopOwner' role) that submitted the price
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
  // Tracks which market this product is generally associated with
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

// --- Mongoose Method: Calculate Average Price ---
// This function can be called to update the average price based on the history
productSchema.methods.calculateAveragePrice = function() {
  if (this.priceHistory.length === 0) {
    this.averagePrice = 0;
    return;
  }
  const total = this.priceHistory.reduce((acc, item) => acc + item.price, 0);
  this.averagePrice = total / this.priceHistory.length;
};


const Product = mongoose.model('Product', productSchema);
module.exports = Product;


const Product = require('../models/Product');

// @desc    Get all products (can be filtered by market later)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('market', 'name').populate('priceHistory.shopOwner', 'name shopName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// @desc    Add a price update to a product
// @route   POST /api/products/:id/prices
// @access  Private/ShopOwner
exports.addPriceToProduct = async (req, res) => {
  const { price } = req.body;
  // The shop owner's ID would come from the authenticated user's token
  const shopOwnerId = req.user._id;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const newPriceEntry = {
        price,
        shopOwner: shopOwnerId,
      };

      product.priceHistory.push(newPriceEntry);

      // Recalculate and update the average price
      product.calculateAveragePrice();

      const updatedProduct = await product.save();
      res.status(201).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding price', error: error.message });
  }
};

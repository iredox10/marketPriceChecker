
import Product from '../models/Product.js';
import Market from '../models/Market.js';
import xlsx from 'xlsx';

/**
 * @desc    Get all products with advanced filtering
 * @route   GET /api/products?keyword=tomatoes&market=marketId
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const { keyword, market } = req.query;
    const filter = {};
    if (keyword) {
      filter.$text = { $search: keyword };
    }
    if (market) {
      filter.market = market;
    }
    const products = await Product.find(filter)
      .populate('market', 'name')
      .populate('priceHistory.shopOwner', 'name shopName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

/**
 * @desc    Create a new product (and add initial price)
 * @route   POST /api/products
 * @access  Private/Admin or Private/ShopOwner
 */
export const createProduct = async (req, res, next) => {
  const { name, category, price } = req.body;
  const shopOwnerId = req.user._id;
  const ownerMarketId = req.user.market;

  try {
    // --- FIX: Add validation to ensure the shop owner is assigned to a market ---
    if (!ownerMarketId) {
      res.status(400); // Bad Request
      throw new Error('You are not assigned to a market. Please contact an administrator.');
    }

    // --- FIX: Validate and parse the price from the request body ---
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      res.status(400);
      throw new Error('Please provide a valid price for the product.');
    }


    // Check if a product with the same name and market already exists
    let product = await Product.findOne({ name, market: ownerMarketId });

    if (product) {
      // If product exists, just add the parsed price to its history
      product.priceHistory.push({ price: parsedPrice, shopOwner: shopOwnerId });
    } else {
      // If product doesn't exist, create it with the parsed price
      product = new Product({
        name,
        category,
        market: ownerMarketId,
        priceHistory: [{ price: parsedPrice, shopOwner: shopOwnerId }],
      });
    }

    product.calculateAveragePrice();
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    // Pass error to the centralized error handler
    next(error);
  }
};

/**
 * @desc    Add a price update to an existing product
 * @route   POST /api/products/:id/prices
 * @access  Private/ShopOwner
 */
export const addPriceToProduct = async (req, res, next) => {
  const { price } = req.body;
  const shopOwnerId = req.user._id;

  try {
    // --- FIX: Validate and parse the price here as well ---
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      res.status(400);
      throw new Error('Please provide a valid price.');
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      product.priceHistory.push({ price: parsedPrice, shopOwner: shopOwnerId });
      product.calculateAveragePrice();
      const updatedProduct = await product.save();
      res.status(201).json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload and process an Excel file for bulk product creation
 * @route   POST /api/products/upload
 * @access  Private/ShopOwner
 */
export const uploadProductsFile = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('No file uploaded.'));
  }

  try {
    const ownerMarketId = req.user.market;
    if (!ownerMarketId) {
      res.status(400);
      throw new Error('Shop owner is not associated with a market.');
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // --- FIX: Add validation for the uploaded file's content ---
    if (data.length === 0) {
      res.status(400);
      throw new Error('The uploaded file is empty or in an unsupported format.');
    }
    const firstRow = data[0];
    if (!firstRow.name || !firstRow.category || !firstRow.price) {
      res.status(400);
      throw new Error("Invalid file format. Please ensure the Excel file has columns named 'name', 'category', and 'price'.");
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const row of data) {
      const { name, category, price } = row;
      if (!name || !category || !price || isNaN(parseFloat(price))) continue;

      let product = await Product.findOne({ name, market: ownerMarketId });

      if (product) {
        product.priceHistory.push({ price: parseFloat(price), shopOwner: req.user._id });
        updatedCount++;
      } else {
        product = new Product({
          name,
          category,
          market: ownerMarketId,
          priceHistory: [{ price: parseFloat(price), shopOwner: req.user._id }],
        });
        createdCount++;
      }
      product.calculateAveragePrice();
      await product.save();
    }

    res.status(201).json({
      message: 'File processed successfully.',
      created: createdCount,
      updated: updatedCount,
    });

  } catch (error) {
    next(error);
  }
};

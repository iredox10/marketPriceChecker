
import User from '../models/User.js';
import Product from '../models/Product.js';
import xlsx from 'xlsx';
import crypto from 'crypto';



/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Update a user's details (e.g., role, name)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      // Add any other fields you want to be editable by an admin
      // e.g., user.shopName = req.body.shopName || user.shopName;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



export const getShopDetailsById = async (req, res, next) => {
  try {
    // Find the user and ensure they are a ShopOwner
    const shopOwner = await User.findById(req.params.id)
      .select('name shopName market')
      .populate('market', 'name location');

    if (!shopOwner || shopOwner.role !== 'ShopOwner') {
      res.status(404);
      throw new Error('Shop owner not found');
    }

    // Find all products where this shop owner has a price entry
    const products = await Product.find({ 'priceHistory.shopOwner': req.params.id })
      .select('name category averagePrice priceHistory');

    // For each product, extract the latest price from THIS shop owner
    const productsWithLatestPrice = products.map(p => {
      const latestEntry = p.priceHistory
        .filter(h => h.shopOwner.toString() === req.params.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      return {
        _id: p._id,
        name: p.name,
        category: p.category,
        latestPrice: latestEntry ? latestEntry.price : p.averagePrice,
        lastUpdated: latestEntry ? latestEntry.date : null,
      };
    });

    res.json({
      shopDetails: shopOwner,
      products: productsWithLatestPrice,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload and process an Excel file to bulk-create shop owners
 * @route   POST /api/users/upload
 * @access  Private/Admin
 */
export const uploadShopOwnersFile = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('No file uploaded.'));
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      res.status(400);
      throw new Error('The uploaded file is empty.');
    }

    const createdUsers = [];
    for (const row of data) {
      const { name, email, shopName, marketId, password } = row;

      // Basic validation for each row
      if (!name || !email || !shopName || !marketId) {
        console.warn('Skipping invalid row:', row);
        continue;
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        console.warn(`User with email ${email} already exists. Skipping.`);
        continue;
      }

      const marketExists = await Market.findById(marketId);
      if (!marketExists) {
        console.warn(`Market with ID ${marketId} not found. Skipping user ${name}.`);
        continue;
      }

      const newUser = new User({
        name,
        email,
        shopName,
        market: marketId,
        password: password || crypto.randomBytes(16).toString('hex'), // Use provided password or generate one
        role: 'ShopOwner',
      });

      const createdUser = await newUser.save();
      createdUsers.push(createdUser);
    }

    res.status(201).json({
      message: `File processed. ${createdUsers.length} new shop owners created.`,
      createdUsers,
    });

  } catch (error) {
    next(error);
  }
};

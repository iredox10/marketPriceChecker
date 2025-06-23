
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// --- Helper Function to Generate JWT ---
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role, shopName, market } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      shopName: role === 'ShopOwner' ? shopName : undefined,
      market: role === 'ShopOwner' ? market : undefined,
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      market: user.market,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        market: user.market, // Send market ID on login for shop owners
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};


/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware after token verification
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/**
 * @desc    Generate and email a password reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      throw new Error('No user found with that email address');
    }

    // Generate the random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiry on the user model
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await user.save({ validateBeforeSave: false });

    // In a real app, you would email this link to the user
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    console.log('Password Reset Link (for simulation):', resetUrl);

    res.status(200).json({
      success: true,
      message: 'A password reset link has been sent to your email.'
    });

  } catch (error) {
    // Clear token fields on error to allow user to try again
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }
    next(error);
  }
};

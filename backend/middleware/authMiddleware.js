
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes for logged-in users
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (and attach to request object)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict access to Admins
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Middleware to restrict access to ShopOwners
export const shopOwner = (req, res, next) => {
  if (req.user && req.user.role === 'ShopOwner') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a shop owner' });
  }
};

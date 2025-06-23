
import express from 'express';
import { registerUser, loginUser, getUserProfile, forgotPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect middleware

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @desc    Get logged-in user's profile (Protected Route)
router.get('/profile', protect, getUserProfile);


router.post('/forgot-password', forgotPassword);


export default router;


import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(protect, admin);

// @route   GET /api/users
// @desc    Get all users
router.route('/').get(getUsers);

// @route   GET, PUT, DELETE /api/users/:id
// @desc    Get, update, or delete a single user
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;

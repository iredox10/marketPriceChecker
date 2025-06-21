
import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getShopDetailsById,
  uploadShopOwnersFile
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';

// Setup multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/shop/:id').get(getShopDetailsById);

// All routes in this file are protected and require admin access
router.use(protect, admin);

// This is the new route to handle the file upload
router.route('/upload')
  .post(protect, admin, upload.single('file'), uploadShopOwnersFile);


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

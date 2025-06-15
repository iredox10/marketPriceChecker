
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
// --- Import the new error handling middleware ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- Import Route Files ---
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import priceReportRoutes from './routes/priceReportRoutes.js';

// --- Initial Configuration ---
dotenv.config();
const app = express();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/market-price');
    console.log('MongoDB Connected Successfully...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', priceReportRoutes);


// --- Welcome Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});


// --- Custom Error Handling Middleware ---
// This MUST be after all your API routes.
// 1. Catches requests to non-existent routes
app.use(notFound);
// 2. Catches all other errors passed by next(error)
app.use(errorHandler);


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));

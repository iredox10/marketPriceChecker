
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

// --- Import Route Files ---
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import productRoutes from './routes/productRoutes.js';

// --- Initial Configuration ---
dotenv.config();
const app = express();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To accept JSON data in the request body

// --- API Routes ---
// This tells the app to use your route files for any requests to these paths
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/products', productRoutes);


// --- Welcome Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));


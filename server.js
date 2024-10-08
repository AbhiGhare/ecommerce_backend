import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import cartRoutes from './routes/cartRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import favoriteProductRoutes from './routes/favoriteProductRoutes.js';
import Sessions from './routes/sessionRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174','https://ecommerce-frontend-asit.vercel.app','https://ecommerce-frontend-blond-chi.vercel.app','https://66d232c10a8c104f2a8a55de--candid-kelpie-c5af06.netlify.app','https://candid-kelpie-c5af06.netlify.app','https://ecommerce-frontend-nu-five.vercel.app'], // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api/favorites', favoriteProductRoutes)
app.use('/api/sessions', Sessions)

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

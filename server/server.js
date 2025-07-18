import path from 'path';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';       // <-- NEW
import categoryRoutes from './routes/categoryRoutes.js'; // <-- NEW

// Model Imports
import ChatMessage from './models/chatMessageModel.js';
import User from './models/userModel.js';

// Load environment variables IMMEDIATELY
dotenv.config();

// Connect to the database AFTER loading env variables
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your Vercel URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Use a more robust CORS configuration for production
const corsOptions = {
  origin: "*", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/admin', adminRoutes);         // <-- NEW
app.use('/api/categories', categoryRoutes); // <-- NEW

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });
  socket.on('send_message', async (data) => {
    const { chatId, sender, text } = data;
    const message = new ChatMessage({ chatId, sender, text });
    await message.save();
    const populatedMessage = await message.populate('sender', 'name');
    io.to(chatId).emit('receive_message', populatedMessage);
  });
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
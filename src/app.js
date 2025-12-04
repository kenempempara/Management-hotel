const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const roomRoutes = require('./routes/rooms');
const guestRoutes = require('./routes/guests');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: '🏨 Hotel Management API', 
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            rooms: {
                getAll: 'GET /api/rooms',
                getOne: 'GET /api/rooms/:id',
                getByStatus: 'GET /api/rooms/status/:status',
                create: 'POST /api/rooms',
                update: 'PUT /api/rooms/:id',
                delete: 'DELETE /api/rooms/:id'
            },
            guests: {
                getAll: 'GET /api/guests',
                getOne: 'GET /api/guests/:id',
                create: 'POST /api/guests',
                update: 'PUT /api/guests/:id',
                delete: 'DELETE /api/guests/:id'
            },
            bookings: {
                getAll: 'GET /api/bookings',
                getOne: 'GET /api/bookings/:id',
                getByGuest: 'GET /api/bookings/guest/:guestId',
                getByRoom: 'GET /api/bookings/room/:roomId',
                create: 'POST /api/bookings',
                update: 'PUT /api/bookings/:id',
                delete: 'DELETE /api/bookings/:id'
            }
        }
    });
});

// 404 Handler - FIXED VERSION
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: `Endpoint ${req.method} ${req.originalUrl} not found`
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} to test`);
});
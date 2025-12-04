const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// Get all bookings with populated data
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('guestId', 'name email phone')
            .populate('roomId', 'number type price status');
        
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('guestId', 'name email phone')
            .populate('roomId', 'number type price status');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get bookings by guest ID
exports.getBookingsByGuest = async (req, res) => {
    try {
        const bookings = await Booking.find({ guestId: req.params.guestId })
            .populate('roomId', 'number type price status');
        
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get bookings by room ID
exports.getBookingsByRoom = async (req, res) => {
    try {
        const bookings = await Booking.find({ roomId: req.params.roomId })
            .populate('guestId', 'name email phone');
        
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create new booking
exports.createBooking = async (req, res) => {
    try {
        // Check if room exists
        const room = await Room.findById(req.body.roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }

        // Check if guest exists
        const guest = await Guest.findById(req.body.guestId);
        if (!guest) {
            return res.status(404).json({
                success: false,
                error: 'Guest not found'
            });
        }

        // Check room availability
        if (room.status === 'occupied' || room.status === 'maintenance') {
            return res.status(400).json({
                success: false,
                error: `Room is ${room.status}`
            });
        }

        // Calculate total amount
        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(req.body.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalAmount = room.price * nights;

        const bookingData = {
            ...req.body,
            totalAmount: totalAmount
        };

        const booking = new Booking(bookingData);
        const savedBooking = await booking.save();

        // Update room status
        await Room.findByIdAndUpdate(req.body.roomId, { 
            status: 'occupied' 
        });

        // Populate the response
        const populatedBooking = await Booking.findById(savedBooking._id)
            .populate('guestId', 'name email phone')
            .populate('roomId', 'number type price');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: populatedBooking
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('guestId', 'name email phone')
         .populate('roomId', 'number type price');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Update room status back to available
        await Room.findByIdAndUpdate(booking.roomId, { 
            status: 'available' 
        });

        await Booking.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
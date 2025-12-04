const Room = require('../models/Room');

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        
        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }
        
        res.json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get rooms by status
exports.getRoomsByStatus = async (req, res) => {
    try {
        const rooms = await Room.find({ status: req.params.status });
        
        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create new room
exports.createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        const savedRoom = await room.save();
        
        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: savedRoom
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update room
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Room updated successfully',
            data: room
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        
        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Room deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
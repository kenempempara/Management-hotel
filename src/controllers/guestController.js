const Guest = require('../models/Guest');

// Get all guests
exports.getAllGuests = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.json({
            success: true,
            count: guests.length,
            data: guests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get guest by ID
exports.getGuestById = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        
        if (!guest) {
            return res.status(404).json({
                success: false,
                error: 'Guest not found'
            });
        }
        
        res.json({
            success: true,
            data: guest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create new guest
exports.createGuest = async (req, res) => {
    try {
        const guest = new Guest(req.body);
        const savedGuest = await guest.save();
        
        res.status(201).json({
            success: true,
            message: 'Guest created successfully',
            data: savedGuest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update guest
exports.updateGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!guest) {
            return res.status(404).json({
                success: false,
                error: 'Guest not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Guest updated successfully',
            data: guest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete guest
exports.deleteGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndDelete(req.params.id);
        
        if (!guest) {
            return res.status(404).json({
                success: false,
                error: 'Guest not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Guest deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
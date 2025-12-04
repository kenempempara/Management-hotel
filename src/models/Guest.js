const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        country: String
    },
    idProof: {
        type: String,
        required: true
    },
    idNumber: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Guest', guestSchema);
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Guest = require('./models/Guest');
const Booking = require('./models/Booking');
require('dotenv').config();

const seedData = async () => {
    try {
        console.log('🌱 Starting to seed database...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing old data...');
        await Room.deleteMany({});
        await Guest.deleteMany({});
        await Booking.deleteMany({});

        // Create rooms
        console.log('🏨 Creating rooms...');
        const rooms = await Room.insertMany([
            {
                number: '101',
                type: 'single',
                price: 100,
                status: 'available',
                amenities: ['TV', 'WiFi', 'AC'],
                capacity: 1
            },
            {
                number: '102',
                type: 'double',
                price: 150,
                status: 'available',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar'],
                capacity: 2
            },
            {
                number: '201',
                type: 'suite',
                price: 250,
                status: 'available',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar', 'Jacuzzi'],
                capacity: 3
            },
            {
                number: '202',
                type: 'deluxe',
                price: 300,
                status: 'available',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony'],
                capacity: 4
            },
            {
                number: '301',
                type: 'deluxe',
                price: 350,
                status: 'occupied',
                amenities: ['TV', 'WiFi', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Kitchen'],
                capacity: 4
            }
        ]);

        // Create guests
        console.log('👤 Creating guests...');
        const guests = await Guest.insertMany([
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    country: 'USA'
                },
                idProof: 'passport',
                idNumber: 'P12345678'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+0987654321',
                address: {
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    country: 'USA'
                },
                idProof: 'driver-license',
                idNumber: 'DL87654321'
            },
            {
                name: 'Bob Wilson',
                email: 'bob@example.com',
                phone: '+1122334455',
                address: {
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    country: 'USA'
                },
                idProof: 'passport',
                idNumber: 'P99887766'
            },
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                phone: '+5566778899',
                address: {
                    street: '321 Maple St',
                    city: 'Miami',
                    country: 'USA'
                },
                idProof: 'id-card',
                idNumber: 'ID11223344'
            }
        ]);

        // Create bookings
        console.log('📅 Creating bookings...');
        const bookings = await Booking.insertMany([
            {
                guestId: guests[0]._id,
                roomId: rooms[0]._id,
                checkIn: new Date('2024-01-15'),
                checkOut: new Date('2024-01-20'),
                status: 'confirmed',
                totalAmount: 500,
                paymentStatus: 'paid',
                numberOfGuests: 1,
                specialRequests: 'Early check-in at 1 PM'
            },
            {
                guestId: guests[1]._id,
                roomId: rooms[1]._id,
                checkIn: new Date('2024-01-18'),
                checkOut: new Date('2024-01-25'),
                status: 'checked-in',
                totalAmount: 1050,
                paymentStatus: 'pending',
                numberOfGuests: 2,
                specialRequests: 'Late check-out requested'
            },
            {
                guestId: guests[2]._id,
                roomId: rooms[4]._id,
                checkIn: new Date('2024-01-10'),
                checkOut: new Date('2024-01-17'),
                status: 'checked-in',
                totalAmount: 2450,
                paymentStatus: 'paid',
                numberOfGuests: 3,
                specialRequests: 'Extra towels and pillows'
            }
        ]);

        console.log('🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Rooms: ${rooms.length}`);
        console.log(`   Guests: ${guests.length}`);
        console.log(`   Bookings: ${bookings.length}`);
        
        console.log('\n🔌 Closing connection...');
        await mongoose.connection.close();
        console.log('✅ Done!');
        
        console.log('\n🚀 Ready to test API endpoints:');
        console.log('   GET  /api/rooms');
        console.log('   GET  /api/guests');
        console.log('   GET  /api/bookings');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await mongoose.connection.close();
    }
};

seedData();
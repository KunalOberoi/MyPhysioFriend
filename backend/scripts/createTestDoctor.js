import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import doctorModel from '../models/doctorModel.js';
import 'dotenv/config';

// Connect to database
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/MyPhysioFriend`);
}

const createTestDoctor = async () => {
    try {
        await connectDB();
        
        // Check if test doctor already exists
        const existingDoctor = await doctorModel.findOne({ email: 'test@doctor.com' });
        if (existingDoctor) {
            console.log('Test doctor already exists!');
            console.log('Email: test@doctor.com');
            console.log('Password: test123');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test123', salt);

        // Create test doctor
        const testDoctor = new doctorModel({
            name: 'Dr. Test Doctor',
            email: 'test@doctor.com',
            password: hashedPassword,
            image: 'https://res.cloudinary.com/dfcpjf8qh/image/upload/v1751906297/s4vs8hvhqhackvcxatoa.png',
            speciality: 'General Physiotherapist',
            degree: 'MBBS',
            experience: '5 years',
            about: 'Test doctor for MyPhysioFriend application. This is a demo account for testing purposes.',
            fees: 100,
            address: {
                line1: 'Test Address Line 1',
                line2: 'Test Address Line 2'
            },
            available: true,
            date: Date.now(),
            slots_booked: {}
        });

        await testDoctor.save();
        
        console.log('✅ Test doctor created successfully!');
        console.log('📧 Email: test@doctor.com');
        console.log('🔑 Password: test123');
        console.log('Use these credentials to test the doctor login panel.');
        
    } catch (error) {
        console.error('Error creating test doctor:', error);
    } finally {
        mongoose.connection.close();
    }
}

createTestDoctor();

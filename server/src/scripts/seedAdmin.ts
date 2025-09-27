import mongoose from 'mongoose';
import User from '../models/User.js';  // Added .js extension
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edujobs';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminData = {
      username: 'admin',
      email: 'ephrontuyishime21@gmail.com',
      password: 'EduJobs21%',
      role: 'admin',
      isActive: true
    };

    // Delete existing admin if it exists
    await User.deleteOne({ email: adminData.email });
    console.log('Removed existing admin user');

    // Create new admin
    console.log('Creating new admin user...');
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);
    const admin = new User(adminData);
    await admin.save();
    console.log('Admin user created successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin().catch(console.error);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../models/Application';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs';

async function checkApplications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Count total applications
    const totalApplications = await Application.countDocuments();
    console.log(`Total applications in database: ${totalApplications}`);

    // Get recent applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt status');

    console.log('\nRecent applications:');
    recentApplications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.firstName} ${app.lastName} (${app.email}) - ${app.status} - ${app.createdAt}`);
    });

    if (totalApplications === 0) {
      console.log('\n❌ No applications found in database!');
      console.log('This suggests the data is not being saved properly.');
    } else {
      console.log(`\n✅ Found ${totalApplications} applications in database.`);
    }

  } catch (error) {
    console.error('Error checking applications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the check
checkApplications().catch(console.error);

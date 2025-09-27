import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs';

async function checkAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check for admin user by email
    const adminByEmail = await User.findOne({ email: 'ephrontuyishime21@gmail.com' });
    console.log('\n=== Admin User by Email ===');
    if (adminByEmail) {
      console.log('✅ Found admin user by email:');
      console.log(`- ID: ${adminByEmail._id}`);
      console.log(`- Username: ${adminByEmail.username}`);
      console.log(`- Email: ${adminByEmail.email}`);
      console.log(`- Role: ${adminByEmail.role}`);
      console.log(`- Active: ${adminByEmail.isActive}`);
      console.log(`- Created: ${adminByEmail.createdAt}`);
    } else {
      console.log('❌ No admin user found with email: ephrontuyishime21@gmail.com');
    }

    // Check for admin user by username
    const adminByUsername = await User.findOne({ username: 'ephrontuyishime21@gmail.com' });
    console.log('\n=== Admin User by Username ===');
    if (adminByUsername) {
      console.log('✅ Found admin user by username:');
      console.log(`- ID: ${adminByUsername._id}`);
      console.log(`- Username: ${adminByUsername.username}`);
      console.log(`- Email: ${adminByUsername.email}`);
      console.log(`- Role: ${adminByUsername.role}`);
      console.log(`- Active: ${adminByUsername.isActive}`);
    } else {
      console.log('❌ No admin user found with username: ephrontuyishime21@gmail.com');
    }

    // List all users
    const allUsers = await User.find().select('username email role isActive');
    console.log('\n=== All Users in Database ===');
    if (allUsers.length > 0) {
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.role} - Active: ${user.isActive}`);
      });
    } else {
      console.log('❌ No users found in database!');
    }

    // Test password comparison if admin exists
    const adminUser = adminByEmail || adminByUsername;
    if (adminUser) {
      console.log('\n=== Password Test ===');
      try {
        // Get user with password field
        const userWithPassword = await User.findById(adminUser._id).select('+password');
        if (userWithPassword) {
          const isPasswordValid = await userWithPassword.comparePassword('EduJobs21%');
          console.log(`Password 'EduJobs21%' is ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
          
          // Also test some common variations
          const testPasswords = ['EduJobs21%', 'edujobs21%', 'EduJobs21', 'admin', 'password'];
          for (const testPwd of testPasswords) {
            const isValid = await userWithPassword.comparePassword(testPwd);
            console.log(`- '${testPwd}': ${isValid ? '✅ VALID' : '❌ Invalid'}`);
          }
        }
      } catch (error) {
        console.error('Error testing password:', error);
      }
    }

  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the check
checkAdmin().catch(console.error);

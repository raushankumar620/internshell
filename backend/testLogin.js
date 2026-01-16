// Simple test script to debug login functionality
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const testLogin = async () => {
  try {
    await connectDB();
    
    // Get all users to see if any exist
    const users = await User.find({});
    console.log(`📊 Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`👤 User: ${user.email} | Role: ${user.role} | Email Verified: ${user.isEmailVerified} | Active: ${user.isActive}`);
      });
      
      // Test login with the first user
      const testUser = users[0];
      console.log(`\n🔐 Testing login for: ${testUser.email}`);
      
      // You would need to manually provide password for testing
      // const testPassword = 'your-test-password-here';
      // const isMatch = await testUser.matchPassword(testPassword);
      // console.log(`Password match: ${isMatch}`);
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    process.exit();
  }
};

// Run the test
testLogin();
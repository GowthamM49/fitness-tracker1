const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

async function testAdminLogin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔍 TESTING ADMIN LOGIN');
    console.log('=' .repeat(50));

    // Test admin login
    const adminUser = await User.findOne({ email: 'admin@kec.edu' });
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Active: ${adminUser.isActive}`);
      
      // Test password
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      console.log(`   Password valid: ${isPasswordValid ? '✅' : '❌'}`);
      
      if (adminUser.role === 'admin' && isPasswordValid) {
        console.log('\n🎉 ADMIN LOGIN TEST PASSED!');
        console.log('   You can login with: admin@kec.edu / admin123');
      } else {
        console.log('\n❌ ADMIN LOGIN TEST FAILED!');
      }
    } else {
      console.log('❌ Admin user not found!');
    }

    // Test faculty login
    const facultyUser = await User.findOne({ email: 'faculty@kec.edu' });
    if (facultyUser) {
      console.log('\n✅ Faculty user found:');
      console.log(`   Name: ${facultyUser.name}`);
      console.log(`   Email: ${facultyUser.email}`);
      console.log(`   Role: ${facultyUser.role}`);
      
      const isPasswordValid = await bcrypt.compare('faculty123', facultyUser.password);
      console.log(`   Password valid: ${isPasswordValid ? '✅' : '❌'}`);
    }

    // Check all users with admin/faculty roles
    const adminUsers = await User.find({ role: { $in: ['admin', 'faculty'] } });
    console.log(`\n📊 Users with admin/faculty access: ${adminUsers.length}`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testAdminLogin();

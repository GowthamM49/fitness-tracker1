const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

async function createAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n👑 CREATING ADMIN USER');
    console.log('=' .repeat(50));

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@kec.edu' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating role...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin role updated successfully!');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@kec.edu',
        password: hashedPassword,
        role: 'admin',
        age: 35,
        gender: 'male',
        height: 175,
        weight: 75,
        fitnessGoal: 'maintain',
        points: 2500,
        isActive: true,
        lastLogin: new Date(),
        registrationDate: new Date()
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }

    // Also create a faculty user
    const existingFaculty = await User.findOne({ email: 'faculty@kec.edu' });
    if (existingFaculty) {
      console.log('⚠️  Faculty user already exists. Updating role...');
      existingFaculty.role = 'faculty';
      await existingFaculty.save();
      console.log('✅ Faculty role updated successfully!');
    } else {
      const hashedPassword = await bcrypt.hash('faculty123', 10);
      
      const facultyUser = new User({
        name: 'Dr. Sarah Wilson',
        email: 'faculty@kec.edu',
        password: hashedPassword,
        role: 'faculty',
        age: 42,
        gender: 'female',
        height: 165,
        weight: 60,
        fitnessGoal: 'lose',
        points: 1800,
        isActive: true,
        lastLogin: new Date(),
        registrationDate: new Date()
      });

      await facultyUser.save();
      console.log('✅ Faculty user created successfully!');
    }

    // Update existing user "GOWTHAMM" to admin role if exists
    const existingUser = await User.findOne({ name: /GOWTHAMM/i });
    if (existingUser) {
      console.log(`\n🔄 Updating existing user "${existingUser.name}" to admin role...`);
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`✅ User "${existingUser.name}" is now an admin!`);
    }

    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   Admin: admin@kec.edu / admin123');
    console.log('   Faculty: faculty@kec.edu / faculty123');
    console.log('   Your existing user is now an admin!');

    console.log('\n📊 FINAL USER COUNT:');
    const adminCount = await User.countDocuments({ role: 'admin' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    const studentCount = await User.countDocuments({ role: 'student' });
    
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Faculty users: ${facultyCount}`);
    console.log(`   Student users: ${studentCount}`);

    console.log('\n✅ ADMIN USER SETUP COMPLETE');
    console.log('=' .repeat(50));
    console.log('\n🚀 Next steps:');
    console.log('   1. Restart your frontend application');
    console.log('   2. Login with admin credentials');
    console.log('   3. Admin Panel should now appear in sidebar!');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser();

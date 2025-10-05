const mongoose = require('mongoose');

// Test MongoDB connection
async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';
    
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = new TestModel({ name: 'test' });
    await testDoc.save();
    console.log('✅ Database write test successful!');
    
    // Clean up test document
    await TestModel.deleteOne({ name: 'test' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();

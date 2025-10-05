// test-insert.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://gowtham23:gowtham123@ac-fjvjbus-shard-00-00.7lf2q8n.mongodb.net:27017,ac-fjvjbus-shard-00-01.7lf2q8n.mongodb.net:27017,ac-fjvjbus-shard-00-02.7lf2q8n.mongodb.net:27017/?ssl=true&replicaSet=atlas-jr4nmg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=message'
, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', UserSchema);

User.create({ name: 'Test User', email: 'test@example.com' })
  .then(() => {
    console.log('✅ Test user inserted!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Insert failed:', err.message);
    mongoose.disconnect();
  });

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  email: String,
  isVerified: Boolean,
  verificationToken: String,
  verificationExpires: Date,
  createdAt: Date
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'tadashijei@gmail.com' });
    console.log('User found:', user ? {
      email: user.email,
      isVerified: user.isVerified,
      verificationToken: user.verificationToken,
      verificationExpires: user.verificationExpires,
      createdAt: user.createdAt
    } : 'No user found');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();

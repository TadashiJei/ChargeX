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

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update user
    const result = await User.findOneAndUpdate(
      { email: 'tadashijei@gmail.com' },
      { 
        $set: { 
          isVerified: true,
          verificationToken: null,
          verificationExpires: null
        }
      },
      { new: true }
    );

    if (result) {
      console.log('User updated successfully:', {
        email: result.email,
        isVerified: result.isVerified,
        verificationToken: result.verificationToken,
        verificationExpires: result.verificationExpires
      });
    } else {
      console.log('User not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyUser();

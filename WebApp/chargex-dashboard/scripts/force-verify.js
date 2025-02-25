require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function forceVerify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Force update user verification status
    const result = await mongoose.connection.collection('users').updateOne(
      { email: 'tadashijei@gmail.com' },
      { 
        $set: { 
          isVerified: true 
        },
        $unset: { 
          verificationToken: "",
          verificationExpires: ""
        }
      }
    );

    console.log('Update result:', result);

    // Verify the update
    const user = await mongoose.connection.collection('users').findOne(
      { email: 'tadashijei@gmail.com' }
    );

    console.log('User after update:', {
      email: user.email,
      isVerified: user.isVerified,
      verificationToken: user.verificationToken,
      verificationExpires: user.verificationExpires
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

forceVerify();

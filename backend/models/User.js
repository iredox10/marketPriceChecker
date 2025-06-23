
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'ShopOwner', 'Admin'],
    default: 'User',
  },
  // --- Fields specific to Shop Owners ---
  shopName: {
    type: String,
    trim: true,
    // Only required if the role is ShopOwner
    required: function() { return this.role === 'ShopOwner'; },
  },
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    // Only required if the role is ShopOwner
    required: function() { return this.role === 'ShopOwner'; },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// --- Mongoose Middleware: Password Hashing ---
// This function runs before a user document is saved to the database.
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Method: Password Comparison ---
// This adds a custom method to our user schema to compare passwords.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
export default User;

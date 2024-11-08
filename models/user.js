import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcryptjs';

// Define the User schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 128,
      // Strong password validation using regex (uncomment if needed)
      // match: [
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      // ],
    },
    orders: {
      type: [mongoose.Types.ObjectId],
      default: [], // Default to an empty array if no orders are present
    },
    role: {
      type: String, // Change to string if you plan to expand roles (user, admin, etc.)
      enum: ['user', 'admin'],
      default: 'user',
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Pre-save middleware to hash password before saving it to the DB
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Add a method to compare password during login
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Add index to email for better query performance
UserSchema.index({ email: 1 }); // Ensure uniqueness and fast lookups

const Users = mongoose.model('User', UserSchema);

export { Users as UsersModel };

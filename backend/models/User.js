import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    profilePicture: {
      type: String,
      default: null,
    },
    branch: String,
    semester: Number,
    rollNumber: String,
    cgpa: { type: Number, default: 0 },
    skills: [
      {
        name: String,
        endorsements: { type: Number, default: 0 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    bio: String,
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcryptjs.compare(enteredPassword, this.password);
};

userSchema.methods.calculateProfileCompletion = function () {
  let completed = 0;
  const fields = [
    'firstName',
    'lastName',
    'email',
    'branch',
    'semester',
    'rollNumber',
    'bio',
    'profilePicture',
  ];

  fields.forEach((field) => {
    if (this[field]) completed++;
  });

  this.profileCompletion = Math.round((completed / fields.length) * 100);
  return this.profileCompletion;
};

const User = mongoose.model('User', userSchema);

export default User;

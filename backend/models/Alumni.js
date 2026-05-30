import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    profilePicture: String,
    branch: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    currentRole: {
      type: String,
      required: true,
    },
    currentCompany: {
      type: String,
      required: true,
    },
    linkedinProfile: String,
    bio: String,
    advice: {
      type: String,
      maxlength: 1000,
    },
    specialization: String,
    placementDetails: {
      ctc: String,
      jobTitle: String,
      joiningDate: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Alumni = mongoose.model('Alumni', alumniSchema);

export default Alumni;

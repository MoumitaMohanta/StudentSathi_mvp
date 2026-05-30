import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['PYQ', 'Notes', 'Lecture', 'Tutorial', 'Solution', 'Question Bank'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    branch: String,
    semester: Number,
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileSize: Number,
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'ppt', 'zip', 'other'],
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    cloudinaryResourceType: {
      type: String,
      enum: ['image', 'raw', 'video'],
      default: 'raw',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

materialSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
  return this.averageRating;
};

const Material = mongoose.model('Material', materialSchema);

export default Material;

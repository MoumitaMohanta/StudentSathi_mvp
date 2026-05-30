import './config/loadEnv.js';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import connectDB from './config/db.js';
import { protect, adminOnly } from './middleware/auth.js';
import upload from './middleware/upload.js';

import * as authController from './controllers/authController.js';
import * as profileController from './controllers/profileController.js';
import * as libraryController from './controllers/libraryController.js';
import * as alumniController from './controllers/alumniController.js';
import * as adminController from './controllers/adminController.js';
import { isCloudinaryConfigured } from './utils/cloudinaryUpload.js';

const app = express();
const PORT = process.env.PORT || 5001;
import dotenv from 'dotenv';
dotenv.config();
//console.log(process.env);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/auth/register', authController.register);
app.post('/api/auth/register/admin', authController.registerAdmin);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/verify', protect, authController.verifyToken);

app.get('/api/profile', protect, profileController.getProfile);
app.put('/api/profile', protect, profileController.updateProfile);
app.put(
  '/api/profile/avatar',
  protect,
  upload.single('profilePicture'),
  profileController.uploadAvatar
);
app.post('/api/profile/skills', protect, profileController.addSkill);
app.delete('/api/profile/skills/:skillId', protect, profileController.removeSkill);

app.get('/api/library/materials', libraryController.listMaterials);
app.get('/api/library/materials/:id', libraryController.getMaterial);
app.post(
  '/api/library/materials/:id/download',
  protect,
  libraryController.downloadMaterial
);
app.post(
  '/api/library/materials',
  protect,
  adminOnly,
  upload.single('file'),
  libraryController.uploadMaterial
);
app.post('/api/library/materials/:id/rate', protect, libraryController.rateMaterial);
app.delete(
  '/api/library/materials/:id',
  protect,
  adminOnly,
  libraryController.deleteMaterial
);

app.get('/api/alumni', alumniController.listAlumni);
app.get('/api/alumni/:id', alumniController.getAlumni);
app.post('/api/alumni', protect, adminOnly, alumniController.createAlumni);
app.put('/api/alumni/:id', protect, adminOnly, alumniController.updateAlumni);
app.delete('/api/alumni/:id', protect, adminOnly, alumniController.deleteAlumni);

app.get('/api/admin/stats', protect, adminOnly, adminController.getStats);

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large (max 50MB)' });
  }
  if (err.message === 'Invalid file type') {
    return res.status(400).json({ message: 'Invalid file type for upload' });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    isCloudinaryConfigured()
      ? 'Cloudinary: configured'
      : 'Cloudinary: NOT configured — set CLOUDINARY_* in backend/.env'
  );
});

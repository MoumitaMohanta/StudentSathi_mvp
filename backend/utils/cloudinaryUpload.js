import '../config/loadEnv.js';
import streamifier from 'streamifier';
import cloudinary, { refreshCloudinaryConfig } from '../config/cloudinary.js';

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

/**
 * Upload a Multer memory buffer to Cloudinary via upload_stream + streamifier.
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return Promise.reject(new Error('Invalid file buffer — multer memory storage may have failed'));
  }

  if (!isCloudinaryConfigured()) {
    return Promise.reject(
      new Error(
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env'
      )
    );
  }

  refreshCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error('[Cloudinary]', error.message || error);
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('Cloudinary returned no secure_url'));
          return;
        }
        resolve(result);
      }
    );

    uploadStream.on('error', (err) => {
      console.error('[Cloudinary stream]', err.message || err);
      reject(err);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

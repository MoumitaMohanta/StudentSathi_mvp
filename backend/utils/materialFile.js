import path from 'path';
import cloudinary from '../config/cloudinary.js';

export const resolveFileType = (mimetype, originalname = '') => {
  const map = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/zip': 'zip',
    'image/jpeg': 'other',
    'image/png': 'other',
  };

  if (mimetype && map[mimetype]) {
    return map[mimetype];
  }

  const ext = path.extname(originalname).slice(1).toLowerCase();
  const extMap = { pdf: 'pdf', doc: 'doc', docx: 'docx', ppt: 'ppt', pptx: 'ppt', zip: 'zip' };
  return extMap[ext] || 'other';
};

/**
 * Download URL: prefer stored secure_url (keeps .pdf extension from auto upload).
 * Only inject fl_attachment without rebuilding public_id (avoids extension-less URLs).
 */
export const getMaterialDeliveryUrl = (material) => {
  const doc = material.toObject ? material.toObject() : material;

  if (doc.fileUrl) {
    const url = doc.fileUrl;
    if (url.includes('/upload/') && !url.includes('fl_attachment')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  }

  if (doc.cloudinaryPublicId) {
    const format =
      doc.fileType && doc.fileType !== 'other' ? doc.fileType : undefined;

    return cloudinary.url(doc.cloudinaryPublicId, {
      resource_type: doc.cloudinaryResourceType || 'raw',
      type: 'upload',
      secure: true,
      format,
      flags: 'attachment',
    });
  }

  return doc.fileUrl;
};

export const toClientMaterial = (material) => {
  const doc = material.toObject ? material.toObject() : { ...material };
  return {
    ...doc,
    fileUrl: getMaterialDeliveryUrl(doc),
  };
};

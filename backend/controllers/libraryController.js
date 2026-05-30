import Material from '../models/Material.js';
import cloudinary from '../config/cloudinary.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import {
  resolveFileType,
  getMaterialDeliveryUrl,
  toClientMaterial,
} from '../utils/materialFile.js';

export const listMaterials = async (req, res) => {
  try {
    const { category, subject, branch, semester, search, page = 1, limit = 12 } =
      req.query;
    const filter = { isVisible: true };

    if (category) filter.category = category;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (branch) filter.branch = { $regex: branch, $options: 'i' };
    if (semester) filter.semester = parseInt(semester, 10);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const materials = await Material.find(filter)
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Material.countDocuments(filter);

    res.json({
      materials: materials.map(toClientMaterial),
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
        currentPage: parseInt(page, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploadedBy', 'firstName lastName');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(toClientMaterial(material));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, category, subject, branch, semester } = req.body;

    if (!title || !category || !subject || !req.file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const uploadOptions = {
      folder: 'studentsathi/materials',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
    };

    if (req.file.originalname) {
      uploadOptions.filename_override = req.file.originalname;
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, uploadOptions);

    const material = new Material({
      title,
      description,
      category,
      subject,
      branch,
      semester: semester ? parseInt(semester, 10) : null,
      fileUrl: result.secure_url,
      fileSize: req.file.size,
      fileType: resolveFileType(req.file.mimetype, req.file.originalname),
      cloudinaryPublicId: result.public_id,
      cloudinaryResourceType: result.resource_type || 'raw',
      uploadedBy: req.userId,
    });

    await material.save();

    res.status(201).json({
      message: 'Material uploaded successfully',
      material: toClientMaterial(material),
    });
  } catch (error) {
    console.error('[uploadMaterial]', error);
    res.status(500).json({
      message: error.message || 'Failed to upload material to Cloudinary',
    });
  }
};

export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({
      fileUrl: getMaterialDeliveryUrl(material),
      downloads: material.downloads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateMaterial = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const existingRating = material.ratings.findIndex(
      (r) => r.userId.toString() === req.userId
    );

    if (existingRating !== -1) {
      material.ratings[existingRating] = { userId: req.userId, rating, review };
    } else {
      material.ratings.push({ userId: req.userId, rating, review });
    }

    material.calculateAverageRating();
    await material.save();

    res.json({
      message: 'Rating submitted successfully',
      averageRating: material.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await cloudinary.uploader.destroy(material.cloudinaryPublicId, {
      resource_type: material.cloudinaryResourceType || 'raw',
    });
    await Material.findByIdAndDelete(req.params.id);

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

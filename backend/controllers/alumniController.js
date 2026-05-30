import jwt from 'jsonwebtoken';
import Alumni from '../models/Alumni.js';

export const listAlumni = async (req, res) => {
  try {
    const { branch, graduationYear, search, page = 1, limit = 12, admin } = req.query;
    let filter = { isVerified: true };

    if (admin === 'true') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' });
        }
        filter = {};
      } catch {
        return res.status(403).json({ message: 'Admin access required' });
      }
    }

    if (branch) filter.branch = branch;
    if (graduationYear) filter.graduationYear = parseInt(graduationYear, 10);
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const alumni = await Alumni.find(filter)
      .sort({ isFeatured: -1, graduationYear: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Alumni.countDocuments(filter);

    res.json({
      alumni,
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

export const getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAlumni = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      branch,
      graduationYear,
      currentRole,
      currentCompany,
      bio,
      advice,
      linkedinProfile,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !branch ||
      !graduationYear ||
      !currentRole ||
      !currentCompany
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const alumni = new Alumni({
      firstName,
      lastName,
      email,
      branch,
      graduationYear: parseInt(graduationYear, 10),
      currentRole,
      currentCompany,
      bio,
      advice,
      linkedinProfile,
      isVerified: true,
    });

    await alumni.save();

    res.status(201).json({
      message: 'Alumni profile created successfully',
      alumni,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = [
      'firstName',
      'lastName',
      'bio',
      'advice',
      'currentRole',
      'currentCompany',
      'linkedinProfile',
      'specialization',
      'placementDetails',
      'isVerified',
      'isFeatured',
    ];

    const update = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });

    const alumni = await Alumni.findByIdAndUpdate(id, update, { new: true });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.json({
      message: 'Alumni profile updated successfully',
      alumni,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.json({ message: 'Alumni profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

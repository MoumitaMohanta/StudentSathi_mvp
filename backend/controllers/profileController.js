import User from '../models/User.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        branch: user.branch || '',
        semester: user.semester ?? null,
        rollNumber: user.rollNumber || '',
        cgpa: user.cgpa || 0,
        skills: user.skills || [],
        bio: user.bio || '',
        profileCompletion: user.profileCompletion || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName',
      'lastName',
      'branch',
      'semester',
      'rollNumber',
      'cgpa',
      'bio',
    ];

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.cgpa !== undefined && req.body.cgpa !== '') {
      const cgpa = Number(req.body.cgpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        return res.status(400).json({ message: 'CGPA must be between 0 and 10' });
      }
    }

    if (req.body.semester !== undefined && req.body.semester !== '') {
      const semester = Number(req.body.semester);
      if (Number.isNaN(semester) || semester < 1 || semester > 8) {
        return res.status(400).json({ message: 'Semester must be between 1 and 8' });
      }
    }

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        user[field] =
          field === 'semester' || field === 'cgpa'
            ? Number(req.body[field])
            : req.body[field];
      }
    });

    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'studentsathi/profiles',
        resource_type: 'image',
      });
      user.profilePicture = result.secure_url;
    }

    user.calculateProfileCompletion();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        branch: user.branch,
        semester: user.semester,
        rollNumber: user.rollNumber,
        cgpa: user.cgpa,
        skills: user.skills,
        bio: user.bio,
        profileCompletion: user.profileCompletion,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Profile picture file is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'studentsathi/profiles',
      resource_type: 'image',
    });

    user.profilePicture = result.secure_url;
    user.calculateProfileCompletion();
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        profileCompletion: user.profileCompletion,
      },
    });
  } catch (error) {
    console.error('[uploadAvatar]', error);
    res.status(500).json({
      message: error.message || 'Failed to upload profile picture',
    });
  }
};

export const addSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skillExists = user.skills.some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (skillExists) {
      return res.status(409).json({ message: 'Skill already exists' });
    }

    user.skills.push({ name });
    user.calculateProfileCompletion();
    await user.save();

    res.status(201).json({
      message: 'Skill added successfully',
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = user.skills.filter((s) => s._id.toString() !== skillId);
    user.calculateProfileCompletion();
    await user.save();

    res.json({
      message: 'Skill removed successfully',
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from '../models/User.js';
import Material from '../models/Material.js';
import Alumni from '../models/Alumni.js';

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalMaterials, totalAlumni, materials] = await Promise.all([
      User.countDocuments(),
      Material.countDocuments(),
      Alumni.countDocuments({ isVerified: true }),
      Material.find({}, 'downloads'),
    ]);

    const downloadCount = materials.reduce(
      (sum, m) => sum + (m.downloads || 0),
      0
    );

    res.json({
      totalUsers,
      totalMaterials,
      totalAlumni,
      downloadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

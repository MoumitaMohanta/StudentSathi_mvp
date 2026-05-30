import React, { useEffect, useState, useRef } from 'react';
import { Save, Plus, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';
import { Avatar } from '../Common/Avatar';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    branch: '',
    semester: '',
    rollNumber: '',
    cgpa: '',
    bio: '',
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        const profileData = response.data.user;
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          branch: profileData.branch || '',
          semester: profileData.semester ?? '',
          rollNumber: profileData.rollNumber || '',
          cgpa: profileData.cgpa ?? '',
          bio: profileData.bio || '',
        });
        setSkills(profileData.skills || []);
      } catch {
        setMessageType('error');
        setMessage('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const response = await profileAPI.addSkill(newSkill);
      setSkills(response.data.skills);
      setNewSkill('');
      setMessageType('success');
      setMessage('Skill added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      const response = await profileAPI.removeSkill(skillId);
      setSkills(response.data.skills);
      setMessageType('success');
      setMessage('Skill removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessageType('error');
      setMessage('Failed to remove skill');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await profileAPI.updateProfile(formData);
      updateUser(response.data.user);
      setMessageType('success');
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessageType('error');
      setMessage('Please choose a JPEG or PNG image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessageType('error');
      setMessage('Image must be smaller than 5MB');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await profileAPI.uploadAvatar(file);
      updateUser(response.data.user);
      setMessageType('success');
      setMessage('Profile picture updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage(
        error.response?.data?.message ||
          'Failed to upload photo. Check Cloudinary settings in backend/.env'
      );
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            messageType === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 mb-6">
        <div className="flex items-center space-x-6">
          <Avatar
            name={`${user?.firstName} ${user?.lastName}`}
            src={user?.profilePicture}
            size="lg"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile Picture
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Camera size={18} />
              <span>{saving ? 'Uploading...' : 'Change Photo'}</span>
            </button>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Academic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {['firstName', 'lastName', 'branch', 'rollNumber'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Semester
            </label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              min="1"
              max="8"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CGPA
            </label>
            <input
              type="number"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="10"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg disabled:opacity-50"
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Skills</h2>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="Add a new skill..."
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
        <div className="space-y-2">
          {skills.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No skills added yet</p>
          ) : (
            skills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center justify-between bg-gray-50 dark:bg-dark-700 p-4 rounded-lg"
              >
                <span className="text-gray-900 dark:text-white">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

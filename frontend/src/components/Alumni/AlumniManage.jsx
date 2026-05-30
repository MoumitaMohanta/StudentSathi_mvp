import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { alumniAPI } from '../../services/api';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  branch: '',
  graduationYear: '',
  currentRole: '',
  currentCompany: '',
  bio: '',
  advice: '',
  linkedinProfile: '',
};

export const AlumniManage = () => {
  const [alumni, setAlumni] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadAlumni = async () => {
    setLoading(true);
    try {
      const response = await alumniAPI.getAlumni({ admin: 'true', limit: 50 });
      setAlumni(response.data.alumni);
    } catch {
      setMessage('Failed to load alumni list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlumni();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await alumniAPI.createAlumni(formData);
      setFormData(emptyForm);
      setMessage('Alumni profile created');
      await loadAlumni();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create alumni');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alumni profile?')) return;

    try {
      await alumniAPI.deleteAlumni(id);
      setAlumni((prev) => prev.filter((a) => a._id !== id));
    } catch {
      setMessage('Failed to delete alumni');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Alumni</h1>

      {message && (
        <p className="mb-4 text-sm text-primary-700 dark:text-primary-300">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus size={20} />
          Add Alumni
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {['firstName', 'lastName', 'email', 'branch', 'currentRole', 'currentCompany', 'linkedinProfile'].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
                  required={['firstName', 'lastName', 'email', 'branch', 'currentRole', 'currentCompany'].includes(field)}
                />
              </div>
            )
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Advice</label>
          <textarea
            name="advice"
            value={formData.advice}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Create Alumni Profile'}
        </button>
      </form>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-200 dark:border-dark-700">
          All Alumni ({alumni.length})
        </h2>

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : alumni.length === 0 ? (
          <p className="p-6 text-gray-500">No alumni profiles yet</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-dark-700">
            {alumni.map((alum) => (
              <li key={alum._id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {alum.firstName} {alum.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {alum.currentRole} at {alum.currentCompany} · {alum.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(alum._id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Delete alumni"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

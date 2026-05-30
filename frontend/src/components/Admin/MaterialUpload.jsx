import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { libraryAPI } from '../../services/api';

export const MaterialUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subject: '',
    branch: '',
    semester: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['PYQ', 'Notes', 'Lecture', 'Tutorial', 'Solution', 'Question Bank'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 50 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 50MB' });
      return;
    }
    setFile(selectedFile);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!file || !formData.title || !formData.category || !formData.subject) {
      setMessage({ type: 'error', text: 'Please fill required fields and select a file' });
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      Object.entries(formData).forEach(([key, value]) => {
        if (value) uploadData.append(key, value);
      });

      await libraryAPI.uploadMaterial(uploadData);

      setMessage({ type: 'success', text: 'Material uploaded successfully!' });
      setFormData({
        title: '',
        description: '',
        category: '',
        subject: '',
        branch: '',
        semester: '',
      });
      setFile(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload material',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Upload Study Material</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          )}
          <p>{message.text}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-dark-700"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
              required
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
              required
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg dark:bg-dark-700 dark:text-white dark:border-dark-600"
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">File *</label>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center cursor-pointer"
            onClick={() => document.getElementById('file-input')?.click()}
            onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
            role="button"
            tabIndex={0}
          >
            <Upload className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="font-medium">{file ? file.name : 'Click to upload'}</p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, PPT, ZIP — max 50MB</p>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              className="hidden"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

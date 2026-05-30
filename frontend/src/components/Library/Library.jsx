import React, { useState, useEffect } from 'react';
import { Download, Search, Filter, Star, FileText, X } from 'lucide-react';
import { libraryAPI } from '../../services/api';

const EMPTY_FILTERS = {
  search: '',
  category: '',
  subject: '',
  branch: '',
  semester: '',
};

export const Library = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await libraryAPI.getMaterials({
          ...filters,
          search: debouncedSearch,
          page,
          limit: 12,
        });
        setMaterials(response.data.materials);
        setPagination(response.data.pagination);
      } catch (err) {
        setMaterials([]);
        setPagination(null);
        setError(err.response?.data?.message || 'Failed to load materials. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [filters.category, filters.subject, filters.branch, filters.semester, debouncedSearch, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setDebouncedSearch('');
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const handleDownload = async (id) => {
    if (downloadingId) return;
    setDownloadingId(id);
    try {
      const response = await libraryAPI.downloadMaterial(id);
      const { fileUrl, downloads } = response.data;
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      setMaterials((prev) =>
        prev.map((m) => (m._id === id ? { ...m, downloads } : m))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  const categories = ['PYQ', 'Notes', 'Lecture', 'Tutorial', 'Solution', 'Question Bank'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Study Materials Library
      </h1>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <X size={16} />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branch
            </label>
            <input
              type="text"
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Semester
            </label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white"
            >
              <option value="">All</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Sem {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-12 text-center border border-gray-200 dark:border-dark-700">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">No materials found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {materials.map((material) => (
              <div
                key={material._id}
                className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6"
              >
                <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  {material.category}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{material.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {material.subject}
                  {material.semester ? ` • Sem ${material.semester}` : ''}
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(material.averageRating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-500">
                    {material.averageRating || 0} ({material.ratings?.length || 0})
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {material.downloads || 0} downloads · {material.views || 0} views
                </p>
                <button
                  type="button"
                  onClick={() => handleDownload(material._id)}
                  disabled={downloadingId === material._id}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  <Download size={18} />
                  <span>{downloadingId === material._id ? 'Opening...' : 'Download'}</span>
                </button>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

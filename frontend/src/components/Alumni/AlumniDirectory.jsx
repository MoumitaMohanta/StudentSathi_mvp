import React, { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, Mail, ExternalLink } from 'lucide-react';
import { alumniAPI } from '../../services/api';
import { Avatar } from '../Common/Avatar';

export const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', branch: '', graduationYear: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const response = await alumniAPI.getAlumni({ ...filters, page, limit: 12 });
        setAlumni(response.data.alumni);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch alumni:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Alumni Directory</h1>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-dark-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Name or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white"
              />
            </div>
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
              Graduation Year
            </label>
            <select
              name="graduationYear"
              value={filters.graduationYear}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : alumni.length === 0 ? (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-12 text-center border border-gray-200 dark:border-dark-700">
          <p className="text-gray-600 dark:text-gray-400">No alumni found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {alumni.map((alum) => (
              <div
                key={alum._id}
                className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                  <Avatar
                    name={`${alum.firstName} ${alum.lastName}`}
                    src={alum.profilePicture}
                    size="md"
                    className="border-4 border-white mb-4"
                  />
                  <h3 className="font-semibold text-lg">
                    {alum.firstName} {alum.lastName}
                  </h3>
                  <p className="text-primary-100 text-sm">Class of {alum.graduationYear}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Briefcase className="text-gray-500 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alum.currentRole}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alum.currentCompany}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPin className="text-gray-500 flex-shrink-0 mt-1" size={18} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{alum.branch}</p>
                  </div>
                  {alum.advice && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                        Advice
                      </p>
                      <p className="text-xs text-blue-800 dark:text-blue-300 line-clamp-3">
                        {alum.advice}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-dark-700">
                    <a
                      href={`mailto:${alum.email}`}
                      className="flex-1 flex items-center justify-center space-x-2 text-primary-600 font-medium text-sm"
                    >
                      <Mail size={16} />
                      <span>Email</span>
                    </a>
                    {alum.linkedinProfile && (
                      <a
                        href={alum.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
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
              <span className="text-sm text-gray-600">
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

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import EquipmentCard from '../components/EquipmentCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Browse = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);

      const response = await axios.get(`${API_URL}/equipment?${params.toString()}`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold text-charcoal-grey mb-4">Filters</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.category')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            >
              <option value="">{t('category.all')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isRTL ? cat.name_ar : cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('home.searchPlaceholder')}
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('home.locationPlaceholder')}
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder={t('home.locationPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            />
          </div>
        </aside>

        {/* Equipment Grid */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-charcoal-grey">
              {t('nav.browse')}
            </h1>
            <p className="text-gray-600 mt-2">
              {equipment.length} {equipment.length === 1 ? 'listing' : 'listings'} found
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : equipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">No equipment found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Browse;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import EquipmentCard from '../components/EquipmentCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchFeaturedEquipment();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedEquipment = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipment?limit=6`);
      setFeaturedEquipment(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured equipment:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat py-20 bg-gray-800"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL || ''}/images/hero-background.png)`
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.title')}
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              {t('home.subtitle')}
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded border border-gray-300 text-charcoal-grey focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
                <input
                  type="text"
                  placeholder={t('home.locationPlaceholder')}
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded border border-gray-300 text-charcoal-grey focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
                <button
                  type="submit"
                  className="bg-safety-yellow text-charcoal-grey px-8 py-3 rounded font-semibold hover:bg-yellow-400 transition-colors"
                >
                  {t('home.searchButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-charcoal-grey mb-8 text-center">
            {t('home.browseByCategory')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Equipment Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-charcoal-grey mb-8 text-center">
            {t('home.featuredEquipment')}
          </h2>
          {featuredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEquipment.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No equipment listings yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;


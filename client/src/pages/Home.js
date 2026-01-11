import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroBackground from '../images/hero-background.png';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

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
          backgroundImage: `url(${heroBackground})`
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
    </div>
  );
};

export default Home;


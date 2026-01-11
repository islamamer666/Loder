import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-charcoal-grey text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className={`flex items-center ${i18n.language === 'ar' ? 'space-x-[360px]' : 'space-x-10'}`}>
            <Link
              to="/browse"
              className={`hover:text-safety-yellow transition-colors ${
                isActive('/browse') ? 'text-safety-yellow' : ''
              }`}
            >
              {t('nav.browse')}
            </Link>
            <Link
              to="/list"
              className={`hover:text-safety-yellow transition-colors ${
                isActive('/list') ? 'text-safety-yellow' : ''
              }`}
            >
              {t('nav.list')}
            </Link>

            <div className="flex items-center space-x-2 border-l border-gray-600 pl-6">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded ${
                  i18n.language === 'en'
                    ? 'bg-safety-yellow text-charcoal-grey font-semibold'
                    : 'hover:bg-gray-700'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-3 py-1 rounded ${
                  i18n.language === 'ar'
                    ? 'bg-safety-yellow text-charcoal-grey font-semibold'
                    : 'hover:bg-gray-700'
                }`}
              >
                AR
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


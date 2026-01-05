import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoryCard = ({ category }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const categoryName = isRTL ? category.name_ar : category.name;

  return (
    <button
      onClick={() => navigate(`/browse?category=${category.id}`)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
    >
      <div className="text-4xl mb-3">🏗️</div>
      <h3 className="text-lg font-semibold text-charcoal-grey">{categoryName}</h3>
    </button>
  );
};

export default CategoryCard;


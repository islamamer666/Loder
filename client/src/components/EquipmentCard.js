import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EquipmentCard = ({ equipment }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const images = equipment.images && Array.isArray(equipment.images) 
    ? equipment.images 
    : typeof equipment.images === 'string' 
      ? JSON.parse(equipment.images || '[]') 
      : [];

  const defaultImage = 'https://via.placeholder.com/400x300?text=Equipment';

  return (
    <Link
      to={`/equipment/${equipment.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={images.length > 0 ? images[0] : defaultImage}
          alt={equipment.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-charcoal-grey mb-2 line-clamp-2">
          {equipment.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {equipment.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {equipment.listing_type === 'sell' ? (
              <>
                <p className="text-xs text-gray-500 mb-1">{t('equipment.forSale')}</p>
                <p className="text-xl font-bold text-safety-yellow">
                  ${equipment.price}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-1">
                  {equipment.hourly_rate && equipment.monthly_rate 
                    ? t('equipment.hourlyRate') + ' / ' + t('equipment.monthlyRate')
                    : equipment.hourly_rate 
                      ? t('equipment.hourlyRate')
                      : t('equipment.monthlyRate')}
                </p>
                <p className="text-xl font-bold text-safety-yellow">
                  {equipment.hourly_rate && `$${equipment.hourly_rate}/hr`}
                  {equipment.hourly_rate && equipment.monthly_rate && ' / '}
                  {equipment.monthly_rate && `$${equipment.monthly_rate}/mo`}
                  {!equipment.hourly_rate && !equipment.monthly_rate && equipment.daily_rate && `$${equipment.daily_rate}/day`}
                </p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">{t('equipment.location')}</p>
            <p className="text-sm font-medium text-charcoal-grey">{equipment.location}</p>
          </div>
        </div>
        {equipment.category_name && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs bg-gray-100 text-charcoal-grey px-2 py-1 rounded">
              {isRTL ? equipment.category_name : equipment.category_name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EquipmentCard;


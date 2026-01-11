import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEquipmentDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/equipment/${id}`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEquipmentDetails();
  }, [fetchEquipmentDetails]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Equipment not found.</p>
        <button
          onClick={() => navigate('/browse')}
          className="mt-4 bg-charcoal-grey text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          {t('details.back')}
        </button>
      </div>
    );
  }

  const images = equipment.images && Array.isArray(equipment.images)
    ? equipment.images
    : typeof equipment.images === 'string'
      ? JSON.parse(equipment.images || '[]')
      : [];

  const defaultImage = 'https://via.placeholder.com/800x600?text=Equipment';

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/browse')}
        className="mb-6 text-charcoal-grey hover:text-safety-yellow transition-colors"
      >
        ← {t('details.back')}
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Images */}
          <div>
            <div className="mb-4">
              <img
                src={images.length > 0 ? images[0] : defaultImage}
                alt={equipment.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${equipment.title} ${idx + 2}`}
                    className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-charcoal-grey mb-4">
              {equipment.title}
            </h1>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {equipment.listing_type === 'sell' ? (
                    <>
                      <p className="text-sm text-gray-600 mb-1">{t('equipment.forSale')}</p>
                      <p className="text-3xl font-bold text-safety-yellow">
                        ${equipment.price}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">{t('equipment.forRent')}</p>
                      <div className="text-3xl font-bold text-safety-yellow">
                        {equipment.hourly_rate && (
                          <div className="mb-2">
                            ${equipment.hourly_rate}
                            <span className="text-lg text-gray-600">/hr</span>
                          </div>
                        )}
                        {equipment.monthly_rate && (
                          <div>
                            ${equipment.monthly_rate}
                            <span className="text-lg text-gray-600">/mo</span>
                          </div>
                        )}
                        {!equipment.hourly_rate && !equipment.monthly_rate && equipment.daily_rate && (
                          <div>
                            ${equipment.daily_rate}
                            <span className="text-lg text-gray-600">/day</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">{t('equipment.location')}</p>
                  <p className="text-lg font-semibold text-charcoal-grey">
                    {equipment.location}
                  </p>
                </div>
              </div>

              {equipment.category_name && (
                <span className="inline-block bg-gray-100 text-charcoal-grey px-3 py-1 rounded text-sm mb-4">
                  {equipment.category_name}
                </span>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h2 className="text-xl font-semibold text-charcoal-grey mb-4">
                {t('equipment.description')}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {equipment.description || 'No description provided.'}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-charcoal-grey mb-4">
                {t('details.contactInfo')}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{t('details.name')}</p>
                  <p className="font-medium text-charcoal-grey">{equipment.owner_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('details.email')}</p>
                  <a
                    href={`mailto:${equipment.owner_email}`}
                    className="font-medium text-safety-yellow hover:underline"
                  >
                    {equipment.owner_email}
                  </a>
                </div>
                {equipment.owner_phone && (
                  <div>
                    <p className="text-sm text-gray-600">{t('details.phone')}</p>
                    <a
                      href={`tel:${equipment.owner_phone}`}
                      className="font-medium text-charcoal-grey hover:text-safety-yellow"
                    >
                      {equipment.owner_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;


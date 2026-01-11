import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ListEquipment = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    listing_type: 'rent',
    price: '',
    hourly_rate: '',
    monthly_rate: '',
    daily_rate: '',
    location: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    images: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post(`${API_URL}/equipment`, formData);
      setMessage({ type: 'success', text: t('listing.success') });
      setFormData({
        title: '',
        description: '',
        category_id: '',
        listing_type: 'rent',
        price: '',
        hourly_rate: '',
        monthly_rate: '',
        daily_rate: '',
        location: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
        images: [],
      });
      setTimeout(() => {
        navigate('/browse');
      }, 2000);
    } catch (error) {
      console.error('Error creating equipment listing:', error);
      setMessage({ type: 'error', text: t('listing.error') });
    } finally {
      setLoading(false);
    }
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-charcoal-grey mb-2">
          {t('listing.title')}
        </h1>
        <p className="text-gray-600 mb-8">{t('listing.subtitle')}</p>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.equipmentTitle')}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('listing.titlePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.category')}
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            >
              <option value="">{t('listing.selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isRTL ? cat.name_ar : cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('listing.descriptionPlaceholder')}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.listingTypeList')}
            </label>
            <select
              name="listing_type"
              value={formData.listing_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            >
              <option value="rent">{t('listing.rent')}</option>
              <option value="sell">{t('listing.sell')}</option>
            </select>
          </div>

          {formData.listing_type === 'sell' ? (
            <div>
              <label className="block text-sm font-medium text-charcoal-grey mb-2">
                {t('listing.price')}
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder={t('listing.pricePlaceholder')}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-grey mb-2">
                  {t('listing.hourlyRate')}
                </label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  placeholder={t('listing.hourlyRatePlaceholder')}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-grey mb-2">
                  {t('listing.monthlyRate')}
                </label>
                <input
                  type="number"
                  name="monthly_rate"
                  value={formData.monthly_rate}
                  onChange={handleChange}
                  placeholder={t('listing.monthlyRatePlaceholder')}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.location')}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t('listing.locationPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-charcoal-grey mb-4">
              {t('details.contactInfo')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-grey mb-2">
                  {t('listing.ownerName')}
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-grey mb-2">
                  {t('listing.ownerEmail')}
                </label>
                <input
                  type="email"
                  name="owner_email"
                  value={formData.owner_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-grey mb-2">
                  {t('listing.ownerPhone')}
                </label>
                <input
                  type="tel"
                  name="owner_phone"
                  value={formData.owner_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-grey mb-2">
              {t('listing.images')}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-safety-yellow"
            />
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-safety-yellow text-charcoal-grey px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : t('listing.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListEquipment;


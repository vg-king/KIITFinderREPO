import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, categories, locations } from '../services/api';
import Layout from '../components/Layout/Layout';
import { 
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const AddItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost',
    location: '',
    reward: '',
    tags: [],
    images: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these to a cloud storage service
    // For demo purposes, we'll use placeholder URLs
    const imageUrls = files.map((file, index) => 
      `https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&t=${Date.now()}-${index}`
    );
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5) // Max 5 images
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.reward && (isNaN(formData.reward) || formData.reward < 0)) {
      newErrors.reward = 'Reward must be a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const itemData = {
        ...formData,
        reward: formData.reward ? parseInt(formData.reward) : 0,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone
      };
      
      const response = await itemsAPI.createItem(itemData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-items');
        }, 2000);
      } else {
        setErrors({ submit: response.error || 'Failed to create item' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to create item. Please try again.' });
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Reported Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your {formData.type} item has been added to the database. 
            The community will be notified and can help you find it.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your items...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report an Item
          </h1>
          <p className="text-gray-600">
            Help the KIIT community by reporting lost or found items
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Item Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.type === 'lost'
                    ? 'border-error-500 bg-error-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">😢</div>
                    <div className="font-medium text-gray-900">Lost Item</div>
                    <div className="text-sm text-gray-600">I lost something</div>
                  </div>
                </div>
              </label>
              
              <label className="relative">
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.type === 'found'
                    ? 'border-success-500 bg-success-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="font-medium text-gray-900">Found Item</div>
                    <div className="text-sm text-gray-600">I found something</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-error-300 focus:ring-error-500' : ''}`}
              placeholder="e.g., iPhone 13 Pro, Blue Backpack, Gold Watch"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`input-field ${errors.description ? 'border-error-300 focus:ring-error-500' : ''}`}
              placeholder="Provide detailed description including color, brand, distinctive features, etc."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-600">{errors.description}</p>
            )}
          </div>

          {/* Category and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? 'border-error-300 focus:ring-error-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-error-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`input-field ${errors.location ? 'border-error-300 focus:ring-error-500' : ''}`}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-error-600">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Reward (optional) */}
          <div>
            <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-1">
              Reward Amount (Optional)
            </label>
            <div className="relative">
              <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                id="reward"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                className={`input-field pl-10 ${errors.reward ? 'border-error-300 focus:ring-error-500' : ''}`}
                placeholder="0"
                min="0"
              />
            </div>
            {errors.reward && (
              <p className="mt-1 text-sm text-error-600">{errors.reward}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Optional: Offer a reward to encourage people to help find your item
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (Optional)
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 input-field"
                placeholder="Add tags to help people find your item"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-500 font-medium">
                    Click to upload
                  </span>
                  <span> or drag and drop</span>
                </label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (Max 5 images)</p>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center hover:bg-error-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary flex justify-center items-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddItem;
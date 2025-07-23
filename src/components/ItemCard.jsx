import React from 'react';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  TagIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const ItemCard = ({ item, onContact, onResolve, showActions = true, currentUserId }) => {
  const isOwner = currentUserId === item.userId;
  const isResolved = item.status === 'resolved';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'lost' 
      ? 'bg-error-100 text-error-800' 
      : 'bg-success-100 text-success-800';
  };

  return (
    <div className={`card card-hover ${isResolved ? 'opacity-75' : ''}`}>
      {/* Image */}
      {item.images && item.images.length > 0 && (
        <div className="relative mb-4">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {isResolved && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">RESOLVED</span>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {item.title}
        </h3>
        <div className="flex space-x-2 ml-2">
          <span className={`badge ${getTypeColor(item.type)}`}>
            {item.type.toUpperCase()}
          </span>
          <span className={`badge ${getStatusColor(item.status)}`}>
            {item.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {item.description}
      </p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span>{item.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <CalendarDaysIcon className="w-4 h-4 mr-2" />
          <span>{formatDate(item.dateReported)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <TagIcon className="w-4 h-4 mr-2" />
          <span>{item.category}</span>
        </div>

        {item.reward > 0 && (
          <div className="flex items-center text-sm text-success-600 font-medium">
            <CurrencyRupeeIcon className="w-4 h-4 mr-2" />
            <span>Reward: ₹{item.reward}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div className="border-t pt-4 mb-4">
        <p className="text-sm font-medium text-gray-900 mb-2">Contact Information</p>
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{item.userName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <EnvelopeIcon className="w-4 h-4 mr-2" />
            <span>{item.userEmail}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4 mr-2" />
            <span>{item.userPhone}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && !isResolved && (
        <div className="flex space-x-2">
          {!isOwner && (
            <button
              onClick={() => onContact && onContact(item)}
              className="flex-1 btn-primary text-sm"
            >
              Contact Owner
            </button>
          )}
          
          {isOwner && (
            <button
              onClick={() => onResolve && onResolve(item.id)}
              className="flex-1 btn-success text-sm"
            >
              Mark as Resolved
            </button>
          )}
        </div>
      )}

      {isResolved && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500 font-medium">
            ✓ This item has been resolved
          </span>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
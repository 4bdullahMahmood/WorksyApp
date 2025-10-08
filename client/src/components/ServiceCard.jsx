'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, DollarSign, MessageCircle } from 'lucide-react';

export default function ServiceCard({ service, showProvider = true }) {
  const {
    id,
    title,
    description,
    category,
    price,
    location,
    providerName,
    rating,
    reviewCount,
    images = [],
    availability
  } = service;

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price || 'Contact for pricing';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Service Image */}
      <div className="relative h-48 bg-gray-200">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-lg font-medium">{category}</span>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            availability === 'available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {availability === 'available' ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-sm text-blue-600 font-medium mb-1">
          {category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Provider Info */}
        {showProvider && (
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-gray-500">by</span>
            <span className="text-sm font-medium text-gray-700">{providerName}</span>
          </div>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-600">
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{location}</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-lg font-semibold text-green-600">
              {formatPrice(price)}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </button>
            <Link 
              href={`/service/${id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

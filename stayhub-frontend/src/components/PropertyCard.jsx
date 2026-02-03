import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/properties/${property._id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images?.[0] || '/placeholder.jpg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-700 text-xl" />
          )}
        </button>
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
          ${property.pricePerNight}/night
        </div>
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
          {property.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          {property.rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{property.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>{property.bedrooms} beds</span>
          <span>•</span>
          <span>{property.bathrooms} baths</span>
          <span>•</span>
          <span>{property.guests} guests</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {property.amenities?.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

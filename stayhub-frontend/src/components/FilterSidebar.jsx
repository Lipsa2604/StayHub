import React from 'react';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const propertyTypes = ['All Types', 'Villa', 'House', 'Penthouse', 'Cabin'];
  const bedroomOptions = ['any', '1', '2', '3', '4+'];
  const amenities = ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Beach access', 'Gym'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </h2>
        <button
          onClick={onClearFilters}
          className="text-primary text-sm hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Price Range</label>
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="$0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="$2000"
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full mt-3"
        />
        <p className="text-center text-sm text-gray-600 mt-2">
          ${filters.minPrice} - ${filters.maxPrice}
        </p>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Property Type</label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                checked={filters.propertyType === (type === 'All Types' ? 'all' : type.toLowerCase())}
                onChange={() => onFilterChange({ 
                  propertyType: type === 'All Types' ? 'all' : type.toLowerCase() 
                })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {bedroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => onFilterChange({ bedrooms: option })}
              className={`px-4 py-2 rounded-full border transition ${
                filters.bedrooms === option
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Amenities</label>
        <div className="space-y-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity.toLowerCase())}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...filters.amenities, amenity.toLowerCase()]
                    : filters.amenities.filter((a) => a !== amenity.toLowerCase());
                  onFilterChange({ amenities: newAmenities });
                }}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Location</label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          placeholder="Enter city or address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;

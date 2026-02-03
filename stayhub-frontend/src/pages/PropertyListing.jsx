import React, { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import { FaFilter } from 'react-icons/fa';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: 0,
    maxPrice: 2000,
    propertyType: 'all',
    bedrooms: 'any',
    amenities: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [aiSearch, setAiSearch] = useState('');

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAll(filters);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!aiSearch.trim()) return;
    
    try {
      setLoading(true);
      const response = await propertyAPI.searchWithAI(aiSearch);
      setProperties(response.data);
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: 0,
      maxPrice: 2000,
      propertyType: 'all',
      bedrooms: 'any',
      amenities: [],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* AI Search Bar */}
      <div className="mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={aiSearch}
              onChange={(e) => setAiSearch(e.target.value)}
              placeholder="Try: 'Beachfront villa with pool under $500 near Miami'"
              className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
            />
            <button
              onClick={handleAISearch}
              className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 font-semibold"
            >
              🤖 AI Search
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Use natural language to find your perfect stay
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-full shadow-lg z-40 flex items-center gap-2"
        >
          <FaFilter /> Filters
        </button>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-2xl">×</button>
              </div>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        )}

        {/* Property Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Available Properties</h1>
            <p className="text-gray-600">{properties.length} properties found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4" />
                  <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded" />
                  <div className="bg-gray-300 h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-500">No properties found</p>
              <button onClick={clearFilters} className="mt-4 text-primary underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PropertyListing;

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';
import Button from '@/components/Button';
import { api } from '@/utils/api';

export default function SearchPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState('relevance');
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const q = searchParams.get('q') || '';
    
    setFilters(prev => ({
      ...prev,
      category,
      location,
      searchTerm: q
    }));
    
    loadServices({ category, location, q });
  }, [searchParams]);

  const loadServices = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const servicesData = await api.services.getAll(searchFilters);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const applyFilters = () => {
    loadServices(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: 'all'
    };
    setFilters(clearedFilters);
    loadServices(clearedFilters);
  };

  const sortServices = (services, sortBy) => {
    switch (sortBy) {
      case 'price-low':
        return [...services].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...services].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...services].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...services].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return services;
    }
  };

  const sortedServices = sortServices(services, sortBy);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Services
          </h1>
          <SearchBar 
            className="max-w-4xl" 
            showFilters={true}
            onSearch={loadServices}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-1 text-blue-600"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="flooring">Flooring</option>
                    <option value="roofing">Roofing</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="general-handyman">General Handyman</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={filters.location}
                    onChange={(e) => handleFilterChange({ location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange({ rating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => handleFilterChange({ availability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All</option>
                    <option value="available">Available Now</option>
                    <option value="this-week">This Week</option>
                    <option value="next-week">Next Week</option>
                  </select>
                </div>

                {/* Filter Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={applyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading ? 'Loading...' : `${services.length} services found`}
                </h2>
                <p className="text-sm text-gray-600">
                  {filters.category && `in ${filters.category}`}
                  {filters.location && ` near ${filters.location}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : sortedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

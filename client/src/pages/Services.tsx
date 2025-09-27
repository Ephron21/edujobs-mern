import React, { useState, useEffect } from 'react';
import { Star, Clock, CheckCircle, Filter, Search } from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  features: string[];
  imageUrl?: string;
  isFeatured: boolean;
  formattedPrice: string;
}

interface ServicesResponse {
  success: boolean;
  data: {
    services: Service[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'university_application', label: 'University Applications' },
    { value: 'job_placement', label: 'Job Placement' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, showFeaturedOnly, searchTerm]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (showFeaturedOnly) {
        params.append('featured', 'true');
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services?${params}`);
      const data: ServicesResponse = await response.json();

      if (data.success) {
        setServices(data.data.services);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError('Error loading services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      university_application: 'bg-blue-100 text-blue-800',
      job_placement: 'bg-green-100 text-green-800',
      consulting: 'bg-purple-100 text-purple-800',
      training: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchServices}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional educational and career services to help you achieve your goals
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured only</span>
            </label>
          </div>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-xl">
              No services found matching your criteria
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Service Image */}
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {service.title}
                        {service.isFeatured && (
                          <Star className="inline ml-2 h-5 w-5 text-yellow-500 fill-current" />
                        )}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(service.category)}`}>
                        {formatCategoryName(service.category)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-sm text-gray-500 dark:text-gray-400">
                          +{service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${service.price}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
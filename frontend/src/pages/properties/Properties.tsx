import React, { useState } from 'react'
import { Search, Filter, MapPin, Plus, Building2, Home, Star, Eye } from 'lucide-react'
import PropertyCard from '../../components/dashboard/PropertyCard'

const Properties: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // Mock properties data
  const properties = [
    {
      _id: '1',
      name: 'Green Valley Apartments',
      description: 'Modern apartments with great amenities',
      address: {
        city: 'Nairobi',
        county: 'Nairobi County',
        street: 'Moi Avenue'
      },
      photos: [],
      availableUnits: 3,
      totalUnits: 12,
      units: [{
        bedrooms: 2,
        bathrooms: 1,
        size: 850,
        price: 35000
      }],
      amenities: {
        security: true,
        parking: true,
        gym: true,
        pool: false
      },
      averageRating: 4.5
    },
    {
      _id: '2',
      name: 'Royal Gardens Estate',
      description: 'Luxury houses with spacious gardens',
      address: {
        city: 'Mombasa',
        county: 'Mombasa County',
        street: 'Nyali Road'
      },
      photos: [],
      availableUnits: 1,
      totalUnits: 8,
      units: [{
        bedrooms: 3,
        bathrooms: 2,
        size: 1200,
        price: 85000
      }],
      amenities: {
        security: true,
        parking: true,
        gym: true,
        pool: true
      },
      averageRating: 4.8
    },
    {
      _id: '3',
      name: 'City View Studios',
      description: 'Affordable studios in city center',
      address: {
        city: 'Nairobi',
        county: 'Nairobi County',
        street: 'Tom Mboya Street'
      },
      photos: [],
      availableUnits: 5,
      totalUnits: 20,
      units: [{
        bedrooms: 1,
        bathrooms: 1,
        size: 450,
        price: 18000
      }],
      amenities: {
        security: true,
        parking: false,
        gym: false,
        pool: false
      },
      averageRating: 4.2
    },
    {
      _id: '4',
      name: 'Lakeview Villas',
      description: 'Luxury villas with lake views',
      address: {
        city: 'Naivasha',
        county: 'Nakuru County',
        street: 'Moi South Lake Road'
      },
      photos: [],
      availableUnits: 2,
      totalUnits: 6,
      units: [{
        bedrooms: 4,
        bathrooms: 3,
        size: 1800,
        price: 120000
      }],
      amenities: {
        security: true,
        parking: true,
        gym: true,
        pool: true
      },
      averageRating: 4.9
    }
  ]

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'available' && property.availableUnits > 0) ||
                         (filter === 'luxury' && property.units[0].price > 50000)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Properties</h1>
          <p className="page-description">
            Browse and manage rental properties. {filteredProperties.length} properties found.
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties by name, location, or amenities..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field pl-10"
            >
              <option value="all">All Properties</option>
              <option value="available">Available Now</option>
              <option value="luxury">Luxury Properties</option>
              <option value="affordable">Affordable</option>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
            </select>
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-manyani-brown text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'available'
                ? 'bg-manyani-green text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Available Now
          </button>
          <button
            onClick={() => setFilter('luxury')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'luxury'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Luxury
          </button>
          <button
            onClick={() => setFilter('affordable')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'affordable'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Affordable
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-manyani-brown/10 mr-4">
              <Building2 className="h-6 w-6 text-manyani-brown" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-manyani-green/10 mr-4">
              <Home className="h-6 w-6 text-manyani-green" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available Units</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {properties.reduce((sum, prop) => sum + prop.availableUnits, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 mr-4">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 mr-4">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Properties Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilter('all')
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Map view toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              Showing properties on map view
            </span>
          </div>
          <button className="text-sm text-manyani-brown hover:text-manyani-brown/80 font-medium">
            Switch to List View →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Properties

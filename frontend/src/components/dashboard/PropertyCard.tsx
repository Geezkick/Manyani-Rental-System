import React from 'react'
import { MapPin, Bed, Bath, Square, Users, Star } from 'lucide-react'

interface PropertyCardProps {
  property: any
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="card hover:shadow-manyani-lg transition-all duration-300">
      {/* Property image */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        {property.photos?.[0] ? (
          <img
            src={property.photos[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full manyani-gradient-bg flex items-center justify-center">
            <div className="text-white text-center">
              <Building2 className="h-12 w-12 mx-auto mb-2" />
              <span className="font-bold">{property.name}</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="badge badge-success">
            {property.availableUnits} Available
          </span>
        </div>
      </div>

      {/* Property info */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 dark:text-white">
            {property.name}
          </h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {property.averageRating || '4.5'}
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.address?.city}, {property.address?.county}</span>
        </div>

        {/* Property stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm">{property.units?.[0]?.bedrooms || 2} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm">{property.units?.[0]?.bathrooms || 1} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm">{property.units?.[0]?.size || 800} sq ft</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm">{property.totalUnits || 1} Units</span>
          </div>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
            <p className="text-xl font-bold text-manyani-brown">
              KES {property.units?.[0]?.price?.toLocaleString() || '25,000'}
              <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">/month</span>
            </p>
          </div>
          <button className="btn-primary text-sm px-4 py-2">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard

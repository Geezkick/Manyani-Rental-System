import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Users, 
  Car, 
  Wifi, 
  Dumbbell, 
  Droplets,
  Shield,
  Star,
  Calendar,
  DollarSign,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

const PropertyDetails: React.FC = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock property data
  const property = {
    _id: id || '1',
    name: 'Green Valley Apartments',
    description: 'Modern luxury apartments located in the heart of Nairobi with state-of-the-art amenities and 24/7 security. Perfect for professionals and families.',
    address: {
      street: '123 Moi Avenue',
      city: 'Nairobi',
      county: 'Nairobi County',
      postalCode: '00100',
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    type: 'apartment',
    buildingName: 'Green Valley Towers',
    totalUnits: 12,
    availableUnits: 3,
    floors: 8,
    yearBuilt: 2020,
    units: [
      {
        unitNumber: '4B',
        floor: 4,
        bedrooms: 2,
        bathrooms: 1,
        size: 850,
        price: 35000,
        deposit: 70000,
        status: 'available',
        features: ['Balcony', 'AC', 'Fitted Kitchen'],
        photos: [],
        currentTenant: null
      },
      {
        unitNumber: '7A',
        floor: 7,
        bedrooms: 3,
        bathrooms: 2,
        size: 1200,
        price: 55000,
        deposit: 110000,
        status: 'available',
        features: ['Penthouse', 'Panoramic View', 'Jacuzzi'],
        photos: [],
        currentTenant: null
      }
    ],
    amenities: {
      water: true,
      electricity: true,
      wifi: true,
      parking: true,
      security: true,
      gym: true,
      pool: false,
      laundry: true,
      elevator: true,
      cctv: true,
      generator: true,
      garbage: true
    },
    amenityCosts: {
      water: 1500,
      electricity: 3000,
      garbage: 500,
      maintenance: 2000,
      security: 1000,
      parking: 2000
    },
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w-800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    policies: {
      petsAllowed: false,
      smokingAllowed: false,
      maxOccupants: 4,
      noticePeriod: 30
    },
    landlord: {
      name: 'John Kamau',
      phone: '+254 700 123 456',
      email: 'john@example.com'
    },
    averageRating: 4.5,
    totalReviews: 24
  }

  const totalMonthlyCost = property.units[0].price + 
    Object.values(property.amenityCosts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      {/* Back button and actions */}
      <div className="flex items-center justify-between">
        <Link to="/properties" className="flex items-center text-manyani-brown hover:text-manyani-brown/80">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Properties
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Share2 className="h-5 w-5 text-gray-400" />
          </button>
          <button className="btn-primary">
            <Calendar className="h-4 w-4 mr-2" />
            Book Viewing
          </button>
        </div>
      </div>

      {/* Property header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mr-3">
                {property.name}
              </h1>
              <div className="flex items-center bg-manyani-green/10 text-manyani-green px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span className="text-sm font-medium">{property.averageRating}</span>
                <span className="text-sm ml-1">({property.totalReviews} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.address.street}, {property.address.city}, {property.address.county}</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {property.description}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-manyani-brown/5">
                <Bed className="h-6 w-6 text-manyani-brown mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {property.units[0].bedrooms}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-manyani-green/5">
                <Bath className="h-6 w-6 text-manyani-green mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {property.units[0].bathrooms}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/5">
                <Square className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {property.units[0].size} sq ft
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-500/5">
                <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {property.policies.maxOccupants} people
                </p>
              </div>
            </div>
          </div>

          {/* Price card */}
          <div className="md:w-80">
            <div className="card border-2 border-manyani-brown/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Pricing Details
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monthly Rent</span>
                  <span className="font-medium">KES {property.units[0].price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Security Deposit</span>
                  <span className="font-medium">KES {property.units[0].deposit.toLocaleString()}</span>
                </div>
                {Object.entries(property.amenityCosts).map(([key, value]) => (
                  value > 0 && (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="font-medium">KES {value.toLocaleString()}</span>
                    </div>
                  )
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Monthly</span>
                    <span className="text-manyani-brown">KES {totalMonthlyCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button className="w-full btn-primary mb-3">
                <DollarSign className="h-4 w-4 mr-2" />
                Book Now
              </button>
              <button className="w-full btn-outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Landlord
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {['overview', 'amenities', 'units', 'reviews', 'location', 'policies'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-manyani-brown text-manyani-brown'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="pt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photos */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.photos.map((photo, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Building info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Building Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Building Name</span>
                    <span className="font-medium">{property.buildingName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Floors</span>
                    <span className="font-medium">{property.floors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Units</span>
                    <span className="font-medium">{property.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Available Units</span>
                    <span className="font-medium text-manyani-green">{property.availableUnits}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Amenities & Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(property.amenities).map(([key, value]) => (
                  <div key={key} className={`flex items-center p-3 rounded-lg ${
                    value ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <div className={`p-2 rounded mr-3 ${
                      value ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {key === 'wifi' && <Wifi className="h-5 w-5" />}
                      {key === 'parking' && <Car className="h-5 w-5" />}
                      {key === 'gym' && <Dumbbell className="h-5 w-5" />}
                      {key === 'security' && <Shield className="h-5 w-5" />}
                      {key === 'water' && <Droplets className="h-5 w-5" />}
                      {!['wifi', 'parking', 'gym', 'security', 'water'].includes(key) && (
                        <div className="h-5 w-5 bg-current rounded"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {value ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Available Units</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Unit Number</th>
                      <th>Floor</th>
                      <th>Bed/Bath</th>
                      <th>Size</th>
                      <th>Monthly Rent</th>
                      <th>Deposit</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.units.map((unit) => (
                      <tr key={unit.unitNumber}>
                        <td className="font-medium">{unit.unitNumber}</td>
                        <td>{unit.floor}</td>
                        <td>{unit.bedrooms}B / {unit.bathrooms}B</td>
                        <td>{unit.size} sq ft</td>
                        <td className="font-bold text-manyani-brown">
                          KES {unit.price.toLocaleString()}
                        </td>
                        <td>KES {unit.deposit.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            unit.status === 'available' ? 'badge-success' : 'badge-warning'
                          }`}>
                            {unit.status}
                          </span>
                        </td>
                        <td>
                          <button className="text-sm text-manyani-brown hover:text-manyani-brown/80 font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Landlord Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-manyani-brown rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">JK</span>
              </div>
              <div>
                <p className="font-medium">{property.landlord.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Property Owner</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2" />
              <span>{property.landlord.phone}</span>
            </div>
            <button className="w-full btn-outline mt-4">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Viewing
            </button>
            <button className="w-full btn-secondary">
              <DollarSign className="h-4 w-4 mr-2" />
              Make Payment
            </button>
            <button className="w-full btn-outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Property
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <button className="w-full btn-outline">
            <Phone className="h-4 w-4 mr-2" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails

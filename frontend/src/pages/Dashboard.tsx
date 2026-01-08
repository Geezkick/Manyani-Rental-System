import React from 'react'
import { 
  Home, 
  Users, 
  CreditCard, 
  AlertCircle, 
  Calendar,
  Wrench,
  MessageSquare
} from 'lucide-react'
import ErrorBoundary from '../components/common/ErrorBoundary'
import StatCard from '../components/dashboard/StatCard'
import UpcomingPayments from '../components/dashboard/UpcomingPayments'
import PropertyCard from '../components/dashboard/PropertyCard'
import AlertCard from '../components/dashboard/AlertCard'

const Dashboard: React.FC = () => {
  // Mock data for development
  const mockProperties = [
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
    }
  ]

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="page-header">
            Welcome to Manyani Dashboard
          </h1>
          <p className="page-description">
            Here's what's happening with your properties and rentals today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Properties"
            value={2}
            change="+12%"
            icon={Home}
            color="brown"
            href="/properties"
          />
          <StatCard
            title="Active Bookings"
            value={3}
            change="+3"
            icon={Calendar}
            color="green"
            href="/bookings"
          />
          <StatCard
            title="Total Payments"
            value={`KES ${(125000).toLocaleString()}`}
            change="+18%"
            icon={CreditCard}
            color="maroon"
            href="/payments"
          />
          <StatCard
            title="Pending Alerts"
            value={2}
            change="+2"
            icon={AlertCircle}
            color="yellow"
            href="/alerts"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Properties */}
          <div className="lg:col-span-2 space-y-6">
            {/* Properties section */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Your Properties</h2>
                <a
                  href="/properties"
                  className="text-manyani-brown hover:text-manyani-brown/80 font-medium text-sm"
                >
                  View All →
                </a>
              </div>
              
              <ErrorBoundary fallback={
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Error Loading Properties
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    There was an issue loading the properties.
                  </p>
                </div>
              }>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProperties.slice(0, 2).map((property: any) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              </ErrorBoundary>

              {mockProperties.length === 0 && (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Properties Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start by adding your first property
                  </p>
                  <a
                    href="/properties"
                    className="btn-primary inline-flex items-center"
                  >
                    Add Property
                  </a>
                </div>
              )}
            </div>

            {/* Upcoming payments */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Upcoming Payments</h2>
                <a
                  href="/payments"
                  className="text-manyani-brown hover:text-manyani-brown/80 font-medium text-sm"
                >
                  View All →
                </a>
              </div>
              <ErrorBoundary>
                <UpcomingPayments />
              </ErrorBoundary>
            </div>
          </div>

          {/* Right column - Alerts & Activity */}
          <div className="space-y-6">
            {/* Recent alerts */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Recent Alerts</h2>
                <a
                  href="/alerts"
                  className="text-manyani-brown hover:text-manyani-brown/80 font-medium text-sm"
                >
                  View All →
                </a>
              </div>
              
              <ErrorBoundary>
                <div className="space-y-4">
                  <AlertCard
                    type="payment"
                    title="Rent Due Tomorrow"
                    description="Unit 3B rent payment of KES 25,000 is due tomorrow"
                    priority="high"
                    time="2 hours ago"
                  />
                  <AlertCard
                    type="utility"
                    title="Water Bill Due"
                    description="Water bill payment of KES 1,500 is due in 3 days"
                    priority="medium"
                    time="1 day ago"
                  />
                  <AlertCard
                    type="maintenance"
                    title="Maintenance Scheduled"
                    description="Plumbing maintenance scheduled for Friday"
                    priority="low"
                    time="2 days ago"
                  />
                </div>
              </ErrorBoundary>
            </div>

            {/* Quick actions */}
            <div className="card">
              <h2 className="section-title">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/bookings"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-manyani-brown/10 hover:bg-manyani-brown/20 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-manyani-brown mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    New Booking
                  </span>
                </a>
                <a
                  href="/payments"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-manyani-green/10 hover:bg-manyani-green/20 transition-colors"
                >
                  <CreditCard className="h-6 w-6 text-manyani-green mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Make Payment
                  </span>
                </a>
                <a
                  href="/maintenance"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-manyani-maroon/10 hover:bg-manyani-maroon/20 transition-colors"
                >
                  <Wrench className="h-6 w-6 text-manyani-maroon mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Report Issue
                  </span>
                </a>
                <a
                  href="/communications"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                >
                  <MessageSquare className="h-6 w-6 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Community Chat
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Dashboard

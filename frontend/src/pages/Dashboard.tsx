import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Home, 
  Users, 
  CreditCard, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Wrench,
  MessageSquare
} from 'lucide-react'
import { useAuthStore } from '../context/authStore'
import { propertyService } from '../services/propertyService'
import api from '../services/api'
import StatCard from '../components/dashboard/StatCard'
import RecentActivity from '../components/dashboard/RecentActivity'
import UpcomingPayments from '../components/dashboard/UpcomingPayments'
import PropertyCard from '../components/dashboard/PropertyCard'
import AlertCard from '../components/dashboard/AlertCard'

const Dashboard: React.FC = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    totalPayments: 0,
    pendingAlerts: 0,
  })

  // Fetch user stats
  const { data: userStats } = useQuery('userStats', async () => {
    const [bookingsRes, paymentsRes, alertsRes] = await Promise.all([
      api.get('/bookings/my-bookings'),
      api.get('/payments/my-payments'),
      api.get('/alerts/my-alerts'),
    ])
    
    const activeBookings = bookingsRes.data.filter(
      (b: any) => b.status === 'active' || b.status === 'deposit_paid'
    ).length
    
    const pendingAlerts = alertsRes.data.filter(
      (a: any) => a.status === 'sent' && !a.readBy?.find((r: any) => r.userId === user?.id)
    ).length

    return {
      activeBookings,
      totalPayments: paymentsRes.data.length,
      pendingAlerts,
    }
  })

  // Fetch properties for the user
  const { data: properties } = useQuery('properties', () =>
    propertyService.getAll({ limit: 3 })
  )

  // Recent activity
  const recentActivity = [
    { id: 1, type: 'payment', message: 'Rent payment received for Unit 4B', time: '2 hours ago', amount: 25000 },
    { id: 2, type: 'maintenance', message: 'Maintenance request submitted', time: '5 hours ago', unit: 'Unit 2A' },
    { id: 3, type: 'alert', message: 'Water bill due in 3 days', time: '1 day ago', priority: 'high' },
    { id: 4, type: 'booking', message: 'New booking request received', time: '2 days ago', unit: 'Studio 1' },
  ]

  return (
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
          value={stats.totalProperties}
          change="+12%"
          icon={Home}
          color="brown"
          href="/properties"
        />
        <StatCard
          title="Active Bookings"
          value={userStats?.activeBookings || 0}
          change="+3"
          icon={Calendar}
          color="green"
          href="/bookings"
        />
        <StatCard
          title="Total Payments"
          value={`KES ${((userStats?.totalPayments || 0) * 25000).toLocaleString()}`}
          change="+18%"
          icon={CreditCard}
          color="maroon"
          href="/payments"
        />
        <StatCard
          title="Pending Alerts"
          value={userStats?.pendingAlerts || 0}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties?.data?.slice(0, 2).map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {(!properties || properties.data?.length === 0) && (
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
            <UpcomingPayments />
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
  )
}

export default Dashboard

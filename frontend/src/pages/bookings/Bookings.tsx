import React, { useState } from 'react'
import { 
  Plus, 
  Filter, 
  Download, 
  Search, 
  Calendar, 
  User, 
  Building2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  DollarSign 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Bookings: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const bookings = [
    {
      id: 'BK-2024-001',
      propertyName: 'Manyani Apartments Unit 5A',
      tenantName: 'John Doe',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      monthlyRent: 45000,
      deposit: 90000,
      balance: 0,
      nextPayment: '2024-02-01'
    },
    {
      id: 'BK-2024-002',
      propertyName: 'Manyani Villas Unit 3B',
      tenantName: 'Jane Smith',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      status: 'active',
      monthlyRent: 55000,
      deposit: 110000,
      balance: 25000,
      nextPayment: '2024-02-01'
    },
    {
      id: 'BK-2024-003',
      propertyName: 'Manyani Gardens Unit 7C',
      tenantName: 'Robert Johnson',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'pending',
      monthlyRent: 38000,
      deposit: 76000,
      balance: 76000,
      nextPayment: '2024-03-01'
    },
    {
      id: 'BK-2024-004',
      propertyName: 'Manyani Heights Unit 2D',
      tenantName: 'Sarah Williams',
      startDate: '2023-11-01',
      endDate: '2024-10-31',
      status: 'completed',
      monthlyRent: 42000,
      deposit: 84000,
      balance: 0,
      nextPayment: 'N/A'
    },
    {
      id: 'BK-2024-005',
      propertyName: 'Manyani View Unit 8E',
      tenantName: 'Michael Brown',
      startDate: '2024-01-15',
      endDate: '2024-12-14',
      status: 'cancelled',
      monthlyRent: 50000,
      deposit: 0,
      balance: 0,
      nextPayment: 'N/A'
    }
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'completed': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 mr-1" />
      case 'pending': return <AlertCircle className="h-4 w-4 mr-1" />
      case 'cancelled': return <XCircle className="h-4 w-4 mr-1" />
      default: return <CheckCircle className="h-4 w-4 mr-1" />
    }
  }

  const handleNewBooking = () => {
    navigate('/features')
    toast.success('Opening New Booking form')
  }

  const handleExport = () => {
    toast.success('Exporting bookings data...')
  }

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Bookings Management</h1>
          <p className="page-description">
            Manage all rental bookings, leases, and tenant agreements in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 mr-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 mr-4">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">KES 1.2M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search bookings by ID, tenant, or property..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={handleExport}
                className="btn-outline flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={handleNewBooking}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Property & Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px 6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Financials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-gray-900 dark:text-white">
                        {booking.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.propertyName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {booking.tenantName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(booking.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            to {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-manyani-brown">
                          KES {booking.monthlyRent.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Balance: KES {booking.balance.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            navigate('/features')
                            toast.success(`Opening update for ${booking.id}`)
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            navigate('/features')
                            toast.success(`Quick pay for ${booking.id}`)
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => toast.success(`Viewing details for ${booking.id}`)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  No bookings found matching your criteria
                </div>
                <button
                  onClick={handleNewBooking}
                  className="btn-primary"
                >
                  Create Your First Booking
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Total Monthly Revenue: <span className="text-manyani-brown">KES 1,200,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bookings

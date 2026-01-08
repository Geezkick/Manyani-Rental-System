import React, { useState } from 'react'
import { Search, Calendar, User, Mail, Phone, DollarSign, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface UpdateBookingFormProps {
  onSuccess?: () => void
}

interface Booking {
  id: string
  propertyName: string
  tenantName: string
  tenantEmail: string
  tenantPhone: string
  startDate: string
  endDate: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
  monthlyRent: number
  deposit: number
  balance: number
  notes?: string
}

const UpdateBookingForm: React.FC<UpdateBookingFormProps> = ({ onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  
  const [formData, setFormData] = useState({
    propertyName: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    startDate: '',
    endDate: '',
    status: 'active' as const,
    monthlyRent: '',
    deposit: '',
    balance: '',
    notes: ''
  })

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: 'BK-2024-001',
      propertyName: 'Manyani Apartments Unit 5A',
      tenantName: 'John Doe',
      tenantEmail: 'john@example.com',
      tenantPhone: '+254 712 345678',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      monthlyRent: 45000,
      deposit: 90000,
      balance: 0,
      notes: 'Good tenant, pays on time'
    },
    {
      id: 'BK-2024-002',
      propertyName: 'Manyani Villas Unit 3B',
      tenantName: 'Jane Smith',
      tenantEmail: 'jane@example.com',
      tenantPhone: '+254 723 456789',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      status: 'active',
      monthlyRent: 55000,
      deposit: 110000,
      balance: 25000,
      notes: 'One month behind on payment'
    },
    {
      id: 'BK-2024-003',
      propertyName: 'Manyani Gardens Unit 7C',
      tenantName: 'Robert Johnson',
      tenantEmail: 'robert@example.com',
      tenantPhone: '+254 734 567890',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'pending',
      monthlyRent: 38000,
      deposit: 76000,
      balance: 76000,
      notes: 'Deposit pending'
    }
  ]

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a booking ID to search')
      return
    }

    setSearching(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const booking = mockBookings.find(b => 
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      if (booking) {
        setSelectedBooking(booking)
        setFormData({
          propertyName: booking.propertyName,
          tenantName: booking.tenantName,
          tenantEmail: booking.tenantEmail,
          tenantPhone: booking.tenantPhone,
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status,
          monthlyRent: booking.monthlyRent.toString(),
          deposit: booking.deposit.toString(),
          balance: booking.balance.toString(),
          notes: booking.notes || ''
        })
        toast.success(`Found booking: ${booking.id}`)
      } else {
        toast.error('No booking found with that ID or name')
      }
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBooking) {
      toast.error('Please select a booking first')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Booking ${selectedBooking.id} updated successfully!`)
      
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error('Failed to update booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Find Booking to Update
        </h3>
        
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10"
                placeholder="Search by Booking ID, Tenant Name, or Property..."
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="btn-primary px-6"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Recent bookings list */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Bookings
          </h4>
          <div className="space-y-3">
            {mockBookings.map((booking) => (
              <div
                key={booking.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedBooking?.id === booking.id
                    ? 'border-manyani-brown bg-gradient-to-r from-manyani-cream to-white dark:from-gray-700 dark:to-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedBooking(booking)
                  setFormData({
                    propertyName: booking.propertyName,
                    tenantName: booking.tenantName,
                    tenantEmail: booking.tenantEmail,
                    tenantPhone: booking.tenantPhone,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    status: booking.status,
                    monthlyRent: booking.monthlyRent.toString(),
                    deposit: booking.deposit.toString(),
                    balance: booking.balance.toString(),
                    notes: booking.notes || ''
                  })
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="font-bold text-gray-900 dark:text-white mr-3">
                        {booking.id}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.propertyName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.tenantName} • {booking.tenantPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-manyani-brown text-lg">
                      KES {booking.monthlyRent.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      per month
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Form */}
      {selectedBooking && (
        <form onSubmit={handleSubmit} className="card space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Update Booking: {selectedBooking.id}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Modify booking details and status
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-medium flex items-center ${getStatusColor(formData.status)}`}>
              {getStatusIcon(formData.status)}
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Name
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                className="input-field"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Tenant Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tenant Name
              </label>
              <input
                type="text"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tenant Email
              </label>
              <input
                type="email"
                name="tenantEmail"
                value={formData.tenantEmail}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tenant Phone
              </label>
              <input
                type="tel"
                name="tenantPhone"
                value={formData.tenantPhone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Financial Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Rent (KES)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  className="input-field pl-14"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deposit Paid (KES)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="input-field pl-14"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Balance (KES)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  className="input-field pl-14"
                  min="0"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Update notes about this booking..."
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="btn-outline px-8"
            >
              Select Different Booking
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default UpdateBookingForm

import React, { useState } from 'react'
import QuickPayForm from '../components/forms/QuickPayForm'
import BookingForm from '../components/forms/BookingForm'
import UpdateBookingForm from '../components/forms/UpdateBookingForm'
import { Zap, CalendarPlus, CalendarCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quick-pay')

  const handleQuickPaySuccess = () => {
    toast.success('Payment processed successfully!')
  }

  const handleBookingSuccess = () => {
    toast.success('Booking created successfully!')
  }

  const handleUpdateSuccess = () => {
    toast.success('Booking updated successfully!')
  }

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-manyani-brown to-manyani-maroon mr-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Quick Features
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Fast access to essential rental management tools
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Feature cards */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div 
                className={`card cursor-pointer transition-all hover:scale-[1.02] ${activeTab === 'quick-pay' ? 'ring-2 ring-manyani-brown bg-gradient-to-r from-white to-manyani-cream dark:from-gray-800 dark:to-gray-700' : ''}`}
                onClick={() => setActiveTab('quick-pay')}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Quick Pay
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Process payments instantly
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`card cursor-pointer transition-all hover:scale-[1.02] ${activeTab === 'new-booking' ? 'ring-2 ring-manyani-brown bg-gradient-to-r from-white to-manyani-cream dark:from-gray-800 dark:to-gray-700' : ''}`}
                onClick={() => setActiveTab('new-booking')}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                    <CalendarPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      New Booking
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create rental agreements
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`card cursor-pointer transition-all hover:scale-[1.02] ${activeTab === 'update-booking' ? 'ring-2 ring-manyani-brown bg-gradient-to-r from-white to-manyani-cream dark:from-gray-800 dark:to-gray-700' : ''}`}
                onClick={() => setActiveTab('update-booking')}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 mr-4">
                    <CalendarCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Update Booking
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Modify existing bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats or quick info */}
            <div className="card mt-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Bookings</span>
                  <span className="font-bold text-manyani-brown">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Pending Payments</span>
                  <span className="font-bold text-manyani-maroon">KES 450,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Properties</span>
                  <span className="font-bold text-manyani-green">15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Active feature form */}
          <div className="lg:col-span-2">
            <div className="card">
              {activeTab === 'quick-pay' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 mr-4">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quick Pay
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Process payments instantly via M-Pesa, card, or bank transfer
                      </p>
                    </div>
                  </div>
                  <QuickPayForm onSuccess={handleQuickPaySuccess} />
                </div>
              )}

              {activeTab === 'new-booking' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                      <CalendarPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        New Booking
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Create a new rental booking agreement
                      </p>
                    </div>
                  </div>
                  <BookingForm onSuccess={handleBookingSuccess} />
                </div>
              )}

              {activeTab === 'update-booking' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 mr-4">
                      <CalendarCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Update Booking
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Modify existing booking details and status
                      </p>
                    </div>
                  </div>
                  <UpdateBookingForm onSuccess={handleUpdateSuccess} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features

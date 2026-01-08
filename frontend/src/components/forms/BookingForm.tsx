import React, { useState } from 'react'
import { Building2, Calendar, User, Mail, Phone, DollarSign, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface BookingFormProps {
  onSuccess?: () => void
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    propertyId: '',
    propertyName: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    tenantIdNumber: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    deposit: '',
    commission: '',
    notes: '',
    termsAccepted: false
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate required fields
      const requiredFields = ['propertyName', 'tenantName', 'tenantEmail', 'tenantPhone', 'startDate', 'endDate', 'monthlyRent']
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
          setLoading(false)
          return
        }
      }

      if (!formData.termsAccepted) {
        toast.error('Please accept the terms and conditions')
        setLoading(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Booking created successfully!')
      
      if (onSuccess) onSuccess()
      
      // Reset form
      setFormData({
        propertyId: '',
        propertyName: '',
        tenantName: '',
        tenantEmail: '',
        tenantPhone: '',
        tenantIdNumber: '',
        startDate: '',
        endDate: '',
        monthlyRent: '',
        deposit: '',
        commission: '',
        notes: '',
        termsAccepted: false
      })
    } catch (error) {
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculateDeposit = () => {
    const rent = parseFloat(formData.monthlyRent) || 0
    return (rent * 2).toLocaleString()
  }

  const calculateCommission = () => {
    const rent = parseFloat(formData.monthlyRent) || 0
    return (rent * 0.5).toLocaleString() // 50% of first month
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-manyani-brown" />
            Property Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Manyani Apartments Unit 5A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property ID
              </label>
              <input
                type="text"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., PROP-001"
              />
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-manyani-brown" />
            Tenant Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tenant Name *
              </label>
              <input
                type="text"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID Number/Passport
              </label>
              <input
                type="text"
                name="tenantIdNumber"
                value={formData.tenantIdNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="National ID or Passport"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="tenantEmail"
                  value={formData.tenantEmail}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="tenant@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="tenantPhone"
                  value={formData.tenantPhone}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Dates */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-manyani-brown" />
            Booking Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-manyani-brown" />
            Financial Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly Rent (KES) *
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
                  required
                  className="input-field pl-14"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deposit (KES)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit || calculateDeposit()}
                  onChange={handleChange}
                  className="input-field pl-14"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 2 months rent ({calculateDeposit()})
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commission (KES)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  name="commission"
                  value={formData.commission || calculateCommission()}
                  onChange={handleChange}
                  className="input-field pl-14"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 50% of first month ({calculateCommission()})
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-manyani-brown" />
            Additional Notes
          </h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Any additional notes or special conditions..."
          />
        </div>

        {/* Terms */}
        <div className="md:col-span-2">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="h-4 w-4 text-manyani-brown rounded mt-1 mr-3"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-700 dark:text-gray-300">
              I confirm that all information provided is accurate and I agree to the rental terms and conditions. 
              I understand that a deposit is required to secure this booking.
            </label>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => {
            setFormData({
              propertyId: '',
              propertyName: '',
              tenantName: '',
              tenantEmail: '',
              tenantPhone: '',
              tenantIdNumber: '',
              startDate: '',
              endDate: '',
              monthlyRent: '',
              deposit: '',
              commission: '',
              notes: '',
              termsAccepted: false
            })
          }}
          className="btn-outline px-8"
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8"
        >
          {loading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </div>
    </form>
  )
}

export default BookingForm

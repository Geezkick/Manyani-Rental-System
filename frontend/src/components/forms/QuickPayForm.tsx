import React, { useState } from 'react'
import { CreditCard, Smartphone, Building } from 'lucide-react'
import toast from 'react-hot-toast'

interface QuickPayFormProps {
  onSuccess?: () => void
}

const QuickPayForm: React.FC<QuickPayFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    bookingId: '',
    tenantName: '',
    amount: '',
    paymentMethod: 'mpesa',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    description: 'Rent Payment'
  })
  const [loading, setLoading] = useState(false)

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'text-green-600' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, color: 'text-blue-600' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, color: 'text-purple-600' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (!formData.amount || !formData.paymentMethod) {
        toast.error('Please fill in all required fields')
        return
      }
      setStep(2)
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Payment of KES ${parseInt(formData.amount).toLocaleString()} processed successfully!`)
      
      if (onSuccess) onSuccess()
      
      // Reset form
      setFormData({
        bookingId: '',
        tenantName: '',
        amount: '',
        paymentMethod: 'mpesa',
        phoneNumber: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        description: 'Rent Payment'
      })
      setStep(1)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Booking/Invoice ID
              </label>
              <input
                type="text"
                name="bookingId"
                value={formData.bookingId}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., BK-2024-001"
              />
            </div>

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
                placeholder="Enter tenant name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (KES) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="input-field pl-14"
                  placeholder="0.00"
                  min="1"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-manyani-brown bg-gradient-to-r from-manyani-cream to-white dark:from-gray-700 dark:to-gray-800'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Icon className={`h-8 w-8 mb-2 ${method.color}`} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Payment description"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary px-8"
            >
              Continue to Payment Details →
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  Payment Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  You're about to process a payment
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-manyani-brown">
                  KES {parseInt(formData.amount || '0').toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  via {formData.paymentMethod}
                </div>
              </div>
            </div>
          </div>

          {formData.paymentMethod === 'mpesa' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  M-Pesa Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +254
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="input-field pl-16"
                    placeholder="7XX XXX XXX"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter the M-Pesa registered phone number. You will receive a payment prompt.
                </p>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'card' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'bank' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Bank Transfer Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bank:</span>
                    <span className="font-medium">Equity Bank Kenya</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
                    <span className="font-medium">Manyani Premium Rentals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                    <span className="font-medium">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Swift Code:</span>
                    <span className="font-medium">EQBLKENA</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction Reference *
                </label>
                <input
                  type="text"
                  name="transactionRef"
                  className="input-field"
                  placeholder="Enter your bank transaction reference"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-outline px-8"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? 'Processing...' : `Pay KES ${parseInt(formData.amount || '0').toLocaleString()}`}
            </button>
          </div>
        </>
      )}
    </form>
  )
}

export default QuickPayForm

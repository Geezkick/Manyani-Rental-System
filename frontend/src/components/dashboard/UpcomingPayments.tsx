import React from 'react'
import { Calendar, CreditCard, AlertCircle } from 'lucide-react'

const UpcomingPayments: React.FC = () => {
  const payments = [
    {
      id: 1,
      description: 'December Rent',
      amount: 35000,
      dueDate: '2024-12-05',
      status: 'pending',
      property: 'Green Valley Apartment - Unit 4B'
    },
    {
      id: 2,
      description: 'Water Bill',
      amount: 1500,
      dueDate: '2024-12-10',
      status: 'pending',
      property: 'Green Valley Apartment'
    },
    {
      id: 3,
      description: 'Electricity Bill',
      amount: 3000,
      dueDate: '2024-12-12',
      status: 'pending',
      property: 'Green Valley Apartment'
    },
    {
      id: 4,
      description: 'Maintenance Fee',
      amount: 2000,
      dueDate: '2024-12-15',
      status: 'pending',
      property: 'Green Valley Apartment'
    }
  ]

  return (
    <div className="space-y-4">
      {payments.map((payment) => {
        const daysUntilDue = Math.ceil(
          (new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
        
        return (
          <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${
                daysUntilDue <= 3 
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : daysUntilDue <= 7
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                  : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }`}>
                {daysUntilDue <= 3 ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{payment.description}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{payment.property}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                KES {payment.amount.toLocaleString()}
              </div>
              <button className="mt-2 text-sm text-manyani-brown hover:text-manyani-brown/80 font-medium">
                Pay Now
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default UpcomingPayments

import React from 'react'
import { Activity, CreditCard, Wrench, Bell, CheckCircle } from 'lucide-react'

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'payment',
      message: 'Rent payment received for Unit 4B',
      time: '2 hours ago',
      amount: 35000,
      status: 'success'
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'Maintenance request submitted',
      time: '5 hours ago',
      unit: 'Unit 2A',
      status: 'pending'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Water bill due in 3 days',
      time: '1 day ago',
      priority: 'high',
      status: 'unread'
    },
    {
      id: 4,
      type: 'booking',
      message: 'New booking request received',
      time: '2 days ago',
      unit: 'Studio 1',
      status: 'pending'
    },
    {
      id: 5,
      type: 'payment',
      message: 'Security deposit refund processed',
      time: '3 days ago',
      amount: 70000,
      status: 'success'
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-4 w-4" />
      case 'maintenance': return <Wrench className="h-4 w-4" />
      case 'alert': return <Bell className="h-4 w-4" />
      case 'booking': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400'
      case 'pending': return 'text-yellow-600 dark:text-yellow-400'
      case 'unread': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
            {getIcon(activity.type)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status.toUpperCase()}
                  </span>
                  {activity.amount && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      KES {activity.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity

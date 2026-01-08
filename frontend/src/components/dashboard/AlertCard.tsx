import React from 'react'
import { AlertCircle, Bell, Wrench, Droplets, Zap, Trash2, Shield } from 'lucide-react'

interface AlertCardProps {
  type: 'payment' | 'utility' | 'maintenance' | 'security' | 'announcement'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  time: string
}

const AlertCard: React.FC<AlertCardProps> = ({ type, title, description, priority, time }) => {
  const getIcon = () => {
    switch (type) {
      case 'payment': return <Bell className="h-5 w-5" />
      case 'utility': 
        if (title.includes('Water')) return <Droplets className="h-5 w-5" />
        if (title.includes('Electricity')) return <Zap className="h-5 w-5" />
        return <Bell className="h-5 w-5" />
      case 'maintenance': return <Wrench className="h-5 w-5" />
      case 'security': return <Shield className="h-5 w-5" />
      default: return <AlertCircle className="h-5 w-5" />
    }
  }

  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
      case 'low': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    }
  }

  return (
    <div className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
      <div className={`p-2 rounded-lg mr-4 ${getPriorityColor()}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity">
            <Trash2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor()}`}>
            {priority.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  )
}

export default AlertCard

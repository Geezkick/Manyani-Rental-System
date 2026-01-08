import React from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StatCardProps {
  title: string
  value: string | number
  change: string
  icon: LucideIcon
  color: 'brown' | 'green' | 'maroon' | 'yellow' | 'blue' | 'purple'
  href?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  href = '#',
}) => {
  const colorClasses = {
    brown: 'bg-manyani-brown/10 text-manyani-brown border-manyani-brown/20',
    green: 'bg-manyani-green/10 text-manyani-green border-manyani-green/20',
    maroon: 'bg-manyani-maroon/10 text-manyani-maroon border-manyani-maroon/20',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  }

  const isPositive = change.startsWith('+')

  return (
    <Link
      to={href}
      className="stat-card group hover:border-manyani-brown/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        
        <div
          className={`p-3 rounded-xl border ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">View details</span>
          <span className="text-manyani-brown group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default StatCard

import React, { useState } from 'react'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Filter, 
  Search, 
  Download,
  Users,
  Building2,
  Wrench,
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  Archive
} from 'lucide-react'
import toast from 'react-hot-toast'

const Alerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const alerts = [
    {
      id: 'ALT-001',
      title: 'Maintenance Required',
      description: 'Water leakage reported in Unit 5A bathroom',
      type: 'maintenance',
      priority: 'high',
      status: 'pending',
      property: 'Manyani Apartments Unit 5A',
      tenant: 'John Doe',
      date: '2024-02-08',
      time: '10:30 AM',
      community: true,
      affectedUnits: ['5A', '5B']
    },
    {
      id: 'ALT-002',
      title: 'Payment Overdue',
      description: 'Rent payment for February is overdue by 5 days',
      type: 'payment',
      priority: 'high',
      status: 'active',
      property: 'Manyani Villas Unit 3B',
      tenant: 'Jane Smith',
      date: '2024-02-07',
      time: '2:15 PM',
      community: false,
      amount: 25000
    },
    {
      id: 'ALT-003',
      title: 'Community Meeting',
      description: 'Monthly residents meeting scheduled for next week',
      type: 'community',
      priority: 'medium',
      status: 'upcoming',
      property: 'Manyani Gardens',
      date: '2024-02-15',
      time: '6:00 PM',
      community: true,
      location: 'Community Hall'
    },
    {
      id: 'ALT-004',
      title: 'Security Alert',
      description: 'Gate access system maintenance scheduled',
      type: 'security',
      priority: 'medium',
      status: 'resolved',
      property: 'Manyani Heights',
      date: '2024-02-05',
      time: '9:00 AM',
      community: true,
      resolvedBy: 'Security Team'
    },
    {
      id: 'ALT-005',
      title: 'Utility Bill Update',
      description: 'Water bills for January are now available',
      type: 'utility',
      priority: 'low',
      status: 'active',
      property: 'All Properties',
      date: '2024-02-06',
      time: '11:45 AM',
      community: true,
      deadline: '2024-02-20'
    },
    {
      id: 'ALT-006',
      title: 'Contract Expiring Soon',
      description: 'Lease agreement ending in 30 days',
      type: 'contract',
      priority: 'medium',
      status: 'pending',
      property: 'Manyani View Unit 8E',
      tenant: 'Michael Brown',
      date: '2024-02-10',
      time: '3:30 PM',
      community: false,
      expiryDate: '2024-03-10'
    }
  ]

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.property.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || alert.type === typeFilter
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'community': return <Users className="h-4 w-4" />
      case 'security': return <AlertTriangle className="h-4 w-4" />
      case 'utility': return <Bell className="h-4 w-4" />
      case 'contract': return <Calendar className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'text-orange-600'
      case 'payment': return 'text-green-600'
      case 'community': return 'text-blue-600'
      case 'security': return 'text-red-600'
      case 'utility': return 'text-purple-600'
      case 'contract': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Bell className="h-4 w-4 text-yellow-600" />
      case 'pending': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'upcoming': return <Calendar className="h-4 w-4 text-blue-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    pending: alerts.filter(a => a.status === 'pending').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    community: alerts.filter(a => a.community).length,
    highPriority: alerts.filter(a => a.priority === 'high').length
  }

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Alerts & Notifications</h1>
          <p className="page-description">
            Stay updated with community alerts, maintenance issues, and payment reminders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 mr-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 mr-4">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Community</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.community}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 mr-4">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
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
                  placeholder="Search alerts by title, property, or description..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Types</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="payment">Payment</option>
                  <option value="community">Community</option>
                  <option value="security">Security</option>
                  <option value="utility">Utility</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <button
                onClick={() => toast.success('Exporting alerts data...')}
                className="btn-outline flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={() => toast.success('Creating new alert...')}
                className="btn-primary flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" />
                New Alert
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Community Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                Community Alerts
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {alerts.filter(a => a.community).length} alerts
              </span>
            </div>

            <div className="space-y-4">
              {alerts
                .filter(alert => alert.community)
                .map((alert) => (
                  <div key={alert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getTypeColor(alert.type)} bg-opacity-10 mr-3`}>
                          {getTypeIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{alert.title}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                              {alert.priority} priority
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {alert.date} • {alert.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusIcon(alert.status)}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Building2 className="h-3 w-3 mr-1" />
                        {alert.property}
                        {alert.affectedUnits && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                            Affects: {alert.affectedUnits.join(', ')}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toast.success(`Marking ${alert.title} as read`)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast.success(`Archiving ${alert.title}`)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Personal Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                <Bell className="h-5 w-5 text-yellow-600 mr-2" />
                Personal Alerts
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {alerts.filter(a => !a.community).length} alerts
              </span>
            </div>

            <div className="space-y-4">
              {alerts
                .filter(alert => !alert.community)
                .map((alert) => (
                  <div key={alert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getTypeColor(alert.type)} bg-opacity-10 mr-3`}>
                          {getTypeIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{alert.title}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                              {alert.priority} priority
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {alert.tenant}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusIcon(alert.status)}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {alert.description}
                    </p>

                    {alert.type === 'payment' && (
                      <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Overdue Amount:</span>
                          <span className="font-bold text-red-600">KES {alert.amount?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {alert.type === 'contract' && (
                      <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Contract Expires:</span>
                          <span className="font-bold text-yellow-600">{new Date(alert.expiryDate || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Building2 className="h-3 w-3 mr-1" />
                        {alert.property}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toast.success(`Taking action on ${alert.title}`)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          Take Action
                        </button>
                        <button
                          onClick={() => toast.success(`Snoozing ${alert.title}`)}
                          className="btn-outline text-sm px-3 py-1"
                        >
                          Snooze
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Alert Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Alert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {alert.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-1 rounded ${getTypeColor(alert.type)} bg-opacity-10 mr-2`}>
                          {getTypeIcon(alert.type)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize mr-3">
                          {alert.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {alert.property}
                        </span>
                      </div>
                      {alert.tenant && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Tenant: {alert.tenant}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {alert.date}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {alert.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(alert.status)}
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {alert.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toast.success(`Viewing details for ${alert.title}`)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                        {alert.status === 'pending' && (
                          <button
                            onClick={() => toast.success(`Resolving ${alert.title}`)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => toast.success(`Dismissing ${alert.title}`)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts

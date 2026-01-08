import React, { useState } from 'react'
import { 
  Wrench, 
  Home, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  MessageSquare,
  User,
  Building2,
  MapPin,
  FileText,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const Maintenance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const maintenanceRequests = [
    {
      id: 'MT-001',
      title: 'Leaking Kitchen Faucet',
      description: 'Water leaking from kitchen faucet, getting worse each day',
      property: 'Manyani Apartments Unit 5A',
      tenant: 'John Doe',
      category: 'Plumbing',
      priority: 'high',
      status: 'pending',
      date: '2024-02-08',
      estimatedCost: 5000,
      actualCost: 0,
      duration: '2 hours',
      assignedTo: 'James Plumbing',
      tenantRating: null,
      photos: 2,
      notes: 'Needs immediate attention'
    },
    {
      id: 'MT-002',
      title: 'Broken AC Unit',
      description: 'Air conditioning not cooling properly in living room',
      property: 'Manyani Villas Unit 3B',
      tenant: 'Jane Smith',
      category: 'HVAC',
      priority: 'high',
      status: 'in_progress',
      date: '2024-02-07',
      estimatedCost: 15000,
      actualCost: 0,
      duration: '1 day',
      assignedTo: 'CoolTech Services',
      tenantRating: null,
      photos: 1,
      notes: 'Waiting for parts delivery'
    },
    {
      id: 'MT-003',
      title: 'Electrical Outlets Not Working',
      description: 'Three electrical outlets in bedroom not functioning',
      property: 'Manyani Gardens Unit 7C',
      tenant: 'Robert Johnson',
      category: 'Electrical',
      priority: 'medium',
      status: 'scheduled',
      date: '2024-02-10',
      estimatedCost: 8000,
      actualCost: 0,
      duration: '4 hours',
      assignedTo: 'Spark Electric',
      tenantRating: null,
      photos: 0,
      notes: 'Scheduled for next week'
    },
    {
      id: 'MT-004',
      title: 'Paint Touch Up',
      description: 'Wall paint peeling in hallway, needs touch up',
      property: 'Manyani Heights Unit 2D',
      tenant: 'Sarah Williams',
      category: 'Painting',
      priority: 'low',
      status: 'completed',
      date: '2024-02-05',
      estimatedCost: 3000,
      actualCost: 3200,
      duration: '3 hours',
      assignedTo: 'Paint Masters',
      tenantRating: 5,
      photos: 3,
      notes: 'Completed successfully'
    },
    {
      id: 'MT-005',
      title: 'Garage Door Repair',
      description: 'Garage door opener not working properly',
      property: 'Manyani View Unit 8E',
      tenant: 'Michael Brown',
      category: 'General',
      priority: 'medium',
      status: 'completed',
      date: '2024-02-03',
      estimatedCost: 12000,
      actualCost: 11500,
      duration: '6 hours',
      assignedTo: 'Door Experts',
      tenantRating: 4,
      photos: 2,
      notes: 'Customer satisfied with work'
    }
  ]

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.property.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: maintenanceRequests.length,
    pending: maintenanceRequests.filter(r => r.status === 'pending').length,
    inProgress: maintenanceRequests.filter(r => r.status === 'in_progress').length,
    completed: maintenanceRequests.filter(r => r.status === 'completed').length,
    highPriority: maintenanceRequests.filter(r => r.priority === 'high').length,
    totalCost: maintenanceRequests.reduce((sum, r) => sum + r.estimatedCost, 0),
    actualCost: maintenanceRequests.reduce((sum, r) => sum + r.actualCost, 0)
  }

  const vendors = [
    { name: 'James Plumbing', category: 'Plumbing', rating: 4.8, jobs: 45, responseTime: '2 hours' },
    { name: 'CoolTech Services', category: 'HVAC', rating: 4.5, jobs: 32, responseTime: '4 hours' },
    { name: 'Spark Electric', category: 'Electrical', rating: 4.9, jobs: 58, responseTime: '3 hours' },
    { name: 'Paint Masters', category: 'Painting', rating: 4.3, jobs: 27, responseTime: '1 day' },
    { name: 'Door Experts', category: 'General', rating: 4.6, jobs: 41, responseTime: '6 hours' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'in_progress': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      case 'scheduled': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in_progress': return <Wrench className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <AlertTriangle className="h-4 w-4" />
      case 'low': return <AlertTriangle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Maintenance Management</h1>
          <p className="page-description">
            Track, assign, and manage maintenance requests across all properties.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 mr-4">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 mr-4">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  KES {stats.totalCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">6.2 hrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Maintenance Request
                </button>
                <button className="w-full btn-outline flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message All Vendors
                </button>
                <button className="w-full btn-outline flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Maintenance Log
                </button>
              </div>
            </div>

            {/* Vendor Performance */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Vendors</h3>
              <div className="space-y-4">
                {vendors.map((vendor, index) => (
                  <div key={vendor.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                          <Wrench className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{vendor.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{vendor.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="font-medium">{vendor.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{vendor.jobs} jobs</span>
                      <span>Response: {vendor.responseTime}</span>
                    </div>
                    {index === 0 && (
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <Award className="h-3 w-3 mr-1" />
                        Top Performer this month
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Maintenance Requests */}
          <div className="lg:col-span-2">
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
                      placeholder="Search maintenance requests..."
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
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Requests List */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Maintenance Requests</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredRequests.length} requests
                </span>
              </div>

              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 transition">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{request.title}</h4>
                          <div className="flex space-x-2 ml-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getPriorityColor(request.priority)}`}>
                              {getPriorityIcon(request.priority)}
                              {request.priority} priority
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {request.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Building2 className="h-3 w-3 mr-1" />
                          {request.property}
                          <span className="mx-2">•</span>
                          <User className="h-3 w-3 mr-1" />
                          {request.tenant}
                          <span className="mx-2">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          {request.date}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-manyani-brown text-lg">
                          KES {request.estimatedCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          estimated
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Assigned To</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tenant Rating</p>
                        <div className="flex items-center">
                          {request.tenantRating ? (
                            <>
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="font-medium text-gray-900 dark:text-white">{request.tenantRating}/5</span>
                            </>
                          ) : (
                            <span className="text-gray-400">Not rated</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        {request.photos > 0 && (
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {request.photos} photos
                          </span>
                        )}
                        {request.notes && (
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Has notes
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toast.success(`Viewing details for ${request.title}`)}
                          className="btn-outline text-sm px-3 py-1"
                        >
                          View Details
                        </button>
                        {request.status !== 'completed' && (
                          <button
                            onClick={() => toast.success(`Updating status for ${request.title}`)}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Update Status
                          </button>
                        )}
                        <button
                          onClick={() => toast.success(`Contacting ${request.assignedTo}`)}
                          className="btn-outline text-sm px-3 py-1"
                        >
                          Contact Vendor
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    No maintenance requests found
                  </div>
                  <button
                    onClick={() => toast.success('Creating new maintenance request')}
                    className="btn-primary"
                  >
                    Create First Request
                  </button>
                </div>
              )}
            </div>

            {/* Maintenance Summary */}
            <div className="card mt-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Maintenance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">6.2 hours</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">94%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">4.6/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Maintenance

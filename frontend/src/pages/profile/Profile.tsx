import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  DollarSign, 
  Shield, 
  Edit, 
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Building2,
  MapPin,
  FileText,
  Plus,
  Download
} from 'lucide-react'
import { useAuthStore } from '../../context/authStore'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
    idNumber: user?.idNumber || ''
  })

  // Mock user properties data
  const userProperties = [
    {
      id: 'PROP-001',
      name: 'Manyani Apartments Unit 5A',
      type: 'Apartment',
      location: 'Nairobi, Westlands',
      monthlyRent: 45000,
      deposit: 90000,
      balance: 0,
      status: 'fully_paid',
      nextPayment: '2024-03-01',
      contractStart: '2024-01-01',
      contractEnd: '2024-12-31',
      maintenanceIssues: 0,
      maintenanceCost: 0
    },
    {
      id: 'PROP-002',
      name: 'Manyani Villas Unit 3B',
      type: 'Villa',
      location: 'Nairobi, Karen',
      monthlyRent: 85000,
      deposit: 170000,
      balance: 25000,
      status: 'partial_balance',
      nextPayment: '2024-02-15',
      contractStart: '2024-01-15',
      contractEnd: '2024-12-14',
      maintenanceIssues: 2,
      maintenanceCost: 15000
    }
  ]

  const financialSummary = {
    totalMonthlyRent: userProperties.reduce((sum, prop) => sum + prop.monthlyRent, 0),
    totalDeposit: userProperties.reduce((sum, prop) => sum + prop.deposit, 0),
    totalBalance: userProperties.reduce((sum, prop) => sum + prop.balance, 0),
    totalMaintenanceCost: userProperties.reduce((sum, prop) => sum + prop.maintenanceCost, 0),
    propertiesCount: userProperties.length,
    activeContracts: userProperties.filter(p => p.status !== 'cancelled').length,
    maintenanceRequests: userProperties.reduce((sum, prop) => sum + prop.maintenanceIssues, 0)
  }

  const handleSave = () => {
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_paid': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'partial_balance': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'overdue': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fully_paid': return <CheckCircle className="h-4 w-4 mr-1" />
      case 'partial_balance': return <AlertCircle className="h-4 w-4 mr-1" />
      case 'overdue': return <XCircle className="h-4 w-4 mr-1" />
      default: return <CheckCircle className="h-4 w-4 mr-1" />
    }
  }

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-header">User Profile</h1>
              <p className="page-description">
                Manage your profile, view properties, and track financial information.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="btn-outline flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
              <button className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.firstName}
                      className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-manyani-brown to-manyani-maroon flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                      <span className="text-white text-4xl font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 p-2 bg-manyani-brown text-white rounded-full hover:bg-manyani-maroon transition">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="flex items-center mt-1">
                  <Shield className="h-4 w-4 text-manyani-brown mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {user?.role || 'Tenant'}
                  </span>
                </div>

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-outline flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button className="btn-primary">
                    Upgrade Plan
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Properties</span>
                    <span className="font-bold text-manyani-brown">{financialSummary.propertiesCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Active Contracts</span>
                    <span className="font-bold text-manyani-green">{financialSummary.activeContracts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Rent</span>
                    <span className="font-bold text-manyani-maroon">KES {financialSummary.totalMonthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Current Balance</span>
                    <span className="font-bold text-manyani-brown">KES {financialSummary.totalBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Deposit</span>
                    <span className="font-bold text-manyani-green">KES {financialSummary.totalDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Maintenance Cost</span>
                    <span className="font-bold text-manyani-maroon">KES {financialSummary.totalMaintenanceCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card mt-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.phone || '+254 7XX XXX XXX'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.address || 'Nairobi, Kenya'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Properties and Details */}
          <div className="lg:col-span-2">
            {/* Financial Summary */}
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Total</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        KES {financialSummary.totalMonthlyRent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposit</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        KES {financialSummary.totalDeposit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        KES {financialSummary.totalBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        KES {financialSummary.totalMaintenanceCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Your Properties</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {financialSummary.propertiesCount} Properties • {financialSummary.activeContracts} Active
                </span>
              </div>

              <div className="space-y-4">
                {userProperties.map((property) => (
                  <div key={property.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-manyani-brown transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <Building2 className="h-5 w-5 text-manyani-brown mr-2" />
                          <h4 className="font-bold text-gray-900 dark:text-white">{property.name}</h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(property.status)}`}>
                            {getStatusIcon(property.status)}
                            {property.status === 'fully_paid' ? 'Paid in Full' : 
                             property.status === 'partial_balance' ? 'Has Balance' : 'Payment Overdue'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                          <span className="mx-2">•</span>
                          <Home className="h-3 w-3 mr-1" />
                          {property.type}
                          <span className="mx-2">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          Contract: {new Date(property.contractStart).toLocaleDateString()} - {new Date(property.contractEnd).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-manyani-brown text-lg">
                          KES {property.monthlyRent.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">monthly rent</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Deposit Paid</p>
                        <p className="font-medium text-green-600">
                          KES {property.deposit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current Balance</p>
                        <p className={`font-medium ${property.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          KES {property.balance.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Next Payment Due</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(property.nextPayment).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Maintenance Issues</p>
                        <div className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {property.maintenanceIssues} issues • KES {property.maintenanceCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => toast.success(`Viewing details for ${property.name}`)}
                        className="btn-outline text-sm px-3 py-1"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => toast.success(`Making payment for ${property.name}`)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Make Payment
                      </button>
                      <button 
                        onClick={() => toast.success(`Reporting maintenance for ${property.name}`)}
                        className="btn-outline text-sm px-3 py-1"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment History */}
            <div className="card">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Payment History</h3>
              <div className="space-y-3">
                {[
                  { id: 'PY-001', property: 'Manyani Apartments Unit 5A', date: '2024-02-01', amount: 45000, status: 'completed' },
                  { id: 'PY-002', property: 'Manyani Villas Unit 3B', date: '2024-01-15', amount: 60000, status: 'completed' },
                  { id: 'PY-003', property: 'Manyani Villas Unit 3B', date: '2024-01-01', amount: 85000, status: 'completed' },
                  { id: 'PY-004', property: 'Manyani Apartments Unit 5A', date: '2024-01-01', amount: 45000, status: 'completed' }
                ].map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{payment.property}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Payment ID: {payment.id} • {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">KES {payment.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{payment.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

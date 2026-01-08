import React, { useState } from 'react'
import { 
  Plus, 
  Filter, 
  Download, 
  Search, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Zap, 
  DollarSign 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Payments: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  const payments = [
    {
      id: 'PY-2024-001',
      bookingId: 'BK-2024-001',
      tenantName: 'John Doe',
      propertyName: 'Manyani Apartments Unit 5A',
      amount: 45000,
      date: '2024-01-01',
      method: 'mpesa',
      status: 'completed',
      transactionId: 'MPE234567890'
    },
    {
      id: 'PY-2024-002',
      bookingId: 'BK-2024-002',
      tenantName: 'Jane Smith',
      propertyName: 'Manyani Villas Unit 3B',
      amount: 55000,
      date: '2024-01-02',
      method: 'bank',
      status: 'completed',
      transactionId: 'BNK234567891'
    },
    {
      id: 'PY-2024-003',
      bookingId: 'BK-2024-003',
      tenantName: 'Robert Johnson',
      propertyName: 'Manyani Gardens Unit 7C',
      amount: 38000,
      date: '2024-01-03',
      method: 'card',
      status: 'pending',
      transactionId: 'CRD234567892'
    },
    {
      id: 'PY-2024-004',
      bookingId: 'BK-2024-004',
      tenantName: 'Sarah Williams',
      propertyName: 'Manyani Heights Unit 2D',
      amount: 42000,
      date: '2024-01-04',
      method: 'cash',
      status: 'completed',
      transactionId: 'CSH234567893'
    },
    {
      id: 'PY-2024-005',
      bookingId: 'BK-2024-001',
      tenantName: 'John Doe',
      propertyName: 'Manyani Apartments Unit 5A',
      amount: 45000,
      date: '2024-02-01',
      method: 'mpesa',
      status: 'failed',
      transactionId: 'MPE234567894'
    }
  ]

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'failed': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 mr-1" />
      case 'pending': return <AlertCircle className="h-4 w-4 mr-1" />
      case 'failed': return <XCircle className="h-4 w-4 mr-1" />
      default: return <CheckCircle className="h-4 w-4 mr-1" />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa': return <Smartphone className="h-4 w-4 mr-1" />
      case 'card': return <CreditCard className="h-4 w-4 mr-1" />
      case 'bank': return <Building className="h-4 w-4 mr-1" />
      case 'cash': return <DollarSign className="h-4 w-4 mr-1" />
      default: return <CreditCard className="h-4 w-4 mr-1" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'mpesa': return 'text-green-600'
      case 'card': return 'text-blue-600'
      case 'bank': return 'text-purple-600'
      case 'cash': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const handleQuickPay = () => {
    navigate('/features')
    toast.success('Opening Quick Pay')
  }

  const handleExport = () => {
    toast.success('Exporting payments data...')
  }

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Payments Management</h1>
          <p className="page-description">
            Track, process, and manage all rental payments and transactions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  KES {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 mr-4">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  KES {pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  KES 225,000
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 mr-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {payments.length}
                </p>
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
                  placeholder="Search payments by ID, tenant, or property..."
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
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Methods</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <button
                onClick={handleExport}
                className="btn-outline flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={handleQuickPay}
                className="btn-primary flex items-center"
              >
                <Zap className="h-4 w-4 mr-2" />
                Quick Pay
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Booking & Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-gray-900 dark:text-white">
                        {payment.id}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {payment.bookingId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {payment.propertyName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.tenantName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className={`flex items-center ${getMethodColor(payment.method)}`}>
                          {getMethodIcon(payment.method)}
                          <span className="text-xs capitalize">{payment.method}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-manyani-brown text-lg">
                        KES {payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                        {payment.transactionId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toast.success(`Viewing receipt for ${payment.id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Receipt
                        </button>
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => toast.success(`Confirming payment ${payment.id}`)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => toast.success(`Sending reminder for ${payment.id}`)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          Remind
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  No payments found matching your criteria
                </div>
                <button
                  onClick={handleQuickPay}
                  className="btn-primary"
                >
                  Process First Payment
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredPayments.length} of {payments.length} payments
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Total Completed: <span className="text-manyani-brown">KES {totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Payment Methods Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">M-Pesa</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">60%</div>
                  <div className="text-xs text-gray-500">KES 135,000</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Card</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">25%</div>
                  <div className="text-xs text-gray-500">KES 56,250</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Bank</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">10%</div>
                  <div className="text-xs text-gray-500">KES 22,500</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Cash</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">5%</div>
                  <div className="text-xs text-gray-500">KES 11,250</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card md:col-span-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Payment Received
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Jane Smith - KES 55,000 via M-Pesa
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Payment Pending
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Robert Johnson - KES 38,000 via Card
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">1 day ago</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Payment Scheduled
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      John Doe - KES 45,000 due tomorrow
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payments

import React, { useState } from 'react'
import { 
  MessageSquare, 
  Send, 
  Users, 
  Building2, 
  Calendar, 
  Paperclip, 
  Search, 
  Filter,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Reply,
  Forward,
  Archive,
  Bell,
  Mail,
  Phone,
  Video,
  UserPlus,
  Lock,
  Globe,
  Hash,
  Pin
} from 'lucide-react'
import toast from 'react-hot-toast'

const Communications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('messages')
  const [newMessage, setNewMessage] = useState('')

  const communications = [
    {
      id: 'MSG-001',
      sender: 'John Doe',
      senderRole: 'Tenant',
      receiver: 'Property Manager',
      subject: 'Maintenance Request - Leaking Faucet',
      message: 'Hello, there is a leaking faucet in the kitchen of Unit 5A. Could you please send someone to fix it?',
      type: 'maintenance',
      priority: 'medium',
      status: 'unread',
      timestamp: '2024-02-08 10:30 AM',
      property: 'Manyani Apartments Unit 5A',
      attachments: 2,
      community: false
    },
    {
      id: 'MSG-002',
      sender: 'Community Manager',
      senderRole: 'Manager',
      receiver: 'All Residents',
      subject: 'Community Meeting Announcement',
      message: 'Monthly community meeting scheduled for Friday at 6 PM in the community hall. All residents are encouraged to attend.',
      type: 'community',
      priority: 'low',
      status: 'read',
      timestamp: '2024-02-07 2:15 PM',
      property: 'Manyani Gardens',
      attachments: 1,
      community: true
    },
    {
      id: 'MSG-003',
      sender: 'Jane Smith',
      senderRole: 'Tenant',
      receiver: 'Accounts Department',
      subject: 'Payment Confirmation',
      message: 'I have made the February rent payment via M-Pesa. Transaction ID: MPE234567890',
      type: 'payment',
      priority: 'high',
      status: 'read',
      timestamp: '2024-02-07 11:45 AM',
      property: 'Manyani Villas Unit 3B',
      attachments: 0,
      community: false
    },
    {
      id: 'MSG-004',
      sender: 'Security Team',
      senderRole: 'Security',
      receiver: 'All Residents',
      subject: 'Security Advisory',
      message: 'Please ensure all gates are properly closed after use. Report any suspicious activity immediately.',
      type: 'security',
      priority: 'high',
      status: 'unread',
      timestamp: '2024-02-06 9:00 AM',
      property: 'Manyani Heights',
      attachments: 0,
      community: true
    },
    {
      id: 'MSG-005',
      sender: 'Robert Johnson',
      senderRole: 'Tenant',
      receiver: 'Maintenance Team',
      subject: 'Electrical Issue',
      message: 'There seems to be an electrical issue in Unit 7C. Lights flickering and some sockets not working.',
      type: 'maintenance',
      priority: 'high',
      status: 'unread',
      timestamp: '2024-02-05 3:30 PM',
      property: 'Manyani Gardens Unit 7C',
      attachments: 1,
      community: false
    }
  ]

  const communityChannels = [
    {
      id: 'CH-001',
      name: 'General Announcements',
      description: 'Official announcements from management',
      members: 45,
      unread: 3,
      type: 'announcement',
      lastActivity: '2 hours ago',
      pinned: true
    },
    {
      id: 'CH-002',
      name: 'Maintenance Reports',
      description: 'Report and discuss maintenance issues',
      members: 32,
      unread: 5,
      type: 'maintenance',
      lastActivity: '1 hour ago',
      pinned: true
    },
    {
      id: 'CH-003',
      name: 'Security Updates',
      description: 'Security alerts and updates',
      members: 45,
      unread: 0,
      type: 'security',
      lastActivity: '1 day ago',
      pinned: false
    },
    {
      id: 'CH-004',
      name: 'Social Events',
      description: 'Community events and gatherings',
      members: 28,
      unread: 12,
      type: 'social',
      lastActivity: 'Just now',
      pinned: false
    },
    {
      id: 'CH-005',
      name: 'Marketplace',
      description: 'Buy, sell, and exchange items',
      members: 35,
      unread: 7,
      type: 'marketplace',
      lastActivity: '30 minutes ago',
      pinned: false
    }
  ]

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = 
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.sender.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || comm.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const stats = {
    total: communications.length,
    unread: communications.filter(c => c.status === 'unread').length,
    community: communications.filter(c => c.community).length,
    personal: communications.filter(c => !c.community).length,
    highPriority: communications.filter(c => c.priority === 'high').length
  }

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
      case 'security': return <Bell className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'text-orange-600'
      case 'payment': return 'text-green-600'
      case 'community': return 'text-blue-600'
      case 'security': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Bell className="h-4 w-4" />
      case 'maintenance': return <Wrench className="h-4 w-4" />
      case 'security': return <Lock className="h-4 w-4" />
      case 'social': return <Users className="h-4 w-4" />
      case 'marketplace': return <DollarSign className="h-4 w-4" />
      default: return <Hash className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-manyani-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-header">Communications</h1>
          <p className="page-description">
            Communicate with tenants, management, and the community.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 mr-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 mr-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Personal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.personal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                  {stats.unread > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                      {stats.unread}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'channels'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Community Channels
                </div>
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'broadcast'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Broadcast
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'messages' && (
          <>
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
                      placeholder="Search messages..."
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
                    </select>
                  </div>

                  <button
                    onClick={() => toast.success('Exporting communications...')}
                    className="btn-outline flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>

                  <button
                    onClick={() => toast.success('Starting new conversation...')}
                    className="btn-primary flex items-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Message
                  </button>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages Sidebar */}
              <div className="lg:col-span-1">
                <div className="card">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Conversations</h3>
                  <div className="space-y-3">
                    {filteredCommunications.map((comm) => (
                      <div
                        key={comm.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                          comm.status === 'unread'
                            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => toast.success(`Opening conversation: ${comm.subject}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`p-1 rounded ${getTypeColor(comm.type)} bg-opacity-10 mr-2`}>
                              {getTypeIcon(comm.type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {comm.sender}
                              </h4>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {comm.senderRole}
                              </div>
                            </div>
                          </div>
                          {comm.status === 'unread' && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 truncate">
                          {comm.subject}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Building2 className="h-3 w-3 mr-1" />
                            {comm.property}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(comm.priority)}`}>
                            {comm.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          Maintenance Request - Leaking Faucet
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-3 w-3 mr-1" />
                            John Doe (Tenant) → Property Manager
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            Feb 8, 2024 • 10:30 AM
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor('medium')}`}>
                        Medium Priority
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        Hello, there is a leaking faucet in the kitchen of Unit 5A. 
                        It has been leaking for two days now and is getting worse. 
                        Could you please send someone to fix it as soon as possible?
                      </p>
                      <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <Building2 className="h-3 w-3 mr-1" />
                        Manyani Apartments Unit 5A
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Attachments</h4>
                      <div className="flex space-x-3">
                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">faucet_photo.jpg</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">2.4 MB</div>
                        </div>
                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">video_clip.mp4</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">15.2 MB</div>
                        </div>
                      </div>
                    </div>

                    {/* Reply Area */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Reply to Message</h4>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="input-field mb-3"
                        rows={4}
                        placeholder="Type your reply here..."
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Paperclip className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setNewMessage('')
                              toast.success('Message sent successfully!')
                            }}
                            className="btn-primary flex items-center"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </button>
                          <button className="btn-outline">
                            Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'channels' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Community Channels</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Join community discussions and stay connected
                </p>
              </div>
              <button className="btn-primary flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Channel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityChannels.map((channel) => (
                <div key={channel.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${channel.pinned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800'} mr-3`}>
                        {getChannelIcon(channel.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                          {channel.name}
                          {channel.pinned && <Pin className="h-3 w-3 text-yellow-600 ml-2" />}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    {channel.unread > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {channel.unread} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {channel.members} members
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Last: {channel.lastActivity}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => toast.success(`Joining ${channel.name}`)}
                      className="btn-primary flex-1 text-sm py-2"
                    >
                      Join Channel
                    </button>
                    <button
                      onClick={() => toast.success(`Viewing ${channel.name}`)}
                      className="btn-outline text-sm py-2"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="card">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Broadcast Message</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send announcements to all residents or specific groups
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipients
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['All Residents', 'Property Owners', 'Tenants', 'Security Team', 'Maintenance Team'].map((group) => (
                    <span key={group} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                      {group}
                    </span>
                  ))}
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm flex items-center">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add more recipients
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  className="input-field"
                  rows={6}
                  placeholder="Type your broadcast message here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="flex space-x-4">
                  {[
                    { label: 'Normal', value: 'low', color: 'bg-blue-100 text-blue-600' },
                    { label: 'Important', value: 'medium', color: 'bg-yellow-100 text-yellow-600' },
                    { label: 'Urgent', value: 'high', color: 'bg-red-100 text-red-600' }
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      className={`px-4 py-2 rounded-lg ${priority.color}`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button className="btn-outline">
                    Save as Draft
                  </button>
                  <button
                    onClick={() => toast.success('Broadcast message sent to 45 recipients!')}
                    className="btn-primary flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Broadcast
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Communications

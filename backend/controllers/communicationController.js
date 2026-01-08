const Communication = require('../models/Communication')
const { ErrorResponse, asyncHandler } = require('../middleware/error')

// @desc    Get all threads
// @route   GET /api/communications
// @access  Private
exports.getAllThreads = asyncHandler(async (req, res) => {
  const threads = await Communication.find({
    'participants.user': req.user.id,
    isArchived: false
  })
  .populate('participants.user', 'firstName lastName profilePicture')
  .populate('building', 'name')
  .sort('-lastActivity')
  
  res.json({
    success: true,
    count: threads.length,
    data: threads
  })
})

// @desc    Get single thread
// @route   GET /api/communications/:id
// @access  Private
exports.getThreadById = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
    .populate('participants.user', 'firstName lastName profilePicture role')
    .populate('building', 'name address')
    .populate('messages.sender', 'firstName lastName profilePicture')
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is a participant
  if (!thread.participants.some(p => p.user._id.toString() === req.user.id)) {
    throw new ErrorResponse('Not authorized to access this thread', 403)
  }
  
  res.json({
    success: true,
    data: thread
  })
})

// @desc    Create thread
// @route   POST /api/communications
// @access  Private
exports.createThread = asyncHandler(async (req, res) => {
  // Add creator as first participant
  req.body.participants = [
    {
      user: req.user.id,
      role: 'admin'
    },
    ...(req.body.participants || [])
  ]
  
  const thread = await Communication.create(req.body)
  
  res.status(201).json({
    success: true,
    data: thread
  })
})

// @desc    Update thread
// @route   PUT /api/communications/:id
// @access  Private
exports.updateThread = asyncHandler(async (req, res) => {
  let thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is an admin or moderator in the thread
  const participant = thread.participants.find(
    p => p.user.toString() === req.user.id
  )
  
  if (!participant || (participant.role !== 'admin' && participant.role !== 'moderator')) {
    throw new ErrorResponse('Not authorized to update this thread', 403)
  }
  
  thread = await Communication.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  
  res.json({
    success: true,
    data: thread
  })
})

// @desc    Delete thread
// @route   DELETE /api/communications/:id
// @access  Private
exports.deleteThread = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is an admin in the thread
  const participant = thread.participants.find(
    p => p.user.toString() === req.user.id && p.role === 'admin'
  )
  
  if (!participant && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized to delete this thread', 403)
  }
  
  // Soft delete - mark as archived
  thread.isArchived = true
  await thread.save()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Get building threads
// @route   GET /api/communications/building/:buildingId
// @access  Private
exports.getBuildingThreads = asyncHandler(async (req, res) => {
  const threads = await Communication.find({
    building: req.params.buildingId,
    isArchived: false
  })
  .populate('participants.user', 'firstName lastName profilePicture')
  .sort('-lastActivity')
  
  res.json({
    success: true,
    count: threads.length,
    data: threads
  })
})

// @desc    Get user threads
// @route   GET /api/communications/my-threads
// @access  Private
exports.getUserThreads = asyncHandler(async (req, res) => {
  const threads = await Communication.find({
    'participants.user': req.user.id,
    isArchived: false
  })
  .populate('participants.user', 'firstName lastName profilePicture')
  .populate('building', 'name')
  .sort('-lastActivity')
  
  res.json({
    success: true,
    count: threads.length,
    data: threads
  })
})

// @desc    Send message
// @route   POST /api/communications/:id/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is a participant
  if (!thread.participants.some(p => p.user.toString() === req.user.id)) {
    throw new ErrorResponse('Not authorized to send messages in this thread', 403)
  }
  
  // Check if user is muted
  const participant = thread.participants.find(
    p => p.user.toString() === req.user.id
  )
  
  if (participant?.isMuted) {
    throw new ErrorResponse('You are muted in this thread', 403)
  }
  
  const message = {
    sender: req.user.id,
    content: req.body.content,
    attachments: req.body.attachments || []
  }
  
  thread.messages.push(message)
  thread.lastActivity = new Date()
  await thread.save()
  
  // Populate sender info for response
  await thread.populate('messages.sender', 'firstName lastName profilePicture')
  
  const newMessage = thread.messages[thread.messages.length - 1]
  
  // TODO: Emit socket event for real-time messaging
  
  res.status(201).json({
    success: true,
    data: newMessage
  })
})

// @desc    Edit message
// @route   PUT /api/communications/:id/messages/:messageId
// @access  Private
exports.editMessage = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  const message = thread.messages.id(req.params.messageId)
  
  if (!message) {
    throw new ErrorResponse('Message not found', 404)
  }
  
  // Check if user is the message sender
  if (message.sender.toString() !== req.user.id) {
    throw new ErrorResponse('Not authorized to edit this message', 403)
  }
  
  message.content = req.body.content
  message.isEdited = true
  message.editedAt = new Date()
  
  await thread.save()
  
  res.json({
    success: true,
    data: message
  })
})

// @desc    Delete message
// @route   DELETE /api/communications/:id/messages/:messageId
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  const message = thread.messages.id(req.params.messageId)
  
  if (!message) {
    throw new ErrorResponse('Message not found', 404)
  }
  
  // Check if user is the message sender or an admin/moderator
  const participant = thread.participants.find(
    p => p.user.toString() === req.user.id
  )
  
  const canDelete = 
    message.sender.toString() === req.user.id ||
    participant?.role === 'admin' ||
    participant?.role === 'moderator'
  
  if (!canDelete) {
    throw new ErrorResponse('Not authorized to delete this message', 403)
  }
  
  message.isDeleted = true
  message.deletedAt = new Date()
  message.content = '[Message deleted]'
  
  await thread.save()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Mark thread as read
// @route   PUT /api/communications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is a participant
  if (!thread.participants.some(p => p.user.toString() === req.user.id)) {
    throw new ErrorResponse('Not authorized to mark this thread as read', 403)
  }
  
  await thread.markAsRead(req.user.id)
  
  res.json({
    success: true,
    message: 'Thread marked as read'
  })
})

// @desc    Add participant
// @route   POST /api/communications/:id/participants
// @access  Private
exports.addParticipant = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is an admin or moderator in the thread
  const participant = thread.participants.find(
    p => p.user.toString() === req.user.id
  )
  
  if (!participant || (participant.role !== 'admin' && participant.role !== 'moderator')) {
    throw new ErrorResponse('Not authorized to add participants', 403)
  }
  
  // Check if user is already a participant
  if (thread.participants.some(p => p.user.toString() === req.body.userId)) {
    throw new ErrorResponse('User is already a participant', 400)
  }
  
  thread.participants.push({
    user: req.body.userId,
    role: req.body.role || 'member'
  })
  
  await thread.save()
  
  res.status(201).json({
    success: true,
    data: thread.participants[thread.participants.length - 1]
  })
})

// @desc    Remove participant
// @route   DELETE /api/communications/:id/participants/:userId
// @access  Private
exports.removeParticipant = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is an admin in the thread
  const requester = thread.participants.find(
    p => p.user.toString() === req.user.id
  )
  
  if (!requester || requester.role !== 'admin') {
    throw new ErrorResponse('Not authorized to remove participants', 403)
  }
  
  // Cannot remove self if you're the only admin
  if (req.params.userId === req.user.id) {
    const adminCount = thread.participants.filter(p => p.role === 'admin').length
    if (adminCount <= 1) {
      throw new ErrorResponse('Cannot remove the only admin from the thread', 400)
    }
  }
  
  thread.participants = thread.participants.filter(
    p => p.user.toString() !== req.params.userId
  )
  
  await thread.save()
  
  res.json({
    success: true,
    data: {}
  })
})

// @desc    Report thread
// @route   POST /api/communications/:id/report
// @access  Private
exports.reportThread = asyncHandler(async (req, res) => {
  const thread = await Communication.findById(req.params.id)
  
  if (!thread) {
    throw new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
  }
  
  // Check if user is a participant
  if (!thread.participants.some(p => p.user.toString() === req.user.id)) {
    throw new ErrorResponse('Not authorized to report this thread', 403)
  }
  
  thread.isReported = true
  thread.reports.push({
    reporter: req.user.id,
    reason: req.body.reason,
    description: req.body.description,
    reportedAt: new Date()
  })
  
  await thread.save()
  
  res.json({
    success: true,
    message: 'Thread reported successfully'
  })
})

// @desc    Get unread count
// @route   GET /api/communications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const threads = await Communication.find({
    'participants.user': req.user.id,
    isArchived: false
  })
  
  let totalUnread = 0
  threads.forEach(thread => {
    totalUnread += thread.getUnreadCount(req.user.id)
  })
  
  res.json({
    success: true,
    data: {
      totalUnread
    }
  })
})

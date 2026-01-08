const express = require('express');
const router = express.Router();
const {
  getAllThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
  getBuildingThreads,
  getUserThreads,
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead,
  addParticipant,
  removeParticipant,
  reportThread,
  getUnreadCount
} = require('../controllers/communicationController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get threads
router.get('/', getAllThreads);
router.get('/my-threads', getUserThreads);
router.get('/building/:buildingId', getBuildingThreads);
router.get('/unread-count', getUnreadCount);
router.get('/:id', getThreadById);

// Thread actions
router.post('/', createThread);
router.put('/:id', updateThread);
router.delete('/:id', deleteThread);

// Message actions
router.post('/:id/messages', sendMessage);
router.put('/:id/messages/:messageId', editMessage);
router.delete('/:id/messages/:messageId', deleteMessage);

// Participant actions
router.post('/:id/participants', addParticipant);
router.delete('/:id/participants/:userId', removeParticipant);

// User actions
router.put('/:id/read', markAsRead);
router.post('/:id/report', reportThread);

module.exports = router;

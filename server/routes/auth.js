const express = require('express');
const {
  createUser,
  getCurrentUser,
  updateUser,
  login,
  logOut,
  deleteCurrentUser,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', createUser);
router.put('/', protect, updateUser);
router.get('/current', protect, getCurrentUser);
router.post('/login', login);
router.post('/logout', logOut);
router.delete('/', protect, deleteCurrentUser);

module.exports = router;

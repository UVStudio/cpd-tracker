const express = require('express');
const {
  createUser,
  getCurrentUser,
  updateProfile,
  login,
  logOut,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', createUser);
router.put('/', protect, updateProfile);
router.get('/current', protect, getCurrentUser);
router.post('/login', login);
router.post('/logout', logOut);

module.exports = router;

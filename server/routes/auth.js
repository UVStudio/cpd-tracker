const express = require('express');
const {
  createUser,
  getCurrentUser,
  login,
  logOut,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', createUser);
router.get('/current', protect, getCurrentUser);
router.post('/login', login);
router.post('/logout', logOut);

module.exports = router;

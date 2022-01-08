const express = require('express');
const {
  createUser,
  getCurrentUser,
  updateUser,
  updatePassword,
  login,
  logOut,
  deleteCurrentUser,
  forgotPassword,
  verificationCode,
  resetPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', createUser);
router.put('/', protect, updateUser);
router.get('/', protect, getCurrentUser);
router.post('/forgotpassword', forgotPassword);
router.post('/forgotpassword/:vericode', verificationCode);
router.put('/forgotpassword/:vericode', resetPassword);
router.put('/password', protect, updatePassword);
router.post('/login', login);
router.post('/logout', logOut);
router.delete('/', protect, deleteCurrentUser);

module.exports = router;

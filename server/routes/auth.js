const express = require('express');
const {
  createUser,
  getCurrentUser,
  updateUser,
  updatePassword,
  login,
  logOut,
  deleteCurrentUser,
  generateVeriCode,
  verificationCode,
  resetPassword,
  activateAccount,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', createUser);
router.put('/', protect, updateUser);
router.get('/', protect, getCurrentUser);
router.post('/generateVeriCode', generateVeriCode);
router.post('/generateVeriCode/:vericode', verificationCode);
router.put('/generateVeriCode/:vericode', resetPassword);
router.post('/generateVeriCode/activate/:vericode', activateAccount);
router.put('/password', protect, updatePassword);
router.post('/login', login);
router.post('/logout', logOut);
router.delete('/', protect, deleteCurrentUser);

module.exports = router;

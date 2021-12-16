const express = require('express');
const {
  getUserById,
  addUserField,
  removeUserField,
  getCertsByUserIdAndYear,
  getNonVerByUserIdAndYear,
  deleteUserById,
  getUsersCount,
  getReportByUserIdYear,
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/user/:id', protect, authorize('admin'), getUserById);
router.put('/user/:id', protect, authorize('admin'), addUserField);
router.put('/user/remove/:id', protect, authorize('admin'), removeUserField);
router.get('/user', protect, authorize('admin'), getUsersCount);
router.get(
  '/user/certs/:id/:year',
  protect,
  authorize('admin'),
  getCertsByUserIdAndYear
);
router.get(
  '/user/nonver/:id/:year',
  protect,
  authorize('admin'),
  getNonVerByUserIdAndYear
);
router.delete('/:id', protect, authorize('admin'), deleteUserById);
router.get(
  '/user/report/:id/:year',
  protect,
  authorize('admin'),
  getReportByUserIdYear
);

module.exports = router;

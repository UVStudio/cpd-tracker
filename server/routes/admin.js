const express = require('express');
const {
  getUserById,
  getCertsByUserIdAndYear,
  getNonVerByUserIdAndYear,
  deleteUserById,
  getReportByUserIdYear,
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/user/:id', protect, authorize('admin'), getUserById);
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

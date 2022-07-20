const express = require('express');
const {
  downloadObjectByKey,
  getUserById,
  addUserField,
  removeUserField,
  getCertsByUserIdAndYear,
  getNonVerByUserIdAndYear,
  deleteUserById,
  getUsersCount,
  getReportByUserIdYear,
  removeCertElementFromUserByCertId,
  sendMassEmails,
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/downloadobject', protect, authorize('admin'), downloadObjectByKey);
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
router.delete(
  '/user/remove/:id/:cert',
  protect,
  authorize('admin'),
  removeCertElementFromUserByCertId
);
router.post('/massemails', protect, authorize('admin'), sendMassEmails);

module.exports = router;

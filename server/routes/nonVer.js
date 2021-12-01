const express = require('express');
const {
  getNonVerObjById,
  addNonVerEvent,
  getAllNonVerObjsByUser,
  getAllNonVerObjsByYear,
  updateNonVerObjById,
  deleteNonVerObjById,
} = require('../controllers/nonVer');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, addNonVerEvent);
router.get('/', protect, getAllNonVerObjsByUser);
router.get('/:year', protect, getAllNonVerObjsByYear);
router.get('/id/:id', protect, getNonVerObjById);
router.put('/:id', protect, updateNonVerObjById);
router.delete('/:id', protect, deleteNonVerObjById);

module.exports = router;

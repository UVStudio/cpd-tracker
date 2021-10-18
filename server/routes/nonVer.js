const express = require('express');
const {
  getNonVerObjById,
  addNonVerEvent,
  getAllNonVerObjsByUser,
  deleteNonVerObjById,
} = require('../controllers/nonVer');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, addNonVerEvent);
router.get('/:id', getNonVerObjById);
router.get('/', protect, getAllNonVerObjsByUser);
router.delete('/:id', protect, deleteNonVerObjById);

module.exports = router;

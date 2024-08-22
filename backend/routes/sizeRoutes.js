const express = require('express');
const router = express.Router();
const { getAllSizes, getSizeById, addSize } = require('../controllers/sizeController');
const { uploadNone } = require('../config/multerConfig');


router.post('/', uploadNone ,addSize);
router.get('/', getAllSizes);
router.get('/:id', getSizeById);

module.exports = router;

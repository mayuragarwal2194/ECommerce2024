const express = require('express');
const router = express.Router();
const { uploadNone } = require('../config/multerConfig');

const {
  addTopCategory,
  getTopById,
  updateTopCategory,
  deleteTopCategory,
  getParentCategoriesByTopId,
  getTopCategoriesWithParentsAndChildren
} = require('../controllers/topCategoryController');

const { uploadMiddleware,handleMulterError } = require('../config/multerConfig');

router.post('/', uploadMiddleware,handleMulterError, addTopCategory);
router.put('/:id', uploadMiddleware,handleMulterError, updateTopCategory);
router.get('/', getTopCategoriesWithParentsAndChildren);
router.get('/:id', getTopById);
router.delete('/:id', deleteTopCategory);

// New route to get child categories by parent category ID
router.get('/:id/children', getParentCategoriesByTopId);


module.exports = router;

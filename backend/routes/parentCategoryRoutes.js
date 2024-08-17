const express = require('express');
const router = express.Router();
const {
  getAllParentCategories,
  getParentById,
  addParentCategory,
  updateParentCategory,
  deleteParentCategory,
  getChildCategoriesByParentId
} = require('../controllers/parentCategoryController');
const { uploadMiddleware,handleMulterError } = require('../config/multerConfig');

router.post('/',uploadMiddleware,handleMulterError, addParentCategory);
router.put('/:id',uploadMiddleware,handleMulterError, updateParentCategory);
router.get('/', getAllParentCategories);
router.get('/:id', getParentById);
router.delete('/:id', deleteParentCategory);

// New route to get child categories by parent category ID
router.get('/:id/children', getChildCategoriesByParentId);

module.exports = router;
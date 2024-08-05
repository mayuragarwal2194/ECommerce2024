const express = require('express');
const router = express.Router();
const { uploadNone } = require('../config/multerConfig');

const { getAllTopCategories, addTopCategory, getTopById, updateTopCategory, deleteTopCategory, getParentCategoriesByTopId, getTopCategoriesWithParentsAndChildren } = require('../controllers/topCategoryController');

router.post('/', uploadNone, addTopCategory);
router.put('/:id',uploadNone, updateTopCategory);
router.get('/', getTopCategoriesWithParentsAndChildren);
router.get('/:id', getTopById);
router.delete('/:id', deleteTopCategory);

// New route to get child categories by parent category ID
router.get('/:id/children', getParentCategoriesByTopId);


module.exports = router;

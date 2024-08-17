const express = require('express');
const router = express.Router();
const { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  deleteProduct, 
  updateProduct,
  getProductsByTopCategory,
  getProductsByParentCategory,
  getProductsByChildCategory
} = require('../controllers/productController');
const { uploadMiddleware,handleMulterError } = require('../config/multerConfig');

router.post('/add',uploadMiddleware,handleMulterError, addProduct);
router.get('/', getAllProducts);
router.get('/:_id', getProductById);
router.delete('/:id', deleteProduct);
router.put('/:_id',uploadMiddleware, handleMulterError, updateProduct);

// New route to get products by category
router.get('/category/:categoryId', getProductsByTopCategory);
router.get('/parentcat/:categoryId', getProductsByParentCategory);
router.get('/childcat/:categoryId', getProductsByChildCategory);

module.exports = router;
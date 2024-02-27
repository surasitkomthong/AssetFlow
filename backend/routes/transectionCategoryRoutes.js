const express = require('express');
const router = express.Router();
const transectionCategoryController = require('../controllers/transectionCategoryController');

// Routes for transection categories
router.get('/api/trans-categories', transectionCategoryController.getAllCategories);
router.get('/api/trans-category/:id', transectionCategoryController.getCategoryById);
router.post('/api/trans-categories', transectionCategoryController.createCategory);
router.put('/api/trans-category/:id', transectionCategoryController.updateCategory);
router.delete('/api/trans-category/:id', transectionCategoryController.deleteCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
const itemCategoryController = require('../controllers/itemCategoryController');

// Routes for item categories
router.get('/api/item-categories', itemCategoryController.getAllItemCategories);
router.get('/api/item-categorie/:id', itemCategoryController.getItemCategoryById);
router.post('/api/item-categories', itemCategoryController.createItemCategory);
router.put('/api/item-categorie/:id', itemCategoryController.updateItemCategory);
router.delete('/api/item-categorie/:id', itemCategoryController.deleteItemCategory);

module.exports = router;

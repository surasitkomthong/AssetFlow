const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// Routes for items
router.get('/api/items', itemsController.getAllItems);
router.get('/api/item/:id', itemsController.getItemById);
router.post('/api/items', itemsController.createItem);
router.put('/api/item/:id', itemsController.updateItem);
router.delete('/api/item/:id', itemsController.deleteItem);

module.exports = router;

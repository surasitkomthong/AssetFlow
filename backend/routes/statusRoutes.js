const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Routes for statuses
router.get('/api/statuses', statusController.getAllStatuses);
router.get('/api/status/:id', statusController.getStatusById);
router.post('/api/statuses', statusController.createStatus);
router.put('/api/status/:id', statusController.updateStatus);
router.delete('/api/status/:id', statusController.deleteStatus);

module.exports = router;

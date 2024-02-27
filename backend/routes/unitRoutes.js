const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/unitController');

// Routes for units
router.get('/api/units', unitsController.getAllUnits);
router.get('/api/unit/:id', unitsController.getUnitById);
router.post('/api/units', unitsController.createUnit);
router.put('/api/unit/:id', unitsController.updateUnit);
router.delete('/api/unit/:id', unitsController.deleteUnit);

module.exports = router;

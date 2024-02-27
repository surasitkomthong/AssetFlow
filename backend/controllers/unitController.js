const unitsModel = require("../models/unitModel");

const unitsController = {
  getAllUnits: (req, res) => {
    unitsModel
      .getAllUnits()
      .then((units) => {
        const totalCount = units.length;
        res.status(200).json({ data: units, totalCount: totalCount });
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  getUnitById: (req, res) => {
    const unitId = req.params.id;
    unitsModel
      .getUnitById(unitId)
      .then((unit) => {
        if (!unit) {
          return res.status(404).send("Unit not found");
        }
        res.status(200).json(unit);
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  createUnit: (req, res) => {
    const newUnit = req.body;
    unitsModel
      .createUnit(newUnit)
      .then((unit) => res.status(201).json(unit))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  updateUnit: (req, res) => {
    const unitId = req.params.id;
    const updatedUnit = req.body;
    unitsModel
      .updateUnit(unitId, updatedUnit)
      .then((unit) => res.status(200).json(unit))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  deleteUnit: (req, res) => {
    const unitId = req.params.id;
    unitsModel
      .deleteUnit(unitId)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },
};

module.exports = unitsController;

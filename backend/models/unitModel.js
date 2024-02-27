const { pool } = require("../db/db-config");

const unitsModel = {
  getAllUnits: async () => {
    try {
      const unitData = await pool.promise().query("SELECT * FROM units");

      const resultPromises = unitData[0].map(async (category) => {
        const queryResult = await pool.promise().query(`SELECT COUNT(*) AS count FROM items WHERE item_unit = '${category.unit_id}'`);
        const rowCount = queryResult[0][0].count;
        return { ...category, isReferenced: rowCount > 0 };
      });

      const categorizedItems = await Promise.all(resultPromises);
      return categorizedItems;
    } catch (error) {
      console.error("Error getting units:", error);
      throw error;
    }
  },
  

  getUnitById: (unitId) => {
    return pool
      .promise()
      .query("SELECT * FROM units WHERE unit_id = ?", [unitId])
      .then(([rows]) => rows[0])
      .catch((error) => {
        console.error("Error getting unit by ID:", error);
        throw error;
      });
  },

  createUnit: (newUnit) => {
    const { unit_name } = newUnit;
    return pool
      .promise()
      .query("INSERT INTO units (unit_name) VALUES (?)", [unit_name])
      .then((result) => ({ id: result.insertId, ...newUnit }))
      .catch((error) => {
        console.error("Error creating unit:", error);
        throw error;
      });
  },

  updateUnit: (unitId, updatedUnit) => {
    const { unit_name } = updatedUnit;
    return pool
      .promise()
      .query("UPDATE units SET unit_name = ? WHERE unit_id = ?", [
        unit_name,
        unitId,
      ])
      .then(() => ({ id: unitId, ...updatedUnit }))
      .catch((error) => {
        console.error("Error updating unit:", error);
        throw error;
      });
  },

  deleteUnit: (unitId) => {
    return pool
      .promise()
      .query("DELETE FROM units WHERE unit_id = ?", [unitId])
      .then(() => ({ id: unitId, message: "Unit deleted successfully" }))
      .catch((error) => {
        console.error("Error deleting unit:", error);
        throw error;
      });
  },
};

module.exports = unitsModel;

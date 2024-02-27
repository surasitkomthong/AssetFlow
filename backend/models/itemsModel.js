const { pool } = require("../db/db-config");

const itemsModel = {
  getAllItems: () => {
    return pool
      .promise()
      .query(
        `SELECT 
            items.item_id, 
            items.item_name, 
            items.item_cat, 
            item_category.item_cat_name, 
            items.item_unit, 
            units.unit_name, 
            items.item_total, 
            items.item_remain 
        FROM 
            items 
        JOIN 
            item_category ON items.item_cat = item_category.item_cat_id 
        JOIN 
            units ON items.item_unit = units.unit_id
        ORDER BY
            items.item_id`
      )
      .then(([rows]) => rows)
      .catch((error) => {
        console.error("Error getting items:", error);
        throw error;
      });
  },

  getItemById: (itemId) => {
    return pool
      .promise()
      .query(
        `SELECT 
            items.item_id, 
            items.item_name, 
            items.item_cat, 
            item_category.item_cat_name, 
            items.item_unit, 
            units.unit_name, 
            items.item_total, 
            items.item_remain 
        FROM 
            items 
        JOIN 
            item_category ON items.item_cat = item_category.item_cat_id 
        JOIN 
            units ON items.item_unit = units.unit_id 
        WHERE 
            items.item_id = ?`,
        [itemId]
      )
      .then(([rows]) => rows[0])
      .catch((error) => {
        console.error("Error getting item by ID:", error);
        throw error;
      });
  },

  createItem: (newItem) => {
    const { item_name, item_cat, item_unit, item_total, item_remain } = newItem;
    return pool
      .promise()
      .query(
        "INSERT INTO items (item_name, item_cat, item_unit, item_total, item_remain) VALUES (?, ?, ?, ?, ?)",
        [item_name, item_cat, item_unit, item_total, item_remain]
      )
      .then((result) => ({ id: result.insertId, ...newItem }))
      .catch((error) => {
        console.error("Error creating item:", error);
        throw error;
      });
  },

  updateItem: (itemId, updatedItem) => {
    const { item_name, item_cat, item_unit, item_total, item_remain } =
      updatedItem;
    return pool
      .promise()
      .query(
        "UPDATE items SET item_name = ?, item_cat = ?, item_unit = ?, item_total = ?, item_remain = ? WHERE item_id = ?",
        [item_name, item_cat, item_unit, item_total, item_remain, itemId]
      )
      .then(() => ({ id: itemId, ...updatedItem }))
      .catch((error) => {
        console.error("Error updating item:", error);
        throw error;
      });
  },

  deleteItem: (itemId) => {
    return pool
      .promise()
      .query("DELETE FROM items WHERE item_id = ?", [itemId])
      .then(() => ({ id: itemId, message: "Item deleted successfully" }))
      .catch((error) => {
        console.error("Error deleting item:", error);
        throw error;
      });
  },
};

module.exports = itemsModel;

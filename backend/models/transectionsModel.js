const { pool } = require("../db/db-config");

module.exports = {
  getAllTransections: () => {
    return pool
      .promise()
      .query(
        // "SELECT * FROM transections",
        `SELECT
            t.trans_id,
            i.item_id,
            i.item_name,
            ic.item_cat_name,
            t.qty,
            un.unit_name,
            u.user_id,
            u.user_firstname,
            u.user_lastname,
            tc.trans_cat_id,
            tc.trans_cat_name,
            t.start_date,
            t.end_date,
            s.status_id,
            s.status_name,
            CONCAT(u.user_firstname, ' ', u.user_lastname) AS full_name
        FROM
            transections t
        LEFT JOIN
            items i ON t.item_id = i.item_id 
        LEFT JOIN
            users u ON t.user_id = u.user_id
        LEFT JOIN
            transection_category tc ON t.trans_cat_id = tc.trans_cat_id
        LEFT JOIN
            status s ON t.status_id = s.status_id
        LEFT JOIN
            units un ON i.item_unit = un.unit_id
        LEFT JOIN
            item_category ic ON i.item_id = ic.item_cat_id`
      )
      .then(([rows]) => rows)
      .catch((error) => {
        console.error("Error getting transections:", error);
        throw error;
      });
  },

  getTransectionById: (transId) => {
    return pool
      .promise()
      .query(
        `SELECT
            t.trans_id,
            i.item_id,
            i.item_name,
            ic.item_cat_name,
            t.qty,
            un.unit_name,
            u.user_id,
            u.user_firstname,
            u.user_lastname,
            tc.trans_cat_id,
            tc.trans_cat_name,
            t.start_date,
            t.end_date,
            s.status_id,
            s.status_name
        FROM
            transections t
        LEFT JOIN
            items i ON t.item_id = i.item_id 
        LEFT JOIN
            users u ON t.user_id = u.user_id
        LEFT JOIN
            transection_category tc ON t.trans_cat_id = tc.trans_cat_id
        LEFT JOIN
            status s ON t.status_id = s.status_id
        LEFT JOIN
            units un ON i.item_unit = un.unit_id
        LEFT JOIN
            item_category ic ON i.item_id = ic.item_cat_id
        WHERE 
            t.trans_id = ?`,
        [transId]
      )
      .then(([rows]) => rows[0])
      .catch((error) => {
        console.error("Error getting transection by ID:", error);
        throw error;
      });
  },

  createTransection: (newTransaction) => {
    const {
      item_id,
      user_id,
      qty,
      trans_cat_id,
      start_date,
      end_date,
      status_id,
    } = newTransaction;

    return pool
      .promise()
      .query(
        `INSERT INTO transections 
            (item_id, user_id, qty, trans_cat_id, start_date, end_date, status_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [item_id, user_id, qty, trans_cat_id, start_date, end_date, status_id]
      )
      .then((result) => {
        const insertedId = result.insertId;
        // Update item_remain in the items table
        return pool
          .promise()
          .query(
            `UPDATE items 
          SET item_remain = item_remain - ? 
          WHERE item_id = ?`,
            [qty, item_id]
          )
          .then(() => {
            return { trans_id: insertedId, ...newTransaction };
          });
      })
      .catch((error) => {
        console.error("Error creating transaction:", error);
        throw error;
      });
  },

  updateTransection: (transId, updatedTransection) => {
    const {
      item_id,
      user_id,
      qty,
      trans_cat_id,
      start_date,
      end_date,
      status_id,
    } = updatedTransection;

    return pool
      .promise()
      .query(
        `UPDATE transections 
        SET item_id = ?, user_id = ?, qty = ?, trans_cat_id = ?, 
            start_date = ?, end_date = ?, status_id = ? 
        WHERE trans_id = ?`,
        [
          item_id,
          user_id,
          qty,
          trans_cat_id,
          start_date,
          end_date,
          status_id,
          transId,
        ]
      )
      .then(() => {
        return { trans_id: transId, ...updatedTransection };
      })
      .catch((error) => {
        console.error("Error updating transection:", error);
        throw error;
      });
  },

  deleteTransection: (transId) => {
    return pool
      .promise()
      .query("DELETE FROM transections WHERE trans_id = ?", [transId])
      .then(() => {
        return { message: "Transection deleted successfully" };
      })
      .catch((error) => {
        console.error("Error deleting transection:", error);
        throw error;
      });
  },

  returnItemsAndUpdate: async (transId, data) => {
    const { qty, itemId } = data;
    try {
      // Update the status of the transaction
      await pool.promise().query(
        `UPDATE transections 
         SET status_id = 1002 
         WHERE trans_id = ?`,
        [transId]
      );

      // Update the items table to increase the item_remain by qty
      await pool.promise().query(
        `UPDATE items 
         SET item_remain = item_remain + ? 
         WHERE item_id = ?`,
        [qty, itemId]
      );

      return { message: "Items returned and tables updated successfully" };
    } catch (error) {
      console.error("Error returning items and updating tables:", error);
      throw error;
    }
  },
};

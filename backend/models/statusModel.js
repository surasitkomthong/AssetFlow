const { pool } = require("../db/db-config");

const statusModel = {
  getAllStatuses: () => {
    return pool
      .promise()
      .query("SELECT * FROM status")
      .then(([rows]) => rows)
      .catch((error) => {
        console.error("Error getting statuses:", error);
        throw error;
      });
  },

  getStatusById: (statusId) => {
    return pool
      .promise()
      .query("SELECT * FROM status WHERE status_id = ?", [statusId])
      .then(([rows]) => rows[0])
      .catch((error) => {
        console.error("Error getting status by ID:", error);
        throw error;
      });
  },

  createStatus: (newStatus) => {
    const { status_name } = newStatus;
    return pool
      .promise()
      .query("INSERT INTO status (status_name) VALUES (?)", [status_name])
      .then((result) => ({ id: result.insertId, ...newStatus }))
      .catch((error) => {
        console.error("Error creating status:", error);
        throw error;
      });
  },

  updateStatus: (statusId, updatedStatus) => {
    const { status_name } = updatedStatus;
    return pool
      .promise()
      .query("UPDATE status SET status_name = ? WHERE status_id = ?", [
        status_name,
        statusId,
      ])
      .then(() => ({ id: statusId, ...updatedStatus }))
      .catch((error) => {
        console.error("Error updating status:", error);
        throw error;
      });
  },

  deleteStatus: (statusId) => {
    return pool
      .promise()
      .query("DELETE FROM status WHERE status_id = ?", [statusId])
      .then(() => ({ id: statusId, message: "Status deleted successfully" }))
      .catch((error) => {
        console.error("Error deleting status:", error);
        throw error;
      });
  },
};

module.exports = statusModel;

const { pool } = require("../db/db-config");

module.exports = {
  getAllUsers: () => {
    return pool
      .promise()
      .query("SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) AS full_name FROM users")
      .then(([results]) => results)
      .catch((err) => {
        console.log(err);
        throw new Error("Error fetching users");
      });
  },

  getUserById: (userId) => {
    return pool
      .promise()
      .query("SELECT * FROM users WHERE user_id = ?", [userId])
      .then(([results]) => results[0])
      .catch((err) => {
        console.log(err);
        throw new Error("Error fetching user by ID");
      });
  },

  createUser: (userData) => {
    const { user_firstname, user_lastname } = userData;
    return pool
      .promise()
      .query(
        "INSERT INTO users (user_firstname, user_lastname) VALUES (?, ?)",
        [user_firstname, user_lastname]
      )
      .then(([result]) => {
        return { id: result.insertId, ...userData };
      })
      .catch((err) => {
        console.log(err);
        throw new Error("Error creating user");
      });
  },

  updateUser: (userId, userData) => {
    const { user_firstname, user_lastname } = userData;
    return pool
      .promise()
      .query(
        "UPDATE users SET user_firstname = ?, user_lastname = ? WHERE user_id = ?",
        [user_firstname, user_lastname, userId]
      )
      .then(() => {
        return { id: userId, ...userData };
      })
      .catch((err) => {
        console.log(err);
        throw new Error("Error updating user");
      });
  },

  deleteUser: (userId) => {
    return pool
      .promise()
      .query("DELETE FROM users WHERE user_id = ?", [userId])
      .then(() => {
        return { message: "User deleted successfully" };
      })
      .catch((err) => {
        console.log(err);
        throw new Error("Error deleting user");
      });
  }
};

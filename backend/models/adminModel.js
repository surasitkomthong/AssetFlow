const bcrypt = require("bcrypt");
const { pool } = require("../db/db-config");
const jwt = require("jsonwebtoken");

module.exports = {
  queryAllAdmins: () => {
    return pool
      .promise()
      .query("SELECT * FROM admins")
      .then(([results]) => results)
      .catch((err) => console.log(err));
  },

  queryAdminById: (id) => {
    return pool
      .promise()
      .query("SELECT * FROM admins WHERE admin_id = ?", [id])
      .then(([results]) => results[0])
      .catch((err) => console.log(err));
  },

  createAdmin: async (admin) => {
    const { admin_name, admin_user, admin_pass } = admin;
    // const hashedPassword = await bcrypt.hash(admin_pass, 10); // hash รหัสผ่าน

    return pool
      .promise()
      .query(
        "INSERT INTO admins (admin_name, admin_user, admin_pass) VALUES (?, ?, ?)",
        [admin_name, admin_user, admin_pass]
      )
      .then(([result]) => {
        return { id: result.insertId, ...admin };
      })
      .catch((err) => console.log(err));
  },

  updateAdmin: (id, admin) => {
    const { admin_name } = admin;
    return pool
      .promise()
      .query("UPDATE admins SET admin_name = ? WHERE admin_id = ?", [
        admin_name,
        id,
      ])
      .then(() => {
        return { id, admin_name };
      })
      .catch((err) => console.log(err));
  },

  deleteAdmin: (id) => {
    return pool
      .promise()
      .query("DELETE FROM admins WHERE admin_id = ?", [id])
      .then(() => {
        return { message: "Admin deleted successfully." };
      })
      .catch((err) => console.log(err));
  },

  loginAdmin: async (admin) => {
    const { admin_user, admin_pass } = admin;

    try {
      const [results] = await pool
        .promise()
        .query("SELECT * FROM admins WHERE admin_user = ?", [admin_user]);

      if (results.length === 0) {
        return { error: "Invalid credentials" };
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(admin_pass, user.admin_pass);

      if (!passwordMatch) {
        return { error: "Invalid credentials" };
      }

      const token = jwt.sign({ id: user.admin_id }, "superSecret", {
        expiresIn: "3h",
      });

      return { message: "Login successful", token };
    } catch (error) {
      console.error("Database error:", error);
      return { error: "Database error" };
    }
  },
};

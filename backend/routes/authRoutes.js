import { pool } from "../db/db-config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default function authRoutes(app) {
  app.post("/login", (req, res) => {
    const { admin_user, admin_pass } = req.body;

    pool.query(
      "SELECT * FROM admins WHERE admin_user = ?",
      [admin_user], 
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const admin = result[0];

        bcrypt.compare(admin_pass, admin.admin_pass, (err, isMatch) => {
          if (err) {
            console.error("Password comparison error:", err);
            return res
              .status(500)
              .json({ message: "Password comparison error" });
          }

          if (isMatch) {
            const token = jwt.sign({ id: admin.admin_id }, "superSecret", {
              expiresIn: "3h",
            });
            res.json({ message: "Login successful", token });
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        });
      }
    );
  });
}

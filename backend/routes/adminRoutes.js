const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admins Endpoints
router.get("/api/admins", adminController.getAllAdmins);
router.get("/api/admin/:id", adminController.getAdminById);
router.post("/api/admins", adminController.createAdmin);
router.put("/api/admin/:id", adminController.updateAdmin);
router.delete("/api/admin/:id", adminController.deleteAdmin);
router.post("/api/admin/login", adminController.adminLogin)

module.exports = router;

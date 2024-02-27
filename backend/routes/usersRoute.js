const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Users Endpoints
router.get("/api/users", userController.getAllUsers);
router.get("/api/user/:id", userController.getUserById);
router.post("/api/users", userController.createUser);
router.put("/api/user/:id", userController.updateUser);
router.delete("/api/user/:id", userController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const transectionsController = require("../controllers/transectionsController");

router.get("/api/transections", transectionsController.getAllTransections);
router.get("/api/transection/:id", transectionsController.getTransectionById);
router.post("/api/transections", transectionsController.createTransection);
router.put("/api/transection/:id", transectionsController.updateTransection);
router.delete("/api/transection/:id", transectionsController.deleteTransection);
router.put("/api/transection-return/:id", transectionsController.returnItemsAndUpdate);

module.exports = router;

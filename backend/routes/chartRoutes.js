const express = require("express");
const { getMonthlySales } = require("../controllers/chartController");
const router = express.Router();

// Define route for chart data
router.get("/monthly-sales", getMonthlySales);

module.exports = router; // Export router correctly

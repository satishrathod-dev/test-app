const express = require("express");
const { getStatistics } = require("../controllers/statisticsController");
const router = express.Router();

// Define route for statistics
router.get("/statistics", getStatistics);

module.exports = router; // Export router correctly

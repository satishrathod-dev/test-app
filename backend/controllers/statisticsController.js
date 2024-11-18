const Transaction = require("../models/Transaction");

const getStatistics = async (req, res) => {
  try {
    // Get total transactions count
    const totalTransactions = await Transaction.countDocuments();

    // Get total sales (sum of all prices)
    const totalSales = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    // Get average price
    const averagePrice = await Transaction.aggregate([
      { $group: { _id: null, average: { $avg: "$price" } } },
    ]);

    res.status(200).json({
      totalTransactions,
      totalSales: totalSales[0]?.total || 0,
      averagePrice: averagePrice[0]?.average || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch statistics",
      error: err.message,
    });
  }
};

module.exports = { getStatistics };

const Transaction = require("../models/Transaction");

const getMonthlySales = async (req, res) => {
  try {
    // Aggregate total sales by month
    const salesByMonth = await Transaction.aggregate([
      {
        $project: {
          month: { $month: "$dateOfSale" }, // Extract the month from the date
          year: { $year: "$dateOfSale" }, // Extract the year from the date
          price: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
    ]);

    // Format the result to return readable month names (optional)
    const formattedSales = salesByMonth.map((item) => ({
      month: `${item._id.month}-${item._id.year}`,
      totalSales: item.totalSales,
    }));

    res.status(200).json(formattedSales);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch monthly sales data",
      error: err.message,
    });
  }
};

module.exports = { getMonthlySales };

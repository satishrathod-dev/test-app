const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  // Destructuring elements
  const { page = 1, perPage = 10, search = "", month = "" } = req.query;

  // Search Query
  let query = {};

  //   if (search) {
  //     query = {
  //       $or: [
  //         { title: { $regex: search, $options: "i" } },
  //         { description: { $regex: search, $options: "i" } },
  //         { price: { $regex: search, $options: "i" } },
  //       ],
  //     };
  //   }

  if (search) {
    // Check if the search string can be parsed into a valid number (for price search)
    const priceQuery = parseFloat(search);

    // If it's a valid number, add price search condition to the query
    if (!isNaN(priceQuery)) {
      query.price = priceQuery;
    } else {
      // Otherwise, use regex search for title, description
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
  }

  //   Filter by month
  //   if (month) {
  //     const formattedMonth = month.padStart(2, "0");
  //     query.dateOfSale = { $regex: `-${formattedMonth}-` };
  //   }
  if (month) {
    // Ensure the month is in the correct format (i.e., two digits like "01", "02", ...)
    const formattedMonth = month.padStart(2, "0");
    const startOfMonth = new Date(`2021-${formattedMonth}-01T00:00:00Z`); // Example: "2021-03-01"
    const endOfMonth = new Date(`2021-${formattedMonth}-01T00:00:00Z`);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Go to the next month, and adjust the range

    // Apply the date range filter (greater than or equal to start of the month, less than the next month)
    query.dateOfSale = {
      $gte: startOfMonth, // Greater than or equal to the start of the month
      $lt: endOfMonth, // Less than the start of the next month
    };
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage) //pagignation: skip documents
      .limit(Number(perPage)) //limit no. of results
      .sort({ dateOfSale: -1 });

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      total,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "failed to fetch transactions", error: err.message });
  }
};

module.exports = { getTransactions };

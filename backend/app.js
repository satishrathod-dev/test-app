const express = require("express");
const connectDb = require("./config/db");
const apiService = require("./services/apiService");
const Transaction = require("./models/Transaction");
const transactionRoutes = require("./routes/transactionRoutes");
const chartRoutes = require("./routes/chartRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const app = express();

// middleware to parse the json data
app.use(express.json());

// connect to MongoDB
connectDb();

// basic route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB Connected Successfully");
});

// api route
app.get("/populate-db", async (req, res) => {
  try {
    const data = await apiService();

    // Itering over each data and storing each fields data in mongoD
    for (const item of data) {
      const transaction = new Transaction({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        sold: item.sold,
        dateOfSale: new Date(item.dateOfSale), // converting string to date(as I am getting date in string format from api)
      });
      // save each transaction in the database
      await transaction.save();
    }
    res.status(200).send("Data populated with all the transactions");
  } catch (error) {
    res.status(500).send("Error populating data in the database" + error);
  }
});

// routes:
// routes for the transactions
app.use(
  "/api/transactions",
  (req, res, next) => {
    console.log("Transactions route hit"); // remove this line
    next();
  },
  transactionRoutes
);

// routes for the charts
app.use("/api/charts", chartRoutes);

// routes for the statistics
app.use("/api/statistics", statisticsRoutes);

// server to listen on `port`
// const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`Server started on port 5000`);
});

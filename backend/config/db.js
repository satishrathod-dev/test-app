const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); // exit if connection fails
  }
};

module.exports = connectDb;

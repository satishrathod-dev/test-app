const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discription: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  sold: { type: Boolean, reuired: true },
  dateOfSale: { type: Date, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

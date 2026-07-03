const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: String,
  items: Array,
  subtotal: Number,
  tax: Number,
  amount: Number,
  method: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
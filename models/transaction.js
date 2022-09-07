const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 200,
    required: [ true, "Name of transaction required" ],
  },
  value: {
    type: Number,
    min: [0, "Must be at least 6, you got {VALUE}"],
    max: [100000000, "max is 💯 million"],
    required: "Enter A Numerical Value",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

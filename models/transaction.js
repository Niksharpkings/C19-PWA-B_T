const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: `Enter a transaction name`
    },
    value: {
      type: Number,
      required: `Enter a numerical value`
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

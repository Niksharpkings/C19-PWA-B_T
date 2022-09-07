const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 200,
    required: [true, "Name of transaction required"],
  },
  value: {
    type: Number,
    required: "Enter A Numerical Value",
  },
  date: {
    type: Date,
    default: Date.now,
  },
},
  {
    toJSON: {
      virtuals: true,
    },
    id: false
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Record = mongoose.model("record", recordSchema);
module.exports = Record;

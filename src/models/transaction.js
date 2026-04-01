const mongoose = require("mongoose");
const user = require("./user");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["income", "expense"],
        message: `{VALUE} is not supported!`,
      },
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true,
    }
  },

  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);

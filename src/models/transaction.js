const mongoose = require("mongoose");
const user = require("./user");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },

    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: [
          // income categories
          "salary",
          "freelance",
          "investment",
          "business",
          "other_income",
          // expense categories
          "rent",
          "food",
          "transport",
          "utilities",
          "healthcare",
          "education",
          "entertainment",
          "other_expense",
        ],
        message: "Invalid category",
      },
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,   
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,   
      ref: "User",                            
      required: [true, "Created by is required"],
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);

const Transaction = require("../models/transaction");
const { validationTransaction, validEditTransaction } = require("../utils/validation");

const createTransaction = async (req, res) => {
  try {
    validationTransaction(req.body);

    const {amount, type, category, date, notes} = req.body;
    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date: date || Date.now(),
      notes: notes || "",
      createdBy : req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error: ", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      if (!["income", "expense"].includes(req.query.type)) {
        return res.status(400).json({
          success: false,
          message: "Type must be income or expense",
        });
      }
      filter.type = req.query.type;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if(req.query.startDate) {
        filter.date.$gte = new Date( req.query.startDate );
      }
      if(req.query.endDate) {
        filter.date.$lte = new Date( req.query.endDate );
      }
    }

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;

    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
    .populate("createdBy", "name email role")
    .sort({date: -1})
    .skip(skip)
    .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get all transactions error: ", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    .populate("createdBy", "name email role");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction fetched successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Transaction by id error", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    validEditTransaction(req.body);

    Object.keys(req.body).forEach((key) => {
      transaction[key] = req.body[key];
    });
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Transaction by id error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    console.error("Delete transaction error: ", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};


module.exports = {createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction};
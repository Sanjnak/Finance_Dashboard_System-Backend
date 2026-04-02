const Transaction = require("../models/transaction");

const summary = async (req, res) => {
  try {
    const total = await Transaction.aggregate([
      { $group: { _id: "$type", totalAmt: { $sum: "$amount" } } },
    ]);
    const totalIncome = total.find((t) => t._id === "income")?.totalAmt || 0;
    const totalExpense = total.find((t) => t._id === "expense")?.totalAmt || 0;
    const netBalance = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      message: "Summary found.",
      TotalIncome: totalIncome,
      TotalExpense: totalExpense,
      NetBalance: netBalance,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const categoryWise = async (req, res) => {
  try {
    const categories = await Transaction.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);
    return res.status(200).json({
      success: true,
      message: "Category Wise totals found.",
      categories,
    });
  } catch (error) {
    console.error("Category Wise error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const monthlyTrends = async (req, res) => {
  try {
    const monthly = await Transaction.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);
    return res.status(200).json({
      success: true,
      message: "Monthly Trends found.",
      monthly,
    });
  } catch (error) {
    console.error("Monthly Trends error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const recent = async (req, res) => {
  try {
    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(5)
      .populate("createdBy", "name email");;

    return res.status(200).json({
      success: true,
      message: "Recent Transactions found.",
      recentTransactions,
    });
  } catch (error) {
    console.error("Recent error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

module.exports = { summary, categoryWise, monthlyTrends, recent };

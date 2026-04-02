const express = require("express");
const transactionRouter = express.Router();
const authUser = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const {createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction} = require("../controllers/transaction.controller");

transactionRouter.get("/", authUser, getAllTransactions);
transactionRouter.get("/:id", authUser, getTransactionById);

transactionRouter.post("/", authUser, allowRoles("admin"), createTransaction);
transactionRouter.patch("/:id", authUser, allowRoles("admin"), updateTransaction);
transactionRouter.delete("/:id", authUser, allowRoles("admin"), deleteTransaction);

module.exports = transactionRouter;




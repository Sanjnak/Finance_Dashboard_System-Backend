const validator = require("validator");

const validationSignup = (data) => {
  const { name, email, password, role, status } = data;

  if (!name) {
    throw Error("Name is invalid!");
  }
  if (name.length < 2 || name.length > 50) {
    throw Error("name is too short or long!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email!");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is weak!");
  }

};

const validationTransaction = (data) => {
  const { amount, type, category, date } = data;
  if (!amount) {
    throw Error("Amount is invalid!");
  }
  if(amount <= 0) {
    throw Error("Amount is invalid");
  }

  const types = ["income", "expense"];
  if (!types.includes(type)) {
    throw Error("Type is invalid!");
  }

  const categories = ["salary", "freelance", "investment", "business", "other_income", "rent", "food", "transport", "utilities", "healthcare", "education", "entertainment", "other_expense"];
  if (!categories.includes(category)) {
    throw Error("Category is invalid!");
  }

  if (!date) {
    throw Error("Date is invalid!");
  }
};

const validEditTransaction = (data) => {
  
  const allowedTransactionUpdate = ["amount", "type", "category", "notes", "date"];
  const isAllowedTransactionUpdate = Object.keys(data).every((element) => allowedTransactionUpdate.includes(element));
  if(!isAllowedTransactionUpdate) {
    throw Error("No updatable fields!!");
  }

  const { amount, type, category } = data;
  if(amount <= 0) {
    throw Error("Amount is invalid");
  }

  const types = ["income", "expense"];
  if (type && !types.includes(type)) {
    throw Error("Type is invalid!");
  }

  const categories = ["salary", "freelance", "investment", "business", "other_income", "rent", "food", "transport", "utilities", "healthcare", "education", "entertainment", "other_expense"];
  if (category && !categories.includes(category)) {
    throw Error("Category is invalid!");
  }

}


module.exports = {validationSignup, validationTransaction, validEditTransaction}

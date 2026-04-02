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

module.exports = {validationSignup}

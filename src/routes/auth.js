const express = express();
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {validationSignup} = require("../utils/validation");
const {login, signup, logout} = require("../controllers/auth.controller");


const User = require("../models/user");

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/logout", logout);

module.exports = authRouter;

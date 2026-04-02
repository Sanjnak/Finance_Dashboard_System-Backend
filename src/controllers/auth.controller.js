const bcrypt = require("bcrypt");
const { validationSignup } = require("../utils/validation");

const User = require("../models/user");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
    const validUser = await User.findOne({ email }).select("+password");
    if (!validUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (validUser.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact an admin.",
      });
    }

    const result = await validUser.verifyPassword(password);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = await validUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS only)
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: validUser._id,
        name: validUser.name,
        email: validUser.email,
        role: validUser.role,
        status: validUser.status,
      },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const signup = async (req, res) => {
  try {
    validationSignup(req.body); // validation

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hash = await bcrypt.hash(password, 5); //hashing

    const user = new User(req.body);
    user.password = hash;
    await user.save();

    const token = await user.getJWT(); // or jwt.sign()

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS only)
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      message: "User signed up successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)  
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
};

module.exports = { login, signup, logout };

const User = require("../models/user");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Get my profile error", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } });
    return res.status(200).json({
      success: true,
      message: "All users fetched successfully.",
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get all users error", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Get user by id error", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["admin", "analyst", "viewer"];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be admin, analyst or viewer!",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "User cannot modify its own role",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfuly`,
      user,
    });
  } catch (error) {
    console.error("Update user role error: ", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
const updateUserStatus = async (req, res) => {
    try {
    const { status } = req.body;
    const allowedStatus = ["active", "inactive"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "User cannot modify its own status",
      });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfuly`,
      user,
    });
  } catch (error) {
    console.error("Update user status error", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
const deleteUser = async (req, res) => {
    
  try {
    if(req.user._id.toString() === req.params.id) {
        return res.status(400).json({
            success: false,
            message: "User cannot delete its own profile"
        })
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user by id error", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }

};

module.exports = {
  getMe,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};

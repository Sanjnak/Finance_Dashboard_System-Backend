const express = require("express");
const userRouter = express.Router();
const authUser = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const {
  getMe,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../controllers/user.controller");

userRouter.get("/me", authUser, getMe); //get own profile

userRouter.get("/", authUser, allowRoles("admin"), getAllUsers); //get all the users of the system

userRouter.get("/:id", authUser, allowRoles("admin"), getUserById); //get a specific user by providing its id

userRouter.patch("/:id/role", authUser, allowRoles("admin"), updateUserRole); //update a specific user role

userRouter.patch(
  "/:id/status",
  authUser,
  allowRoles("admin"),
  updateUserStatus,
); //update a specific user status

userRouter.delete("/:id", authUser, allowRoles("admin"), deleteUser); //delete a specific user

module.exports = userRouter;

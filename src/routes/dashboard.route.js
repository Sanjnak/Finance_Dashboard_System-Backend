const express = require("express");
const dashboardRouter = express.Router();
const authUser = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const {summary, categoryWise, monthlyTrends, recent} = require("../controllers/dashboard.controller");

dashboardRouter.get("/summary", authUser, allowRoles("admin", "analyst"), summary);
dashboardRouter.get("/categoryWise", authUser, allowRoles("admin", "analyst"), categoryWise);
dashboardRouter.get("/monthlyTrends", authUser, allowRoles("admin", "analyst"), monthlyTrends);
dashboardRouter.get("/recent", authUser, allowRoles("admin", "analyst"), recent);

module.exports = dashboardRouter;